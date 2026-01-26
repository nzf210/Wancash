<template>
    <Card class="border-2 border-purple-200 dark:border-blue-light">
        <CardHeader>
            <CardTitle class="text-xl font-bold text-gray-800 dark:text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
            <Button @click="connectWallet"
                class="w-full justify-start bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Connect Wallet
            </Button>

            <Button @click="checkTransaction" variant="outline"
                class="w-full justify-start border-purple-200 dark:border-blue-light text-purple-600 dark:text-blue-400 hover:bg-purple-50 dark:hover:bg-blue-900/30">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Check Transaction Status
            </Button>

            <Button @click="viewDocumentation" variant="outline"
                class="w-full justify-start border-purple-200 dark:border-blue-light text-purple-600 dark:text-blue-400 hover:bg-purple-50 dark:hover:bg-blue-900/30">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Token Documentation
            </Button>
        </CardContent>
    </Card>
</template>

<script lang="ts" setup>
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const connectWallet = () => {
    alert('Connect wallet function will be implemented here')
}

const checkTransaction = () => {
    alert('Check transaction feature will be implemented here')
}

const viewDocumentation = () => {
    alert('Opening token documentation...')
}
</script>
