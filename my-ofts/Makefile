include .env
export

# ==============================================================================
#  WANCASH CROSS-CHAIN AUTOMATION
# ==============================================================================
#  A unified command interface for deployment, verification, and cross-chain operations.
#  
#  Required: .env file (run 'make setup-env' to check)
# ==============================================================================

.PHONY: help setup-env list-networks deploy-auto deploy verify send peer-setup peer-check

# --- Colors ---
RED=\033[0;31m
GREEN=\033[0;32m
YELLOW=\033[0;33m
NC=\033[0m

# --- Configuration defaults ---
DEFAULT_AMOUNT=1.0

# ==============================================================================
#  DEFAULT TARGET: HELP MENU
# ==============================================================================
help:
	@echo "🚀 $(GREEN)WANCASH CROSS-CHAIN TOOLKIT$(NC)"
	@echo "=================================================================="
	@echo "$(YELLOW)Setup:$(NC)"
	@echo "  make setup-env          - Create .env from example if missing"
	@echo "  make list-networks      - Show available Hardhat networks"
	@echo ""
	@echo "$(YELLOW)Automated Pipelines (Recommended):$(NC)"
	@echo "  make deploy-auto        - Run the full interactive deployment & sync pipeline"
	@echo "                            (Deploys, Verify, Wire, Sync Env)"
	@echo ""
	@echo "$(YELLOW)Manual Deployment & Verification:$(NC)"
	@echo "  make deploy NETWORK=... - Deploy to a specific network"
	@echo "                            (e.g., make deploy NETWORK=bsc)"
	@echo "  make verify NETWORK=... - Verify contract on Etherscan/Blockscout"
	@echo "                            (e.g., make verify NETWORK=polygon)"
	@echo ""
	@echo "$(YELLOW)Cross-Chain Operations:$(NC)"
	@echo "  make send FROM=... TO=... [AMOUNT=...] [RECIPIENT=...]"
	@echo "    - Send tokens across chains."
	@echo "    - Defaults: AMOUNT=1.0, RECIPIENT=Your configured default"
	@echo "    - Example: make send FROM=bsc TO=ethereum AMOUNT=50"
	@echo ""
	@echo "$(YELLOW)LayerZero Peer Management:$(NC)"
	@echo "  make peer-setup FROM=... TO=... "
	@echo "    - Auto-wire peers between two networks."
	@echo "  make peer-check NETWORK=... EID=..."
	@echo "    - Check if a peer is set for a specific Endpoint ID."
	@echo ""
	@echo "$(YELLOW)Run this scrypt$(NC)"
	@echo "======================="
	@echo "$(GREEN)"
	@echo "make deploy-auto"
	@echo "make send FROM=bsc TO=ethereum AMOUNT=100"
	@echo "make verify NETWORK=polygon ADDRESS=0x4B567FE342D250976c18421B453B947c57C9AD60"
	@echo "make peer-setup FROM=bsc TO=ethereum"
	@echo "make peer-check NETWORK=bsc EID=40161"
	@echo "$(NC)"
	@echo "======================="
	@echo ""

# ==============================================================================
#  SETUP & CONFIG
# ==============================================================================
setup-env:
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "$(GREEN)Created .env from .env.example. Please populate it!$(NC)"; \
	else \
		echo "$(YELLOW).env already exists. No changes made.$(NC)"; \
	fi

list-networks:
	@npx hardhat verify --list-networks

# ==============================================================================
#  DEPLOYMENT AUTOMATION
# ==============================================================================
deploy-auto:
	@echo "$(GREEN)Starting Auto-Deployment Pipeline...$(NC)"
	@bun scripts/auto-deploy.ts

deploy:
	@if [ -z "$(NETWORK)" ]; then \
		echo "$(RED)Error: NETWORK is required.$(NC)"; \
		echo "Usage: make deploy NETWORK=bsc"; \
		exit 1; \
	fi
	@echo "$(GREEN)Deploying to $(NETWORK)...$(NC)"
	@npx hardhat lz:deploy --tags Wancash --network $(NETWORK)

verify:
	@if [ -z "$(NETWORK)" ]; then \
		echo "$(RED)Error: NETWORK is required.$(NC)"; \
		echo "Usage: make verify NETWORK=polygon [ADDRESS=0x...]"; \
		exit 1; \
	fi
	@if [ -n "$(ADDRESS)" ]; then \
		echo "$(GREEN)Verifying contract at $(ADDRESS) on $(NETWORK)...$(NC)"; \
		npx hardhat verify --network $(NETWORK) $(ADDRESS) $(ARGS); \
	else \
		echo "$(GREEN)Verifying all deployments on $(NETWORK)...$(NC)"; \
		npx hardhat etherscan-verify --network $(NETWORK); \
	fi

# ==============================================================================
#  CROSS-CHAIN TRANSFERS (OFT)
# ==============================================================================
send:
	@if [ -z "$(FROM)" ] || [ -z "$(TO)" ]; then \
		echo "$(RED)Error: FROM and TO are required.$(NC)"; \
		echo "Usage: make send FROM=bsc TO=ethereum AMOUNT=10 RECIPIENT=0x123..."; \
		exit 1; \
	fi
	@echo "$(GREEN)🚀 Sending $(if $(AMOUNT),$(AMOUNT),$(DEFAULT_AMOUNT)) tokens from $(FROM) to $(TO)...$(NC)"
	@npx hardhat --network $(FROM) lz:oft:send \
		--amount $(if $(AMOUNT),$(AMOUNT),$(DEFAULT_AMOUNT)) \
		--dst $(TO) \
		$(if $(RECIPIENT),--to $(RECIPIENT),)

# ==============================================================================
#  PEER MANAGEMENT
# ==============================================================================
peer-setup:
	@if [ -z "$(FROM)" ] || [ -z "$(TO)" ]; then \
		echo "$(RED)Error: Missing parameters!$(NC)"; \
		echo "Usage: make peer-setup FROM=source TO=destination"; \
		exit 1; \
	fi
	@npx hardhat --network $(FROM) lz:peer:set:auto --src $(FROM) --dst $(TO)

peer-check:
	@if [ -z "$(NETWORK)" ] || [ -z "$(EID)" ]; then \
		echo "$(RED)Error: Missing parameters!$(NC)"; \
		echo "Usage: make peer-check NETWORK=bsc EID=40161"; \
		exit 1; \
	fi
	@npx hardhat --network $(NETWORK) lz:oapp:peer:get --eid $(EID)

# ==============================================================================
#  DEBUGGING & UTILS
# ==============================================================================
debug-config:
	@if [ -z "$(NETWORK)" ]; then \
		echo "Usage: make debug-config NETWORK=bsc"; \
		exit 1; \
	fi
	@npx hardhat debug:lz:config --network $(NETWORK)

mint:
	@if [ -z "$(NETWORK)" ] || [ -z "$(CONTRACT)" ]; then \
		echo "$(RED)Usage: make mint NETWORK=bsc CONTRACT=0x... AMOUNT=10$(NC)"; \
		exit 1; \
	fi
	@npx hardhat lz:oft:mint --contract $(CONTRACT) --network $(NETWORK) --amount $(if $(AMOUNT),$(AMOUNT),100) --private-key $(PRIVATE_KEY)


