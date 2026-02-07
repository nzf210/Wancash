import { EndpointId } from '@layerzerolabs/lz-definitions'
import { ExecutorOptionType } from '@layerzerolabs/lz-v2-utilities'
import { generateConnectionsConfig } from '@layerzerolabs/metadata-tools'
import { OAppEnforcedOption, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

import { config } from './deploy-config'

const CONTRACT_NAME = config.contractName

const isProd = config.mode === 'prod'

const bscContract: OmniPointHardhat = {
    eid: isProd ? EndpointId.BSC_V2_MAINNET : EndpointId.BSC_V2_TESTNET,
    contractName: CONTRACT_NAME,
}

const polygonContract: OmniPointHardhat = {
    eid: isProd ? EndpointId.POLYGON_V2_MAINNET : EndpointId.AMOY_V2_TESTNET,
    contractName: CONTRACT_NAME,
}

const ethereumContract: OmniPointHardhat = {
    eid: isProd ? EndpointId.ETHEREUM_V2_MAINNET : EndpointId.SEPOLIA_V2_TESTNET,
    contractName: CONTRACT_NAME,
}

const avalancheContract: OmniPointHardhat = {
    eid: isProd ? EndpointId.AVALANCHE_V2_MAINNET : EndpointId.AVALANCHE_V2_TESTNET,
    contractName: CONTRACT_NAME,
}

const rootstockContract: OmniPointHardhat = {
    eid: isProd ? EndpointId.ROOTSTOCK_V2_MAINNET : EndpointId.ROOTSTOCK_V2_TESTNET,
    contractName: CONTRACT_NAME,
}

const arbitrumContract: OmniPointHardhat = {
    eid: isProd ? EndpointId.ARBITRUM_V2_MAINNET : EndpointId.ARBSEP_V2_TESTNET,
    contractName: CONTRACT_NAME,
}

const EVM_ENFORCED_OPTIONS: OAppEnforcedOption[] = [
    {
        msgType: 1,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: 80000,
        value: 0,
    },
    {
        msgType: 2,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: 80000,
        value: 0,
    },
    {
        msgType: 2,
        optionType: ExecutorOptionType.COMPOSE,
        index: 0,
        gas: 80000,
        value: 0,
    },
]

export default async function () {
    // note: pathways declared here are automatically bidirectional
    // if you declare A,B there's no need to declare B,A
    const connections = await generateConnectionsConfig([
        [
            bscContract, // Chain A contract
            polygonContract, // Chain B contract
            [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [1, 1], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            bscContract, // Chain A contract
            ethereumContract, // Chain B contract
            [['LayerZero Labs', 'P2P'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [1, 1], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            polygonContract, // Chain A contract
            ethereumContract, // Chain B contract
            [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [1, 1], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            avalancheContract, // Chain A contract
            ethereumContract, // Chain B contract
            [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [1, 1], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            avalancheContract, // Chain A contract
            polygonContract, // Chain B contract
            [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [1, 1], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            avalancheContract, // Chain A contract
            bscContract, // Chain B contract
            [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [1, 1], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            rootstockContract, // Chain A contract
            bscContract, // Chain B contract
            [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [1, 1], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            rootstockContract, // Chain A contract
            ethereumContract, // Chain B contract
            [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [1, 1], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            rootstockContract, // Chain A contract
            polygonContract, // Chain B contract
            [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [1, 1], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            rootstockContract, // Chain A contract
            avalancheContract, // Chain B contract
            [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [1, 1], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            arbitrumContract, // Chain A contract
            bscContract, // Chain B contract
            [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [1, 1], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            arbitrumContract, // Chain A contract
            ethereumContract, // Chain B contract
            [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [1, 1], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            arbitrumContract, // Chain A contract
            polygonContract, // Chain B contract
            [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [1, 1], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            arbitrumContract, // Chain A contract
            avalancheContract, // Chain B contract
            [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [1, 1], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            arbitrumContract, // Chain A contract
            rootstockContract, // Chain B contract
            [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [1, 1], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
    ])

    return {
        contracts: [
            { contract: bscContract },
            { contract: polygonContract },
            { contract: ethereumContract },
            { contract: avalancheContract },
            { contract: rootstockContract },
            { contract: arbitrumContract },
        ],
        connections,
    }
}
