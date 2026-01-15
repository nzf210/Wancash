import { dexScreenerService } from './src/modules/dashboard/services/dexScreenerService';

async function test() {
    console.log("Testing DexScreener Service...");
    try {
        const data = await dexScreenerService.getTokenData();
        console.log("Result:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error:", error);
    }
}

test();
