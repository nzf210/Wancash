import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

import { config as dotenvConfig } from 'dotenv'
import { ethers } from 'ethers'

type Mode = 'dev' | 'main'
type Network = 'bsc' | 'polygon' | 'ethereum' | 'avalance' | 'arbitrum' | 'rootstock'

const ALL_NETWORKS: Network[] = ['bsc', 'polygon', 'ethereum', 'avalance', 'arbitrum', 'rootstock']

const VERIFY_TASK_BY_NETWORK: Record<Network, string> = {
    bsc: 'verify:bsc',
    polygon: 'verify:amoy',
    ethereum: 'verify:eth',
    avalance: 'verify:fuji',
    arbitrum: 'verify:arb',
    rootstock: 'verify:root',
}

const CONTRACT_ENV_BY_NETWORK: Record<Network, string> = {
    bsc: 'BSC_CONTRACT',
    polygon: 'POLY_CONTRACT',
    ethereum: 'ETH_CONTRACT',
    avalance: 'AVA_CONTRACT',
    arbitrum: 'ARB_CONTRACT',
    rootstock: 'ROOT_CONTRACT',
}

const MODE_ENV_FILE: Record<Mode, string> = {
    dev: '.env.dev',
    main: '.env.prod',
}

const argv = process.argv.slice(2)

const getArg = (name: string): string | undefined => {
    const idx = argv.indexOf(`--${name}`)
    if (idx === -1) return undefined
    return argv[idx + 1]
}

const hasFlag = (name: string): boolean => argv.includes(`--${name}`)

const parseMode = (value?: string): Mode => {
    const v = String(value || '')
        .toLowerCase()
        .trim()
    if (v === 'main' || v === 'prod' || v === 'production') return 'main'
    return 'dev'
}

const loadEnv = (mode: Mode): string => {
    const cwd = process.cwd()
    const preferred = path.join(cwd, MODE_ENV_FILE[mode])
    if (fs.existsSync(preferred)) {
        dotenvConfig({ path: preferred, override: true })
        return MODE_ENV_FILE[mode]
    }

    const fallback = path.join(cwd, '.env')
    if (fs.existsSync(fallback)) {
        dotenvConfig({ path: fallback, override: true })
        return '.env'
    }

    return '(none)'
}

const validateAddress = (label: string, value?: string): void => {
    if (!value) {
        throw new Error(`Missing env: ${label}`)
    }
    if (!ethers.utils.isAddress(value)) {
        throw new Error(`Invalid address for ${label}`)
    }
}

const modeArg = parseMode(getArg('mode') || process.env.MODE)
const loadedEnvFile = loadEnv(modeArg)
process.env.MODE = modeArg === 'main' ? 'main' : 'dev'

if (hasFlag('list')) {
    console.log(`Available networks: ${ALL_NETWORKS.join(', ')}`)
    process.exit(0)
}

const onlyArg = getArg('only')
const onlyNetworks = onlyArg
    ? onlyArg
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean)
    : []

const selected = onlyNetworks.length ? onlyNetworks : ALL_NETWORKS
const invalid = selected.filter((n) => !ALL_NETWORKS.includes(n as Network))
if (invalid.length) {
    throw new Error(`Unknown networks: ${invalid.join(', ')}. Allowed: ${ALL_NETWORKS.join(', ')}`)
}
const networks = selected as Network[]

if (networks.length === 0) {
    throw new Error('No networks selected. Use --only or --list to see options.')
}

const skipOft = hasFlag('skip-oft')
const skipVesting = hasFlag('skip-vesting')
const continueOnError = hasFlag('continue')

console.log(`Mode: ${modeArg}`)
console.log(`Env file: ${loadedEnvFile}`)
console.log(`Networks: ${networks.join(', ')}`)
console.log(`Verify Wancash OFT: ${skipOft ? 'no' : 'yes'}`)
console.log(`Verify WancashVesting: ${skipVesting ? 'no' : 'yes'}`)

if (!process.env.ETHERSCAN_API_KEY) {
    console.warn('Warning: ETHERSCAN_API_KEY is not set. Verification may fail.')
}

const errors: string[] = []

if (!skipOft) {
    for (const network of networks) {
        const envKey = CONTRACT_ENV_BY_NETWORK[network]
        try {
            validateAddress(envKey, process.env[envKey])
        } catch (error) {
            errors.push((error as Error).message)
        }
    }
}

if (!skipVesting && process.env.VESTING_CONTRACT) {
    try {
        validateAddress('VESTING_CONTRACT', process.env.VESTING_CONTRACT)
    } catch (error) {
        errors.push((error as Error).message)
    }
}

if (errors.length) {
    throw new Error(`Env validation failed:\n- ${errors.join('\n- ')}`)
}

const runHardhat = (args: string[]): void => {
    const result = spawnSync('npx', ['hardhat', ...args], {
        stdio: 'inherit',
        env: process.env,
    })
    if (result.status !== 0) {
        throw new Error(`Hardhat command failed: npx hardhat ${args.join(' ')}`)
    }
}

const runWithErrorHandling = (label: string, fn: () => void): void => {
    try {
        fn()
    } catch (error) {
        const message = (error as Error).message || String(error)
        console.error(`\nERROR: ${label} failed: ${message}`)
        if (!continueOnError) {
            process.exit(1)
        }
    }
}

if (!skipOft) {
    for (const network of networks) {
        const address = process.env[CONTRACT_ENV_BY_NETWORK[network]] as string
        const task = VERIFY_TASK_BY_NETWORK[network]
        runWithErrorHandling(`Verify Wancash OFT on ${network}`, () => {
            runHardhat([task, '--network', network, '--address', address])
        })
    }
}

if (!skipVesting) {
    const vesting = process.env.VESTING_CONTRACT
    if (!vesting) {
        console.log('Skipping WancashVesting: VESTING_CONTRACT is not set')
    } else {
        const vestingNetwork = (getArg('vesting-network') || 'bsc') as Network
        runWithErrorHandling(`Verify WancashVesting on ${vestingNetwork}`, () => {
            runHardhat(['verify', '--network', vestingNetwork, vesting])
        })
    }
}

console.log('\nOK: Verification flow finished')
