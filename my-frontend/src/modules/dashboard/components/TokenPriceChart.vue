<template>
    <div class="w-full h-[260px] transition-all duration-300 relative group flex flex-col">
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
        <div class="flex-1 w-full min-h-0">
            <apexchart ref="chart" type="area" height="100%" width="100%" :options="chartOptions" :series="series">
            </apexchart>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useDark } from '@vueuse/core'

type Timeframe = '1H' | '1D' | '1W' | '1M'
const timeframes: Timeframe[] = ['1H', '1D', '1W', '1M']
const selectedTimeframe = ref<Timeframe>('1D')

const isDark = useDark()

// Dynamic Color based on Theme
const chartColor = computed(() => isDark.value ? '#8b5cf6' : '#6366f1') // Purple (Dark) vs Indigo (Light)

// Data Generation Logic
const generateData = (tf: Timeframe) => {
    let data = []
    let price = 620.50
    let now = Date.now()
    let points = 50
    let interval = 1800 * 1000 // 30 mins

    // Adjust parameters based on timeframe
    switch (tf) {
        case '1H':
            points = 60
            interval = 60 * 1000 // 1 min
            break
        case '1D':
            points = 48
            interval = 30 * 60 * 1000 // 30 min
            break
        case '1W':
            points = 56
            interval = 3 * 60 * 60 * 1000 // 3 hours
            break
        case '1M':
            points = 30
            interval = 24 * 60 * 60 * 1000 // 1 day
            break
    }

    // Generate Random Walk
    for (let i = points; i >= 0; i--) {
        const volatility = tf === '1H' ? 0.5 : 2.5
        const change = (Math.random() - 0.48) * volatility // Slight upward bias
        price += change

        data.push({
            x: now - (i * interval),
            y: price
        })
    }
    return data
}

const series = ref([
    {
        name: 'Price',
        data: generateData('1D')
    }
])

const selectTimeframe = (tf: Timeframe) => {
    selectedTimeframe.value = tf
    // animate series update
    series.value = [{
        name: 'Price',
        data: generateData(tf)
    }]
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
        y: { formatter: (val: number) => `$${val.toFixed(2)}` },
        style: { fontSize: '12px' },
        marker: { show: true },
    }
}))

// Live Animation Simulation (only for 1H or 1D to feel fast)
onMounted(() => {
    setInterval(() => {
        if (selectedTimeframe.value === '1H' || selectedTimeframe.value === '1D') {
            const data = series.value[0].data
            const lastPoint = data[data.length - 1]
            const volatility = selectedTimeframe.value === '1H' ? 0.2 : 0.8
            const newPrice = lastPoint.y + (Math.random() - 0.5) * volatility

            series.value[0].data[data.length - 1] = {
                x: lastPoint.x,
                y: newPrice
            }
            series.value = [...series.value]
        }
    }, 2000)
})
</script>

<style scoped>
.vue-apexcharts {
    min-height: 200px !important;
}
</style>
