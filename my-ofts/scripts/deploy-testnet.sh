#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

bold() { printf "\033[1m%s\033[0m\n" "$*"; }
info() { printf "[INFO] %s\n" "$*"; }
err() { printf "[ERROR] %s\n" "$*" >&2; }

ENV_MODE="${ENV:-dev}"
ENV_FILE=".env.${ENV_MODE}"
DEPLOY_RESET="${DEPLOY_RESET:-0}"

if [[ ! -f "${ENV_FILE}" ]]; then
  err "${ENV_FILE} not found. Create it first."
  exit 1
fi

if [[ "${DEPLOY_RESET}" == "1" ]]; then
  bold "Reset: backing up existing deployments"
  TS="$(date +%Y%m%d-%H%M%S)"
  if [[ -d deployments ]]; then
    mkdir -p deployments-backup
    mv deployments "deployments-backup/${TS}"
    info "Moved deployments to deployments-backup/${TS}"
  fi
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
  err "MODE is missing in ${ENV_FILE}. Set MODE=test (or MODE=dev)."
  exit 1
fi

if [[ "${MODE_VAL}" != "test" && "${MODE_VAL}" != "dev" ]]; then
  err "MODE must be 'test' (or 'dev') for testnet deploy. Current: ${MODE_VAL}"
  exit 1
fi

if [[ -z "${PRIVATE_KEY_VAL}" ]]; then
  err "PRIVATE_KEY is required in .env"
  exit 1
fi

bold "Step 1: Deploy WancashVesting"
bunx hardhat deploy --tags WancashVesting --network bsc

bold "Step 2: Set VESTING_CONTRACT in .env"
VESTING_ADDR="$(node -e "const fs=require('fs');try{const j=JSON.parse(fs.readFileSync('deployments/bsc/WancashVesting.json','utf8'));console.log(j.address||'');}catch(e){console.log('');}")"
if [[ -n "${VESTING_ADDR}" ]]; then
  info "Detected WancashVesting: ${VESTING_ADDR}"
else
  read -r -p "Enter deployed WancashVesting address: " VESTING_ADDR
fi
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

bold "Step 3: Deploy Wancash (OFT) to BSC testnet"
bunx hardhat lz:deploy --tags Wancash --network bsc

bold "Step 4: Auto-detect deployed contract addresses"
detect_addr() {
  local network="$1"
  local name="$2"
  node -e "const fs=require('fs');try{const j=JSON.parse(fs.readFileSync('deployments/${network}/${name}.json','utf8'));console.log(j.address||'');}catch(e){console.log('');}"
}
set_env_key() {
  local key="$1"
  local value="$2"
  if [[ -z "${value}" ]]; then
    return
  fi
  if grep -q "^${key}=" .env; then
    sed -i "s/^${key}=.*/${key}=${value}/" .env
  else
    printf "\n%s=%s\n" "${key}" "${value}" >> .env
  fi
}

WCH_BSC="$(detect_addr bsc Wancash)"
WCH_POLY="$(detect_addr polygon Wancash)"
WCH_ETH="$(detect_addr ethereum Wancash)"
WCH_AVA="$(detect_addr avalance Wancash)"

if [[ -n "${WCH_BSC}" ]]; then info "Detected Wancash (BSC): ${WCH_BSC}"; fi
if [[ -n "${WCH_POLY}" ]]; then info "Detected Wancash (Polygon): ${WCH_POLY}"; fi
if [[ -n "${WCH_ETH}" ]]; then info "Detected Wancash (Ethereum): ${WCH_ETH}"; fi
if [[ -n "${WCH_AVA}" ]]; then info "Detected Wancash (Avalanche): ${WCH_AVA}"; fi

if [[ -z "${WCH_BSC}" ]]; then
  info "Wancash deployment not found. Ensure CONTRACT_NAME=Wancash in ${ENV_FILE} and re-run deploy."
  read -r -p "Enter deployed Wancash token (BSC) address: " WCH_BSC
fi
set_env_key BSC_CONTRACT "${WCH_BSC}"
set_env_key POLY_CONTRACT "${WCH_POLY}"
set_env_key ETH_CONTRACT "${WCH_ETH}"
set_env_key AVA_CONTRACT "${WCH_AVA}"

export BSC_CONTRACT="${WCH_BSC}"
BSC_TOKEN_ADDR="${WCH_BSC}"

bold "Step 5: Initialize Vesting"
read -r -p "Enter stable token address (USDT/BUSD, testnet): " USDT_ADDR
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
  POOL_ADDR="$(bunx hardhat vesting:resolve-pool --network bsc --token "${BSC_TOKEN_ADDR}" --stable "${USDT_ADDR}" --factory "${FACTORY_ADDR}" --fee "${FEE_VAL}" | tail -n 1)"
  if [[ -z "${POOL_ADDR}" ]]; then
    err "Failed to resolve pool. Ensure liquidity exists or pass --pool."
    exit 1
  fi
  info "Resolved pool: ${POOL_ADDR}"
fi

bunx hardhat vesting:init \
  --network bsc \
  --vesting "${VESTING_CONTRACT}" \
  --token "${BSC_TOKEN_ADDR}" \
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
      --contract "${BSC_TOKEN_ADDR}" \
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
