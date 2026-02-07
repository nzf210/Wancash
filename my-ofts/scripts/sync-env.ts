import * as fs from 'fs'
import * as path from 'path'

import * as dotenv from 'dotenv'

import { config } from '../deploy-config'

// Paths
const ENV_MODE = process.env.ENV || 'dev'
const isProd = ENV_MODE === 'prod' || ENV_MODE === 'main' || ENV_MODE === 'production'
const OFT_ENV_PATH = path.resolve(__dirname, `../.env.${ENV_MODE}`)
const FRONTEND_ENV_MODE = isProd ? 'production' : 'development'
const FRONTEND_ENV_PATH = path.resolve(__dirname, `../../my-frontend/.env.${FRONTEND_ENV_MODE}`)
const FRONTEND_ENV_FALLBACK = path.resolve(__dirname, '../../my-frontend/.env')

const isTestnetTargetKey = (key: string): boolean => /_TEST($|_)|_SEPOLIA|_AMOY|_FUJI/.test(key)

function syncEnv() {
    console.log('🔄 Starting Environment Synchronization...')

    // 1. Load my-ofts .env.<ENV>
    if (!fs.existsSync(OFT_ENV_PATH)) {
        console.error(`❌ Source env not found at ${OFT_ENV_PATH}`)
        process.exit(1)
    }
    const oftEnvConfig = dotenv.parse(fs.readFileSync(OFT_ENV_PATH))
    console.log(`✅ Loaded source env from ${OFT_ENV_PATH}`)

    // 2. Load my-frontend .env.<ENV>
    let frontendEnvContent = ''
    if (fs.existsSync(FRONTEND_ENV_PATH)) {
        frontendEnvContent = fs.readFileSync(FRONTEND_ENV_PATH, 'utf-8')
        console.log(`✅ Loaded target env from ${FRONTEND_ENV_PATH}`)
    } else {
        console.warn(`⚠️ Target env not found at ${FRONTEND_ENV_PATH}. Creating new file.`)
    }

    // 3. Parse target .env to map (for easy updating)
    // We parse it manually to preserve comments and structure as much as possible if we were rewriting,
    // but simply appending/replacing is safer for now.
    // However, to be robust, we will read the file line by line and replace matching keys.

    let newFrontendEnvContent = frontendEnvContent

    for (const [sourceKey, targetKeys] of Object.entries(config.envMapping)) {
        const value = oftEnvConfig[sourceKey]

        if (!value) {
            console.warn(`⚠️ Warning: Source key '${sourceKey}' not found in ${OFT_ENV_PATH}. Skipping.`)
            continue
        }

        // Handle array of target keys (1 source -> N targets)
        const targets = Array.isArray(targetKeys) ? targetKeys : [targetKeys]
        const hasTestnetTarget = targets.some((t) => isTestnetTargetKey(t))

        for (const rawTargetKey of targets) {
            if (isProd && isTestnetTargetKey(rawTargetKey)) {
                continue
            }
            if (!isProd && hasTestnetTarget && !isTestnetTargetKey(rawTargetKey)) {
                continue
            }
            // Requirement: Ensure VITE_ prefix for frontend variables
            const targetKey = rawTargetKey.startsWith('VITE_') ? rawTargetKey : `VITE_${rawTargetKey}`

            const regex = new RegExp(`^${targetKey}=.*`, 'm')

            if (regex.test(newFrontendEnvContent)) {
                // Update existing key
                newFrontendEnvContent = newFrontendEnvContent.replace(regex, `${targetKey}=${value}`)
                console.log(`   ✏️  Updated ${targetKey}`)
            } else {
                // Append new key
                // Ensure newline before appending
                if (newFrontendEnvContent.length > 0 && !newFrontendEnvContent.endsWith('\n')) {
                    newFrontendEnvContent += '\n'
                }
                newFrontendEnvContent += `${targetKey}=${value}\n`
                console.log(`   ➕ Added ${targetKey}`)
            }
        }
    }

    // 4. Write back to my-frontend .env.<ENV>
    fs.writeFileSync(FRONTEND_ENV_PATH, newFrontendEnvContent)
    console.log(`✅ Environment synchronization complete for ${FRONTEND_ENV_PATH}!`)

    // Optional: keep a generic .env in sync for tools that expect it
    if (process.env.SYNC_FALLBACK_ENV === '1') {
        fs.writeFileSync(FRONTEND_ENV_FALLBACK, newFrontendEnvContent)
        console.log(`✅ Also updated fallback ${FRONTEND_ENV_FALLBACK}`)
    }
}

// Run if called directly
if (require.main === module) {
    syncEnv()
}

export { syncEnv }
