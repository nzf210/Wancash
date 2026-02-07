import assert from 'assert'

import { type DeployFunction } from 'hardhat-deploy/types'

const deploy: DeployFunction = async (hre) => {
    const { getNamedAccounts, deployments } = hre
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    assert(deployer, 'Missing named deployer account')

    console.log(`Network: ${hre.network.name}`)
    console.log(`Deployer: ${deployer}`)

    const { address } = await deploy('WancashVesting', {
        from: deployer,
        args: [],
        log: true,
        skipIfAlreadyDeployed: true,
    })

    console.log(`Deployed contract: WancashVesting, network: ${hre.network.name}, address: ${address}`)
}

deploy.tags = ['WancashVesting']
export default deploy
