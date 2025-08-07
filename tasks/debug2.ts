import { task } from 'hardhat/config'

task('test:manual-quote', 'Manual quote test with detailed logging')
    .addParam('contract', 'Contract address')
    .addParam('dst', 'Destination EID')
    .setAction(async (taskArgs, hre) => {
        const { ethers } = hre
        const [signer] = await ethers.getSigners()

        console.log(`Network: ${hre.network.name}`)
        console.log(`Contract: ${taskArgs.contract}`)
        console.log(`Destination EID: ${taskArgs.dst}`)

        const contract = await ethers.getContractAt('MyOFTMock', taskArgs.contract, signer)

        // Step 1: Check peer
        console.log('\n1️⃣ Checking peer...')
        const peer = await contract.peers(taskArgs.dst)
        console.log(`Peer bytes32: ${peer}`)

        if (peer === '0x0000000000000000000000000000000000000000000000000000000000000000') {
            console.log('❌ No peer set!')
            return
        }

        const peerAddress = ethers.utils.getAddress('0x' + peer.slice(-40))
        console.log(`✅ Peer address: ${peerAddress}`)

        // Step 2: Check endpoint
        console.log('\n2️⃣ Checking endpoint...')
        const endpoint = await contract.endpoint()
        console.log(`Endpoint: ${endpoint}`)

        // Step 3: Try different extraOptions
        const extraOptionsToTry = ['0x', '0x00030100110100000000000000000000000000030d40', '0x0003']

        for (const extraOptions of extraOptionsToTry) {
            console.log(`\n3️⃣ Testing with extraOptions: ${extraOptions}`)
            try {
                const quote = await contract.quoteSend(
                    {
                        dstEid: parseInt(taskArgs.dst),
                        to: peer, // Use peer address as destination
                        amountLD: ethers.utils.parseEther('0.1'),
                        minAmountLD: ethers.utils.parseEther('0.09'),
                        extraOptions: extraOptions,
                        composeMsg: '0x',
                        oftCmd: '0x',
                    },
                    false
                )

                console.log('✅ Success!')
                console.log(`Native fee: ${ethers.utils.formatEther(quote.nativeFee)}`)
                console.log(`LZ token fee: ${quote.lzTokenFee}`)
                break
            } catch (error) {
                console.log(`❌ Failed: ${(error as Error).message}`)
            }
        }
    })
