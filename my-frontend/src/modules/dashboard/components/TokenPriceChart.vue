<template>
    <div class="w-full h-full transition-all duration-300 relative group flex flex-col">
        <!-- Header: Timeframe Selector -->
        <div class="absolute top-0 right-0 z-10 flex space-x-1 p-2">
            <button v-for="tf in timeframes" :key="tf" @click="selectTimeframe(tf)" :class="[
                'px-2 py-0.5 text-[10px] font-medium rounded transition-colors backdrop-blur-sm',
                selectedTimeframe === tf
                    ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
            ]">
                {{ tf }}
            </button>
        </div>

        <!-- Chart Area -->
        <div class="flex-1 w-full min-h-0 pt-8">
            <apexchart ref="chart" type="area" height="100%" width="100%" :options="chartOptions" :series="series">
            </apexchart>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useDark } from '@vueuse/core'
import axios from 'axios'

type Timeframe = '1m' | '5m' | '1h' | '1d' | '1w' | '1M'
const timeframes: Timeframe[] = ['1m', '5m', '1h', '1d', '1w', '1M']
const selectedTimeframe = ref<Timeframe>('1d')

const isDark = useDark()
const isLoading = ref(false)
const error = ref<string | null>(null)

// Dynamic Color based on Theme
const chartColor = computed(() => isDark.value ? '#8b5cf6' : '#6366f1')

// Fetch real data from backend
const fetchChartData = async (tf: Timeframe) => {
    isLoading.value = true
    error.value = null

    try {
        const pointsMap: Record<Timeframe, number> = {
            '1m': 60,   // Last hour
            '5m': 60,   // Last 5 hours
            '1h': 72,   // Last 3 days
            '1d': 30,   // Last 30 days
            '1w': 24,   // Last 6 months (weeks)
            '1M': 12    // Last year (months)
        }

        const response = await axios.get('/api/stats/token-price-history', {
            params: {
                timeframe: tf,
                points: pointsMap[tf]
            }
        })

        if (response.data.success && response.data.data) {
            // Transform to ApexCharts format
            const chartData = response.data.data.map((item: any) => ({
                x: item.timestamp,
                y: item.price
            }))

            // Update series
            series.value = [{
                name: 'Price (USD)',
                data: chartData
            }]
        } else {
            throw new Error('No data received')
        }

    } catch (err) {
        console.error('Failed to fetch chart data:', err)
        error.value = 'Failed to load chart data'

        // Keep showing old data on error
    } finally {
        isLoading.value = false
    }
}

const series = ref([
    {
        name: 'Price (USD)',
        data: []
    }
])


const emit = defineEmits(['timeframe-changed'])

const selectTimeframe = (tf: Timeframe) => {
    selectedTimeframe.value = tf
    fetchChartData(tf)
    emit('timeframe-changed', tf)
}

const chartOptions = computed(() => ({
    chart: {
        type: 'area',
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: 'inherit',
        background: 'transparent',
        animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
        },
        dropShadow: {
            enabled: isDark.value, // Only shadow in dark mode for glow
            top: 0,
            left: 0,
            blur: 4,
            color: chartColor.value,
            opacity: 0.3
        }
    },
    colors: [chartColor.value],
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: isDark.value ? 0.5 : 0.4,
            opacityTo: 0.05,
            stops: [0, 95]
        }
    },
    dataLabels: { enabled: false },
    stroke: {
        curve: 'smooth',
        width: 2,
    },
    xaxis: {
        type: 'datetime',
        tooltip: { enabled: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { show: false },
        crosshairs: {
            show: true,
            position: 'back',
            stroke: {
                color: isDark.value ? '#8b5cf6' : '#6366f1',
                width: 1,
                dashArray: 3,
            },
        },
    },
    yaxis: {
        show: false,
        tooltip: { enabled: true },
    },
    grid: {
        show: false,
        padding: { top: 0, right: 0, bottom: 0, left: 0 }
    },
    theme: {
        mode: isDark.value ? 'dark' : 'light'
    },
    tooltip: {
        theme: isDark.value ? 'dark' : 'light',
        x: { format: 'dd MMM HH:mm' },
        y: {
            formatter: (val: number) => {
                // For very small prices, show more decimal places
                if (val < 0.01) {
                    // Show up to 8 significant digits for small values
                    return `$${val.toFixed(8).replace(/\.?0+$/, '')}`
                } else if (val < 1) {
                    return `$${val.toFixed(6).replace(/\.?0+$/, '')}`
                } else if (val < 100) {
                    return `$${val.toFixed(4).replace(/\.?0+$/, '')}`
                }
                return `$${val.toFixed(2)}`
            }
        },
        style: { fontSize: '12px' },
        marker: { show: true },
    }
}))

// Auto-refresh for short timeframes
let refreshInterval: NodeJS.Timeout | null = null

onMounted(() => {
    // Initial load
    fetchChartData(selectedTimeframe.value)

    // Auto-refresh for short timeframes
    refreshInterval = setInterval(() => {
        if (selectedTimeframe.value === '1m' || selectedTimeframe.value === '5m') {
            fetchChartData(selectedTimeframe.value)
        }
    }, 60000) // Refresh every minute for 1m/5m charts
})

onUnmounted(() => {
    if (refreshInterval) {
        clearInterval(refreshInterval)
    }
})

</script>

<style scoped>
.vue-apexcharts {
    min-height: 200px !important;
}
</style>
