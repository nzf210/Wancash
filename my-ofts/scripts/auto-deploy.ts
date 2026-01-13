import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
import { config } from '../deploy-config';
import { syncEnv } from './sync-env';

// Paths
const OFT_ENV_PATH = path.resolve(__dirname, '../.env');
console.log('Logs For OFT_ENV_PATH + ', OFT_ENV_PATH, dotenv.config())
// Helper to run shell commands with injected environment variables
function runCommand(command: string) {
    try {
        console.log(`Running: ${command}`);
        // Inject MODE into the environment for this command
        const env = { ...process.env, MODE: config.envMode };
        console.log('Logs For ENV MODE + ', process.env.MODE)
        execSync(command, { stdio: 'inherit', env });
    } catch (error) {
        console.error(`❌ Command failed: ${command}`);
        process.exit(1);
    }
}

// Function to update local .env with new contract address
function updateLocalEnv(network: string, address: string) {
    if (!fs.existsSync(OFT_ENV_PATH)) return;

    let envContent = fs.readFileSync(OFT_ENV_PATH, 'utf-8');
    let key = '';

    if (network === 'bsc') key = 'BSC_CONTRACT';
    else if (network === 'polygon') key = 'POLY_CONTRACT';
    else if (network === 'ethereum') key = 'ETH_CONTRACT';
    else if (network === 'avalance') key = 'AVA_CONTRACT';
    else if (network === 'rootstock') key = 'ROOT_CONTRACT';
    else if (network === 'arbitrum') key = 'ARB_CONTRACT';
    else {
        key = `${network.toUpperCase()}_CONTRACT`;
    }

    const regex = new RegExp(`^${key}=.*`, 'm');
    if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${key}=${address}`);
    } else {
        if (envContent.length > 0 && !envContent.endsWith('\n')) envContent += '\n';
        envContent += `${key}=${address}\n`;
    }

    fs.writeFileSync(OFT_ENV_PATH, envContent);
    console.log(`✅ Updated ${key} in .env to ${address}`);
}

async function main() {
    console.log(`🚀 Starting Automated Deployment Pipeline...`);
    console.log(`ℹ️  Mode: ${config.mode.toUpperCase()} (Contract: ${config.contractName})`);
    console.log(`ℹ️  Networks: ${config.networks.join(', ')}\n`);

    // 1. DEPLOYMENT
    console.log('=== STEP 1: DEPLOYMENT ===');

    // Configurable networks argument: if users want specific networks or all
    // We'll pass the list from config, but the user can override interactively if we remove --ci
    const networkArg = config.networks.join(',');
    console.log(`📡 Initializing interactive deployment for: ${networkArg}`);
    console.log("👉 Please select the networks you wish to deploy to in the prompt below.");

    const startTime = Date.now();

    // Run deployment interactively ONCE
    // We pass --networks to filter the list, but user still confirms/selects
    try {
        runCommand(`npx hardhat lz:deploy --tags ${config.contractName} --networks ${networkArg}`);
    } catch (e) {
        console.warn("⚠️ Deployment command encountered an error or was cancelled.");
    }

    // Check which networks were actually deployed by inspecting file timestamps
    const deployedNetworks: string[] = [];

    console.log('\nAssigning addresses and updating .env...');
    for (const network of config.networks) {
        // Search for deployment artifact
        const deploymentPath = path.resolve(__dirname, `../deployments/${network}/${config.contractName}.json`);

        // Handle various deployment path structures if needed (similar to before)
        let actualDeploymentPath = deploymentPath;
        if (!fs.existsSync(deploymentPath)) {
            const deploymentsDir = path.resolve(__dirname, '../deployments');
            if (fs.existsSync(deploymentsDir)) {
                const foundDir = fs.readdirSync(deploymentsDir).find(d => d.startsWith(network));
                if (foundDir) {
                    actualDeploymentPath = path.resolve(deploymentsDir, foundDir, `${config.contractName}.json`);
                }
            }
        }

        if (fs.existsSync(actualDeploymentPath)) {
            const stats = fs.statSync(actualDeploymentPath);
            // Check if modified after we started the script (with a small buffer)
            if (stats.mtimeMs > startTime - 1000) {
                const artifact = JSON.parse(fs.readFileSync(actualDeploymentPath, 'utf-8'));
                const address = artifact.address;
                console.log(`🎉 Detected FRESH deployment: ${config.contractName} on ${network} at ${address}`);
                updateLocalEnv(network, address);
                deployedNetworks.push(network);
            } else {
                console.log(`ℹ️  Skipping ${network}: Artifact not updated (Stale).`);
            }
        } else {
            console.log(`ℹ️  Skipping ${network}: No artifact found.`);
        }
    }

    if (deployedNetworks.length === 0) {
        console.warn("\n⚠️ No new deployments detected. Exiting pipeline.");
        return;
    }

    // 2. VERIFICATION
    if (config.verify) {
        console.log('\n=== STEP 2: VERIFICATION ===');
        for (const network of deployedNetworks) {
            console.log(`\n🔍 Verifying on ${network}...`);
            try {
                // Standard verify task
                runCommand(`npx hardhat etherscan-verify --network ${network}`);
            } catch (e) {
                console.warn(`⚠️ Verification failed for ${network}. Proceeding...`);
            }
        }
    }

    // 3. WIRING (LayerZero)
    if (config.wire) {
        console.log('\n=== STEP 3: WIRING (LayerZero) ===');
        runCommand('npx hardhat lz:oapp:wire --oapp-config layerzero.config.ts');
    }

    // 4. SYNC FRONTEND
    console.log('\n=== STEP 4: SYNC FRONTEND ENV ===');
    syncEnv();

    console.log('\n✨ AUTOMATION COMPLETE! ✨');
}

main().catch(console.error);
