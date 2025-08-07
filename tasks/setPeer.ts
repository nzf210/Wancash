import { task } from 'hardhat/config'

task('lz:oapp:peer:set', 'Sets peer configuration for MyOFTMock')
    .addParam('contract', 'MyOFTMock contract address')
    .addParam('eid', 'Destination endpoint ID')
    .addParam('peer', 'Peer contract address')
    //.addOptionalParam('network', 'Target network name', 'hardhat') // Ganti nama parameter
    .setAction(async (taskArgs, hre) => {
        // Gunakan hre.run untuk memastikan network yang benar
        await hre.run('compile')

        const { ethers } = hre
        const [signer] = await ethers.getSigners()

        const chainId = await ethers.provider.getNetwork().then((n) => n.chainId)
        console.log('ChainId: ', chainId) // Akan mengembalikan 31337 di Hardhat Network
        if (chainId === 31337) {
            throw new Error('This task must be run not on Hardhat Network')
        }
        console.log(`Network: ${taskArgs.network}`)
        console.log(`Signer: ${signer.address}`)

        const myOFTMock = await ethers.getContractAt('MyOFTMock', taskArgs.contract, signer)

        const peerBytes32 = ethers.utils.hexZeroPad(taskArgs.peer, 32)
        console.log(`Setting peer for endpoint ${taskArgs.eid} to ${peerBytes32}`)

        const tx = await myOFTMock.setPeer(taskArgs.eid, peerBytes32)
        console.log(`Tx hash: ${tx.hash}`)

        await tx.wait()
        console.log('Transaction confirmed ✅ \n')
    })
