include ../.env
export

# Dynamic Cross-Chain Makefile
.PHONY: help setup-env list-networks

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
	@echo "  make send FROM=bsc-testnet TO=sepolia AMOUNT=1.0 RECIPIENT=0x123..."
	@echo "  make send FROM=amoy TO=fuji AMOUNT=0.5 RECIPIENT=0x456..."
	@echo ""
	@echo "Peer Management:"
	@echo "  peer-setup FROM=bsc-testnet TO=sepolia"
	@echo "  peer-check NETWORK=bsc-testnet EID=40161"

op:
	npx hardhat lz:oapp:wire

dev:
	npx hardhat lz:deploy --tags MyOFTMock
# Verifikasi Contracts

c-conf:
	npx hardhat lz:oapp:config:get --oapp-config layerzero.config.ts

c-peer:
	npx hardhat lz:oapp:peers:get --oapp-config layerzero.config.ts --network bsc-testnet

set-peers:
	@echo "Setting up bidirectional peers..."
	
	# Set peer from chain1 to chain2
	npx hardhat --network sepolia set:peer \
		--contract $(ETH_CONTRACT) \
		--eid $(EID_BSC) \
		--peer $(BSC_CONTRACT) 
	@sleep 5

	# Set peer from chain2 to chain1
	npx hardhat --network bsc-testnet set:peer \
		--contract $(BSC_CONTRACT) \
		--eid $(EID_SEPOLIA) \
		--peer $(ETH_CONTRACT)
	@sleep 5

	# Set peer from chain1 to chain3
	npx hardhat --network bsc-testnet set:peer \
		--contract $(BSC_CONTRACT) \
		--eid $(EID_AMOY) \
		--peer $(POLY_CONTRACT)
	@sleep 5

	# Set peer from chain3 to chain1
	npx hardhat --network amoy set:peer \
		--contract $(POLY_CONTRACT) \
		--eid $(EID_BSC) \
		--peer $(BSC_CONTRACT)
	@sleep 5

	# Set peer from chain2 to chain3
	npx hardhat --network sepolia set:peer \
		--contract $(ETH_CONTRACT) \
		--eid $(EID_AMOY) \
		--peer $(POLY_CONTRACT)
	@sleep 5

	# Set peer from chain3 to chain2
	npx hardhat --network amoy set:peer \
		--contract $(POLY_CONTRACT) \
		--eid $(EID_SEPOLIA) \
		--peer $(ETH_CONTRACT) 	
	@echo "Peer setup completed! \n"

	@sleep 5
	@echo "Setting up bidirectional peer from fuji to Sepolia..."
	# Set peer from chain3 to chain2
	npx hardhat --network fuji set:peer \
		--contract $(FUJI_CONTRACT) \
		--eid $(EID_SEPOLIA) \
		--peer $(ETH_CONTRACT) 	
	@echo "Peer setup completed!  \n"

	@sleep 5
	@echo "Setting up bidirectional peer from fuji to bsc..."
	# Set peer from chain3 to chain2
	npx hardhat --network fuji set:peer \
		--contract $(FUJI_CONTRACT) \
		--eid $(EID_BSC) \
		--peer $(BSC_CONTRACT) 	
	@echo "Peer setup completed! \n"

	@sleep 5
	@echo "Setting up bidirectional peer from fuji to Amoy..."
	# Set peer from chain3 to chain2
	npx hardhat --network fuji set:peer \
		--contract $(FUJI_CONTRACT) \
		--eid $(EID_AMOY) \
		--peer $(POLY_CONTRACT) 	
	@echo "Peer setup completed! \n"

	@sleep 5
	@echo "Setting up bidirectional peer from Amoy to fuji..."
	# Set peer from chain3 to chain2
	npx hardhat --network amoy set:peer \
		--contract $(POLY_CONTRACT) \
		--eid $(EID_FUJI) \
		--peer $(FUJI_CONTRACT) 	
	@echo "Peer setup completed! \n"

	@sleep 5
	@echo "Setting up bidirectional peer from BSC to fuji..."
	# Set peer from chain3 to chain2
	npx hardhat --network bsc-testnet set:peer \
		--contract $(BSC_CONTRACT) \
		--eid $(EID_FUJI) \
		--peer $(FUJI_CONTRACT) 	
	@echo "Peer setup completed! \n"

	@sleep 5
	@echo "Setting up bidirectional peer from Sepolia to fuji..."
	# Set peer from chain3 to chain2
	npx hardhat --network sepolia set:peer \
		--contract $(ETH_CONTRACT) \
		--eid $(EID_FUJI) \
		--peer $(FUJI_CONTRACT) 	
	@echo "Peer setup completed! \n"

# Universal send command
send:
	@if [ -z "$(FROM)" ] || [ -z "$(TO)" ] || [ -z "$(AMOUNT)" ] || [ -z "$(RECIPIENT)" ]; then \
		echo "❌ Missing parameters!"; \
		echo "Usage: make send FROM=source_network TO=destination_network AMOUNT=amount RECIPIENT=address"; \
		echo "Example: make send FROM=bsc-testnet TO=sepolia AMOUNT=1.0 RECIPIENT=0x123..."; \
		exit 1; \
	fi
	@echo "🚀 Sending $(AMOUNT) tokens from $(FROM) to $(TO)"
	@npx hardhat --network $(FROM) lz:oft:send \
		--amount $(AMOUNT) \
		--dst $(TO) \
		--to $(RECIPIENT)

bsc-to-eth:
	@make send FROM=bsc-testnet TO=sepolia AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
bsc-to-amoy:
	@make send FROM=bsc-testnet TO=amoy AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
bsc-to-fuji:
	@make send FROM=bsc-testnet TO=fuji AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
bsc-to-root:
	@make send FROM=bsc-testnet TO=rootstock AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
eth-to-bsc:
	@make send FROM=sepolia TO=bsc-testnet AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
eth-to-amoy:
	@make send FROM=sepolia TO=amoy AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
eth-to-fuji:
	@make send FROM=sepolia TO=fuji AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
eth-to-root:
	@make send FROM=sepolia TO=rootstock AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
amoy-to-bsc:
	@make send FROM=amoy TO=bsc-testnet AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
amoy-to-eth:
	@make send FROM=amoy TO=sepolia AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
amoy-to-fuji:
	@make send FROM=amoy TO=fuji AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
amoy-to-root:
	@make send FROM=amoy TO=rootstock AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
fuji-to-amoy:
	@make send FROM=fuji TO=amoy AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
fuji-to-eth:
	@make send FROM=fuji TO=sepolia AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
fuji-to-bsc:
	@make send FROM=fuji TO=bsc-testnet AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
fuji-to-root:
	@make send FROM=fuji TO=rootstock AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
root-to-bsc:
	@make send FROM=rootstock TO=bsc-testnet AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
root-to-eth:
	@make send FROM=rootstock TO=sepolia AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
root-to-amoy:
	@make send FROM=rootstock TO=amoy AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))
root-to-fuji:
	@make send FROM=rootstock TO=fuji AMOUNT=$(if $(AMOUNT),$(AMOUNT),1.0) RECIPIENT=$(if $(TO),$(TO),$(WALLET_RECEIVER))


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
.PHONY: verify-amoy
verify-amoy:
	@echo "Verifying contract on Polygon Amoy..."
	npx hardhat verify:amoy --address $(POLY_CONTRACT) --network amoy
	@echo "Verification complete!"

.PHONY: verify-bsc
verify-bsc:
	@echo "Verifying contract on BSC Testnet..."
	npx hardhat verify:bsc --address $(BSC_CONTRACT) --network bsc-testnet
	@echo "Verification complete!"

.PHONY: verify-eth
verify-eth:
	@echo "Verifying contract on Sepolia Testnet..."
	npx hardhat verify:eth --address $(ETH_CONTRACT) --network sepolia
	@echo "Verification complete!"

.PHONY: verify-fuji
verify-fuji:
	@echo "Verifying contract on Fuji Avalance Testnet..."
	npx hardhat verify:fuji --address $(FUJI_CONTRACT) --network fuji 
# 	--chain fuji-ava
	@echo "Verification complete!"

.PHONY: verify-root
verify-root:
	@echo "Verifying contract on Rootstock Testnet..."
	npx hardhat verify:root --address $(ROOT_CONTRACT) --network rootstock
	@echo "Verification complete!"

# Mint Token
mint-bsc:
	npx hardhat lz:oft:mint --contract $(BSC_CONTRACT) --network bsc-testnet --amount 10 --private-key $(PRIVATE_KEY)

mint-eth:
	npx hardhat lz:oft:mint --contract $(ETH_CONTRACT) --network sepolia-testnet --amount 7 --private-key $(PRIVATE_KEY)

mint-amoy:
	npx hardhat lz:oft:mint --contract $(POLY_CONTRACT) --network amoy-testnet --amount 8 --private-key $(PRIVATE_KEY)

.PHONY: send-oft

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
	npx hardhat lz:oapp:peer:get --network bsc-testnet --eid 40267 --contract $(BSC_CONTRACT)
	@sleep 3
	@echo "Getting BSC peer to sepolia..."
	npx hardhat lz:oapp:peer:get --network bsc-testnet --eid 40161 --contract $(BSC_CONTRACT)

g-peer-amoy:
	@echo "Getting AMOY peer to BSC..."
	npx hardhat lz:oapp:peer:get --network amoy --eid 40102 --contract $(POLY_CONTRACT)
	@sleep 3
	@echo "Getting AMOY peer to sepolia..."
	npx hardhat lz:oapp:peer:get --network amoy --eid 40161 --contract $(POLY_CONTRACT)

g-peer-sepolia:
	@echo "Getting Sepolia peer to Amoy..."
	npx hardhat lz:oapp:peer:get --network sepolia --eid 40267 --contract $(ETH_CONTRACT)
	@sleep 3
	@echo "Getting Sepolia peer to BSC..."
	npx hardhat lz:oapp:peer:get --network sepolia --eid 40102 --contract $(ETH_CONTRACT)

db-bsc:
	@echo "Debugging BSC..."
	npx hardhat debug:lz:config --network bsc-testnet --contract $(BSC_CONTRACT)

db-amoy:
	@echo "Debugging Amoy..."
	npx hardhat debug:lz:config --network amoy --contract $(POLY_CONTRACT)

db-sepolia:
	@echo "Debugging BSC..."
	npx hardhat debug:lz:config --network sepolia --contract $(ETH_CONTRACT)

mn-quote:
	@echo "Quote for minting..."
	npx hardhat test:manual-quote \
    --network bsc-testnet \
    --contract $(BSC_CONTRACT) \
    --dst $(EID_AMOY)

# DEV With Verification
# bunx hardhat --network sepolia deploy --tags MyOFTMock --reset

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
# Example: make set-peer FROM=fuji TO=arbitrum-sepolia
set-peer:
	@FROM=$$(if [ -n "$(FROM)" ]; then echo $(FROM); else echo bsc-testnet; fi); \
	TO=$$(if [ -n "$(TO)" ]; then echo $(TO); else echo sepolia; fi); \
	echo "Setting peer from $$FROM to $$TO"; \
	$(MAKE) peer-setup FROM=$$FROM TO=$$TO
