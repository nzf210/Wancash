import { task } from 'hardhat/config'

task('debug:lz:config', 'Debug LayerZero configuration')
    .addParam('contract', 'Contract address')
    .setAction(async (taskArgs, hre) => {
        const { ethers } = hre
        const [signer] = await ethers.getSigners()

        console.log(`Network: ${hre.network.name}`)
        console.log(`Contract: ${taskArgs.contract}`)
        console.log(`Signer: ${signer.address}`)

        try {
            const contract = await ethers.getContractAt('MyOFTMock', taskArgs.contract, signer)

            // Check basic contract info
            console.log('\n=== Contract Info ===')
            const name = await contract.name()
            const symbol = await contract.symbol()
            console.log(`Name: ${name}`)
            console.log(`Symbol: ${symbol}`)

            // Check endpoint
            const endpoint = await contract.endpoint()
            console.log(`Endpoint: ${endpoint}`)

            // Check peers for common testnets
            console.log('\n=== Peer Configuration ===')
            const testnetEids = [40102, 40267, 40161, 40245] // BSC, Amoy, Sepolia, Arbitrum
            const testnetNames = ['BSC Testnet', 'Amoy Testnet', 'Sepolia', 'Arbitrum Sepolia']

            for (let i = 0; i < testnetEids.length; i++) {
                try {
                    const peer = await contract.peers(testnetEids[i])
                    if (peer !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
                        const peerAddress = ethers.utils.getAddress('0x' + peer.slice(-40))
                        console.log(`${testnetNames[i]} (${testnetEids[i]}): ${peerAddress}`)
                    } else {
                        console.log(`${testnetNames[i]} (${testnetEids[i]}): Not configured`)
                    }
                } catch (error: unknown) {
                    getError(error, testnetEids, testnetNames)
                }
            }

            // Try to quote a small send
            console.log('\n=== Quote Test ===')
            try {
                const quote = await contract.quoteSend(
                    {
                        dstEid: 40267,
                        to: ethers.utils.hexZeroPad('0xaA4954116f7657693f3615602800B9A5D87a82cf', 32),
                        amountLD: ethers.utils.parseEther('0.1'),
                        minAmountLD: ethers.utils.parseEther('0.09'),
                        extraOptions: '0x',
                        composeMsg: '0x',
                        oftCmd: '0x',
                    },
                    false
                )
                console.log('✅ Quote successful!')
                console.log(`Native fee: ${ethers.utils.formatEther(quote.nativeFee)} ETH`)
                console.log(`LZ token fee: ${quote.lzTokenFee}`)
            } catch (error) {
                const errorMessage = (error as Error).message
                console.log('❌ Quote failed:', errorMessage)

                // Check for specific error codes
                if (errorMessage.includes('0x6592671c')) {
                    console.log('🔍 Error Analysis: NoPeer - Peer not configured for destination EID')
                    console.log('💡 Solution: Set peer with command:')
                    console.log(
                        `   npx hardhat lz:oapp:peer:set --network ${hre.network.name} --eid 40267 --contract ${taskArgs.contract} --peer AMOY_CONTRACT_ADDRESS`
                    )
                } else if (errorMessage.includes('0x00575ea1')) {
                    console.log('🔍 Error Analysis: InvalidEndpoint or configuration issue')
                    console.log('💡 Solution: Check LayerZero endpoint configuration')
                }
            }
        } catch (error) {
            console.error('Error:', (error as Error).message)
        }
    })

function getError(error: unknown, testnetEids: number[], testnetNames: string[]) {
    if (error instanceof Error) {
        if (error.message.includes('network')) {
            console.error(`Network error occurred while retrieving peer for ${testnetNames} (${testnetEids})`)
            // Retry the operation or provide a default value
        } else {
            console.error(`Unknown error occurred while retrieving peer for ${testnetNames} (${testnetEids})`)
            throw error // Rethrow the exception
        }
    } else {
        console.error(`Unknown error occurred: ${error}`)
        throw error // Rethrow the exception
    }
}
