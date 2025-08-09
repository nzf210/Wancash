// import { ethers } from 'ethers'

/**
 * Encode gas limit ke format extraOptions LayerZero
 * @param gasLimit Jumlah gas dalam decimal (misal 200000)
 * @returns string hex untuk extraOptions
 */
function encodeExtraOptions(gasLimit: number): string {
    const gasHex = gasLimit.toString(16)

    // Pad gasLimit jadi 32 byte
    const paddedGas = gasHex.padStart(12, '0')

    // Prefix tetap sama "0x0003010011010000000000000000000000000000"
    return `0x0003010011010000000000000000000000000000${paddedGas}`
}

// Contoh
console.log(encodeExtraOptions(200000)) // 0x00030100110100000000000000000000000000030d40
console.log(encodeExtraOptions(500000)) // 0x0003010011010000000000000000000000000007a120
