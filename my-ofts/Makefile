include .env
export

# Dynamic Cross-Chain Makefile
.PHONY: help setup-env list-networks

# Colors
RED=\033[0;31m
GREEN=\033[0;32m
YELLOW=\033[0;33m
NC=\033[0m

# Default target
help:
	@echo "🚀 Cross-Chain OFT Commands"
	@echo "=========================="
	@echo "Setup:"
	@echo "  setup-env          - Generate .env template"
	@echo "  list-networks      - Show all configured networks"
	@echo ""
	@echo "Deployment:"
	@echo "  deploy-all         - Deploy to all networks"
	@echo "  deploy-NETWORK     - Deploy to specific network (e.g. deploy-bsc)"
	@echo ""
	@echo "Cross-Chain Transfer:"
	@echo "  send FROM=src TO=dst AMOUNT=1.0 RECIPIENT=0xAddress"
	@echo ""
	@echo "Examples:"
	@echo "  make send FROM=bsc TO=ethereum AMOUNT=1.0 RECIPIENT=0x123..."
	@echo "  make send FROM=polygon TO=avalance AMOUNT=0.5 RECIPIENT=0x456..."
	@echo ""
	@echo "Peer Management:"
	@echo "  peer-setup FROM=bsc TO=sepolia"
	@echo "  peer-check NETWORK=bsc-testnet EID=40161"

op:
	npx hardhat lz:oapp:wire

dev:
	npx hardhat lz:deploy --tags WancashMock
	
dev-main:
	npx hardhat lz:deploy --tags Wancash

dev-stk:
	npx hardhat lz:deploy --tags EnhancedStaking

dev-stkn:
	npx hardhat lz:deploy --tags EnhancedStakingUsdt


# Verifikasi Contracts
c-conf:
	npx hardhat lz:oapp:config:get --oapp-config layerzero.config.ts

# Universal send command
send:
	@if [ -z "$(FROM)" ] || [ -z "$(TO)" ] || [ -z "$(AMOUNT)" ] || [ -z "$(RECIPIENT)" ]; then \
		echo "❌ Missing parameters!"; \
		echo "Usage: make send FROM=source_network TO=destination_network AMOUNT=amount RECIPIENT=address"; \
		echo "Example: make send FROM=bsc TO=ethereum AMOUNT=1.0 RECIPIENT=0x123..."; \
		exit 1; \
	fi
	@echo "🚀 Sending $(AMOUNT) tokens from $(FROM) to $(TO)"
	@npx hardhat --network $(FROM) lz:oft:send \
		--amount $(AMOUNT) \
		--dst $(TO) \
		--to $(RECIPIENT)

bsc-to-eth:
	@make send FROM=bsc TO=ethereum AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
bsc-to-poly:
	@make send FROM=bsc TO=polygon AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
bsc-to-ava:
	@make send FROM=bsc TO=avalance AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
bsc-to-root:
	@make send FROM=bsc TO=rootstock AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
bsc-to-arb:
	@make send FROM=bsc TO=arbitrum AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
eth-to-bsc:
	@make send FROM=ethereum TO=bsc AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
eth-to-poly:
	@make send FROM=ethereum TO=polygon AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
eth-to-ava:
	@make send FROM=ethereum TO=avalance AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
eth-to-root:
	@make send FROM=ethereum TO=rootstock AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
eth-to-arb:
	@make send FROM=ethereum TO=arbitrum AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
poly-to-bsc:
	@make send FROM=polygon TO=bsc AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
poly-to-eth:
	@make send FROM=polygon TO=ethereum AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
poly-to-ava:
	@make send FROM=polygon TO=avalance AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
poly-to-arb:
	@make send FROM=polygon TO=arbitrum AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
poly-to-root:
	@make send FROM=polygon TO=rootstock AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
ava-to-poly:
	@make send FROM=avalance TO=polygon AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
ava-to-eth:
	@make send FROM=avalance TO=ethereum AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
ava-to-bsc:
	@make send FROM=avalance TO=bsc AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
ava-to-root:
	@make send FROM=avalance TO=rootstock AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
ava-to-arb:
	@make send FROM=avalance TO=arbitrum AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
root-to-bsc:
	@make send FROM=rootstock TO=bsc AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
root-to-eth:
	@make send FROM=rootstock TO=ethereum AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
root-to-poly:
	@make send FROM=rootstock TO=polygon AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
root-to-ava:
	@make send FROM=rootstock TO=avalance AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
root-to-arb:
	@make send FROM=rootstock TO=arbitrum AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
arb-to-bsc:
	@make send FROM=arbitrum TO=bsc AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
arb-to-eth:
	@make send FROM=arbitrum TO=ethereum AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
arb-to-poly:
	@make send FROM=arbitrum TO=polygon AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
arb-to-ava:
	@make send FROM=arbitrum TO=avalance AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
arb-to-root:
	@make send FROM=arbitrum TO=rootstock AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))


# Predefined BSC to Sepolia peer setup
p-bsc-to-sepolia:
	@echo "Setting up BSC to Sepolia peers..."
	@make set-peers \
		network1=sepolia \
		network2=bsc-testnet \
		eid1=$(EID_SEPOLIA) \
		eid2=$(EID_BSC) \
		oapp1=$(ETH_CONTRACT) \
		oapp2=$(BSC_CONTRACT)

# Verification Contract
.PHONY: verify-poly
verify-poly:
	@echo "Verifying contract on Polygon Amoy..."
	npx hardhat verify:amoy --address $(POLY_CONTRACT) --network polygon
	@echo "Verification complete!"

.PHONY: verify-bsc
verify-bsc:
	@echo "Verifying contract on BSC Testnet..."
	npx hardhat verify:bsc --address $(BSC_CONTRACT) --network bsc
	@echo "Verification complete!"

.PHONY: verify-eth
verify-eth:
	@echo "Verifying contract on Sepolia Testnet..."
	npx hardhat verify:eth --address $(ETH_CONTRACT) --network ethereum
	@echo "Verification complete!"

.PHONY: verify-ava
verify-ava:
	@echo "Verifying contract on Fuji Avalance Testnet..."
	npx hardhat verify:fuji --address $(AVA_CONTRACT) --network avalance 
# 	--chain fuji-ava
	@echo "Verification complete!"

.PHONY: verify-root
verify-root:
	@echo "Verifying contract on Rootstock Testnet..."
	npx hardhat verify:root --address $(ROOT_CONTRACT) --network rootstock
	@echo "Verification complete!"

.PHONY: verify-arb
verify-arb:
	@echo "Verifying contract on Arb Testnet..."
	npx hardhat verify:arb --address $(ARB_CONTRACT) --network arbitrum
	@echo "Verification complete!"

#verify contact staking
v-staking:
	@if [ -z "$(STK_CONTRACT)" ] || [ -z "$(TOKEN)" ] || [ -z "$(CHANGEABLE)" ]; then \
		echo "${RED}Error: Missing required parameters${NC}"; \
		echo "Usage: make verify ADDRESS=0x... TOKEN=0x... CHANGEABLE=[true|false]"; \
		exit 1; \
	fi
	@echo "${YELLOW}Starting verification...${NC}"
	@echo "Contract: ${GREEN}$(ADDRESS)${NC}"
	@echo "Token: ${GREEN}$(TOKEN)${NC}"
	@echo "Changeable: ${GREEN}$(CHANGEABLE)${NC}"
	@echo "Network: ${GREEN}$(NETWORK)${NC}"
	@npx hardhat verify:staking \
		--address $(STK_CONTRACT) \
		--token $(TOKEN) \
		--changeable $(CHANGEABLE) \
		--network $(NETWORK)
	@echo "${GREEN}✓ Verification completed${NC}"


# Mint Token
mint-bsc:
	npx hardhat lz:oft:mint --contract $(BSC_CONTRACT) --network bsc --amount 10 --private-key $(PRIVATE_KEY)

mint-eth:
	npx hardhat lz:oft:mint --contract $(ETH_CONTRACT) --network arbitrum-testnet --amount 7 --private-key $(PRIVATE_KEY)

mint-amoy:
	npx hardhat lz:oft:mint --contract $(POLY_CONTRACT) --network polygon-testnet --amount 8 --private-key $(PRIVATE_KEY)


# Dynamic OFT_ADDRESS selection based on network
ifeq ($(NETWORK),bsc-testnet)
OFT_ADDRESS := $(BSC_CONTRACT)
else ifeq ($(NETWORK),polygon-amoy)
OFT_ADDRESS := $(POLY_CONTRACT)
else ifeq ($(NETWORK),sepolia-testnet)
OFT_ADDRESS := $(ETH_CONTRACT)
else ifeq ($(NETWORK),avalanche-fuji)
OFT_ADDRESS := $(AVAX_CONTRACT)
endif


.PHONY: debug-env
debug-env:
	@echo "BSC_CONTRACT = $(BSC_CONTRACT)"
	@echo "POLY_CONTRACT = $(POLY_CONTRACT)"


# Helper targets
.PHONY: list-eids
list-eids:
	@echo "BSC Testnet EID: $(EID_BSC_TESTNET)"
	@echo "Polygon Amoy EID: $(EID_POLYGON_AMOY)"
	@echo "Sepolia Testnet EID: $(EID_SEPOLIA_TESTNET)"

.PHONY: check-config
check-config:
	@echo "BSC Contract: $(BSC_CONTRACT)"
	@echo "Polygon Contract: $(POLY_CONTRACT)"
	@echo "ETH Contract: $(ETH_CONTRACT)"
	@echo "Receiver: $(WALLET_RECEIVER)"

c-deploy:
	cat deployments/bsc-testnet/MyOFTMock.json | jq '{address, abi}'

g-peer-bsc:
	@echo "Getting BSC peer to Amoy..."
	npx hardhat lz:oapp:peer:get --network bsc --eid 40267 --contract $(BSC_CONTRACT)
	@sleep 3
	@echo "Getting BSC peer to sepolia..."
	npx hardhat lz:oapp:peer:get --network bsc --eid 40161 --contract $(BSC_CONTRACT)

g-peer-amoy:
	@echo "Getting AMOY peer to BSC..."
	npx hardhat lz:oapp:peer:get --network polygon --eid 40102 --contract $(POLY_CONTRACT)
	@sleep 3
	@echo "Getting AMOY peer to sepolia..."
	npx hardhat lz:oapp:peer:get --network polygon --eid 40161 --contract $(POLY_CONTRACT)

g-peer-sepolia:
	@echo "Getting Sepolia peer to Amoy..."
	npx hardhat lz:oapp:peer:get --network arbitrum --eid 40267 --contract $(ETH_CONTRACT)
	@sleep 3
	@echo "Getting Sepolia peer to BSC..."
	npx hardhat lz:oapp:peer:get --network arbitrum --eid 40102 --contract $(ETH_CONTRACT)

db-bsc:
	@echo "Debugging BSC..."
	npx hardhat debug:lz:config --network bsc --contract $(BSC_CONTRACT)

db-amoy:
	@echo "Debugging Amoy..."
	npx hardhat debug:lz:config --network polygon --contract $(POLY_CONTRACT)

db-sepolia:
	@echo "Debugging BSC..."
	npx hardhat debug:lz:config --network arbitrum --contract $(ETH_CONTRACT)

mn-quote:
	@echo "Quote for minting..."
	npx hardhat test:manual-quote \
    --network bsc \
    --contract $(BSC_CONTRACT) \
    --dst $(EID_AMOY)

# DEV With Verification
# bunx hardhat --network arbitrum deploy --tags MyOFTMock --reset

list-net:
	npx hardhat verify --list-networks

# Peer management
peer-setup:
	@if [ -z "$(FROM)" ] || [ -z "$(TO)" ]; then \
		echo "❌ Missing parameters!"; \
		echo "Usage: make peer-setup FROM=source_network TO=destination_network"; \
		exit 1; \
	fi
	@npx hardhat --network $(FROM) lz:peer:set:auto --src $(FROM) --dst $(TO)


# Example: make peer-check NETWORK=eth EID=101 CONTRACT=$ETH_CONTRACT
peer-check:
	@if [ -z "$(NETWORK)" ] || [ -z "$(EID)" ]; then \
		echo "❌ Missing parameters!"; \
		echo "Usage: make peer-check NETWORK=network_name EID=endpoint_id [CONTRACT=address]"; \
		exit 1; \
	fi
	@if [ -z "$(CONTRACT)" ]; then \
		npx hardhat --network $(NETWORK) lz:oapp:peer:get --eid $(EID); \
	else \
		npx hardhat --network $(NETWORK) lz:oapp:peer:get --eid $(EID) --contract $(CONTRACT); \
	fi


# Debug and testing
debug-network:
	@if [ -z "$(NETWORK)" ]; then \
		echo "Usage: make debug-network NETWORK=network_name"; \
		exit 1; \
	fi
	@npx hardhat --network $(NETWORK) debug:lz:config

# Test quote
test-quote:
	@if [ -z "$(NETWORK)" ] || [ -z "$(DST_EID)" ]; then \
		echo "Usage: make test-quote NETWORK=network_name DST_EID=destination_eid"; \
		exit 1; \
	fi
	@npx hardhat --network $(NETWORK) test:manual-quote --dst $(DST_EID)


# Set peer otomatis
# Example: make set-peer FROM=avalance TO=arbitrum-sepolia
set-peer:
	@FROM=$$(if [ -n "$(FROM)" ]; then echo $(FROM); else echo bsc-testnet; fi); \
	TO=$$(if [ -n "$(TO)" ]; then echo $(TO); else echo sepolia; fi); \
	echo "Setting peer from $$FROM to $$TO"; \
	$(MAKE) peer-setup FROM=$$FROM TO=$$TO

get-env:
	bunx hardhat lz:setup:env

# task for staking contract
stk-get-address:
	@echo "contract: $(STK_CONTRACT)"
	bunx hardhat --network bsc lz:stk:address  --contract $(STK_CONTRACT) 

stk-app-contract:
	@echo "OFT contract address: $(STK_CONTRACT)"
	bunx hardhat --network bsc lz:oft:approve --spender $(STK_CONTRACT) 