import fs from 'fs'
import path from 'path'

import { task } from 'hardhat/config'

import { MODE } from '.'
const contract = MODE ? 'Wancash' : 'WancashMock'

task('lz:oapp:peer:get', 'Get peer configuration for MyOFTMock')
    .addParam('eid', 'Destination endpoint ID')
    .addOptionalParam('contract', 'Contract address (auto-detect if not provided)')
    .setAction(async (taskArgs, hre) => {
        await hre.run('compile')

        const { ethers } = hre
        const [signer] = await ethers.getSigners()

        const network = await ethers.provider.getNetwork()
        const chainId = network.chainId

        console.log(`Network: ${hre.network.name}`)
        console.log(`Chain ID: ${chainId}`)
        console.log(`Signer: ${signer.address}`)

        if (chainId === 31337) {
            throw new Error('This task must be run on a real network, not Hardhat Network')
        }

        let contractAddress = taskArgs.contract

        // Auto-detect contract address jika tidak disediakan
        if (!contractAddress) {
            try {
                const deploymentPath = path.join(__dirname, `../deployments/${hre.network.name}`)
                const files = fs.readdirSync(deploymentPath)
                const myOFTFile = files.find((f) => f.includes(contract) && f.endsWith('.json'))

                if (myOFTFile) {
                    const deployment = JSON.parse(fs.readFileSync(path.join(deploymentPath, myOFTFile), 'utf8'))
                    contractAddress = deployment.address
                    console.log(`📍 Auto-detected contract address: ${contractAddress}`)
                } else {
                    throw new Error('Contract deployment file not found')
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error(`Error auto-detecting contract address: ${error.message}`)
                } else {
                    throw error // re-throw the error if it's not an instance of Error
                }
            }
        }

        try {
            const myOFTMock = await ethers.getContractAt(contract, contractAddress, signer)

            console.log(`Getting peer for endpoint ID: ${taskArgs.eid}`)
            console.log(`Local contract: ${contractAddress}`)

            const peerBytes32 = await myOFTMock.peers(taskArgs.eid)

            console.log(`Raw peer data (bytes32): ${peerBytes32}`)

            if (peerBytes32 === '0x0000000000000000000000000000000000000000000000000000000000000000') {
                console.log(`❌ No peer configured for endpoint ID ${taskArgs.eid}`)
                console.log('\n💡 To set a peer, run:')
                console.log(
                    `npx hardhat lz:oapp:peer:set --network ${hre.network.name} --eid ${taskArgs.eid} --contract ${contractAddress} --peer 0xPeerAddress`
                )
            } else {
                const peerAddress = ethers.utils.getAddress('0x' + peerBytes32.slice(-40))
                console.log(`✅ Peer found for endpoint ID ${taskArgs.eid}:`)
                console.log(`✅ Peer address: ${peerAddress}`)
            }
        } catch (error) {
            console.error('Error getting peer configuration:')
            console.error((error as Error).message)
        }
    })
