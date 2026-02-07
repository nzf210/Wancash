import './sendOFT'
import './verify/verifyAmoy'
import './verify/verifyBscTestnet'
import './verify/verifySepolia'
import './verify/verifyFuji'
import './verify/verifyRootstock'
import './verify/verifyArb'
import './setPeer'
import './getPeer'
import './debug'
import './debug2'
import './send/sendOFT'
import './setupEnv'
import './verify/verifyStaking'
import './staking/stakingUSDT'
import './staking/approveOFT'
import './limits/excludeBatch'
import './vesting/init'
import './vesting/resolvePool'

import { ethers } from 'ethers'

import { config } from '../deploy-config'

export const MODE = process.env.MODE === 'main'
export const CI_BSC = MODE ? process.env.CI_BSC : 97
export const INITIAL_SUPPLY = ethers.utils.parseUnits(config.token.initialSupply, config.token.decimals).toString()
export const OWNER_ALLOCATION = ethers.utils.parseUnits(config.token.ownerAllocation, config.token.decimals).toString()
const envContractName = process.env.CONTRACT_NAME?.trim()
export const contractName = envContractName || (MODE ? 'Wancash' : 'WancashMock')
export const contractSymbol = MODE ? 'WCH' : 'WCHMock'
