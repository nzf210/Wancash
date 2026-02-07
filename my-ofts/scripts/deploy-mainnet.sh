#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

bold() { printf "\033[1m%s\033[0m\n" "$*"; }
info() { printf "[INFO] %s\n" "$*"; }
err() { printf "[ERROR] %s\n" "$*" >&2; }

ENV_MODE="${ENV:-prod}"
ENV_FILE=".env.${ENV_MODE}"

if [[ ! -f "${ENV_FILE}" ]]; then
  err "${ENV_FILE} not found. Create it first."
  exit 1
fi

cp "${ENV_FILE}" .env

get_env() {
  local key="$1"
  local line
  line="$(grep -E "^${key}=" .env | tail -n 1 || true)"
  if [[ -z "${line}" ]]; then
    printf ""
    return
  fi
  printf "%s" "${line#*=}"
}

MODE_VAL="$(get_env MODE)"
PRIVATE_KEY_VAL="$(get_env PRIVATE_KEY)"

if [[ -z "${MODE_VAL}" ]]; then
  err "MODE is missing in ${ENV_FILE}. Set MODE=main."
  exit 1
fi

if [[ "${MODE_VAL}" != "main" ]]; then
  err "MODE must be 'main' for mainnet deploy. Current: ${MODE_VAL}"
  exit 1
fi

if [[ -z "${PRIVATE_KEY_VAL}" ]]; then
  err "PRIVATE_KEY is required in ${ENV_FILE}"
  exit 1
fi

bold "Step 1: Deploy WancashVesting"
bunx hardhat deploy --tags WancashVesting --network bsc

bold "Step 2: Set VESTING_CONTRACT in .env"
read -r -p "Enter deployed WancashVesting address: " VESTING_ADDR
if [[ -z "${VESTING_ADDR}" ]]; then
  err "VESTING_CONTRACT address is required."
  exit 1
fi
if grep -q "^VESTING_CONTRACT=" .env; then
  sed -i "s/^VESTING_CONTRACT=.*/VESTING_CONTRACT=${VESTING_ADDR}/" .env
else
  printf "\nVESTING_CONTRACT=%s\n" "${VESTING_ADDR}" >> .env
fi
export VESTING_CONTRACT="${VESTING_ADDR}"

bold "Step 3: Deploy Wancash (OFT) to BSC mainnet"
bunx hardhat lz:deploy --tags Wancash --network bsc

bold "Step 4: Set BSC_CONTRACT in .env"
read -r -p "Enter deployed Wancash token (BSC) address: " WCH_ADDR
if [[ -z "${WCH_ADDR}" ]]; then
  err "BSC_CONTRACT address is required."
  exit 1
fi
if grep -q "^BSC_CONTRACT=" .env; then
  sed -i "s/^BSC_CONTRACT=.*/BSC_CONTRACT=${WCH_ADDR}/" .env
else
  printf "\nBSC_CONTRACT=%s\n" "${WCH_ADDR}" >> .env
fi
export BSC_CONTRACT="${WCH_ADDR}"

bold "Step 5: Initialize Vesting"
read -r -p "Enter stable token address (USDT/BUSD, mainnet): " USDT_ADDR
read -r -p "Enter Pancake V3 pool WCH/STABLE address (leave blank to auto-resolve): " POOL_ADDR
read -r -p "Enter Treasury address: " TREASURY_ADDR

if [[ -z "${USDT_ADDR}" || -z "${TREASURY_ADDR}" ]]; then
  err "USDT and Treasury addresses are required."
  exit 1
fi

if [[ -z "${POOL_ADDR}" ]]; then
  FACTORY_ADDR="$(get_env PANCAKE_V3_FACTORY)"
  FEE_VAL="$(get_env PANCAKE_V3_FEE)"
  if [[ -z "${FACTORY_ADDR}" || -z "${FEE_VAL}" ]]; then
    err "Pool not provided. Set PANCAKE_V3_FACTORY and PANCAKE_V3_FEE in ${ENV_FILE} or pass pool address."
    exit 1
  fi
  info "Resolving pool from factory..."
  POOL_ADDR="$(bunx hardhat vesting:resolve-pool --network bsc --token "${BSC_CONTRACT}" --stable "${USDT_ADDR}" --factory "${FACTORY_ADDR}" --fee "${FEE_VAL}" | tail -n 1)"
  if [[ -z "${POOL_ADDR}" ]]; then
    err "Failed to resolve pool. Ensure liquidity exists or pass --pool."
    exit 1
  fi
  info "Resolved pool: ${POOL_ADDR}"
fi

bunx hardhat vesting:init \
  --network bsc \
  --vesting "${VESTING_CONTRACT}" \
  --token "${BSC_CONTRACT}" \
  --usdt "${USDT_ADDR}" \
  --pool "${POOL_ADDR}" \
  --treasury "${TREASURY_ADDR}"

bold "Optional: Set whitelist limits"
read -r -p "Do you want to set exclude-from-limits batch now? (y/N): " SET_LIMITS
if [[ "${SET_LIMITS}" == "y" || "${SET_LIMITS}" == "Y" ]]; then
  read -r -p "Enter comma-separated addresses to exclude: " EXCLUDE_LIST
  if [[ -n "${EXCLUDE_LIST}" ]]; then
    bunx hardhat lz:limits:exclude-batch \
      --network bsc \
      --contract "${BSC_CONTRACT}" \
      --accounts "${EXCLUDE_LIST}" \
      --excluded true
  fi
fi

bold "Optional: Wire LayerZero"
read -r -p "Do you want to run LayerZero wire now? (y/N): " DO_WIRE
if [[ "${DO_WIRE}" == "y" || "${DO_WIRE}" == "Y" ]]; then
  bunx hardhat lz:oapp:wire --oapp-config layerzero.config.ts
fi

bold "Done."
