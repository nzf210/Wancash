import { EndpointId } from '@layerzerolabs/lz-definitions'
import { ExecutorOptionType } from '@layerzerolabs/lz-v2-utilities'
import { generateConnectionsConfig } from '@layerzerolabs/metadata-tools'
import { OAppEnforcedOption, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

const CONTRACT_NAME = 'MyOFTMock'

const bscContract: OmniPointHardhat = {
    eid: EndpointId.BSC_V2_TESTNET,
    contractName: CONTRACT_NAME,
}

const amoyContract: OmniPointHardhat = {
    eid: EndpointId.AMOY_V2_TESTNET,
    contractName: CONTRACT_NAME,
}

const sepoliaContract: OmniPointHardhat = {
    eid: EndpointId.SEPOLIA_V2_TESTNET,
    contractName: CONTRACT_NAME,
}

const fujiContract: OmniPointHardhat = {
    eid: EndpointId.AVALANCHE_V2_TESTNET,
    contractName: CONTRACT_NAME,
}

const rootstockContract: OmniPointHardhat = {
    eid: EndpointId.ROOTSTOCK_V2_TESTNET,
    contractName: CONTRACT_NAME,
}

const arbContract: OmniPointHardhat = {
    eid: EndpointId.ARBSEP_V2_TESTNET,
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
            amoyContract, // Chain B contract
            [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [1, 1], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            bscContract, // Chain A contract
            sepoliaContract, // Chain B contract
            [['LayerZero Labs', 'P2P'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [1, 1], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            amoyContract, // Chain A contract
            sepoliaContract, // Chain B contract
            [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [1, 1], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            fujiContract, // Chain A contract
            sepoliaContract, // Chain B contract
            [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [1, 1], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            fujiContract, // Chain A contract
            amoyContract, // Chain B contract
            [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [1, 1], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            fujiContract, // Chain A contract
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
            sepoliaContract, // Chain B contract
            [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [1, 1], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            rootstockContract, // Chain A contract
            amoyContract, // Chain B contract
            [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [1, 1], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            rootstockContract, // Chain A contract
            fujiContract, // Chain B contract
            [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [1, 1], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            arbContract, // Chain A contract
            bscContract, // Chain B contract
            [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [1, 1], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            arbContract, // Chain A contract
            sepoliaContract, // Chain B contract
            [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [1, 1], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            arbContract, // Chain A contract
            amoyContract, // Chain B contract
            [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [1, 1], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            arbContract, // Chain A contract
            fujiContract, // Chain B contract
            [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [1, 1], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            arbContract, // Chain A contract
            rootstockContract, // Chain B contract
            [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [1, 1], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
    ])

    return {
        contracts: [
            { contract: bscContract },
            { contract: amoyContract },
            { contract: sepoliaContract },
            { contract: fujiContract },
            { contract: rootstockContract },
            { contract: arbContract },
        ],
        connections,
    }
}
