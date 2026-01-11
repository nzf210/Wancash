<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    isOnline: boolean
}

const props = defineProps<Props>()

const showOverlay = computed(() => !props.isOnline)
</script>

<template>
    <Transition name="offline-fade">
        <div v-if="showOverlay" class="offline-overlay" role="alert" aria-live="assertive">
            <div class="offline-content">
                <div class="offline-icon-wrapper">
                    <!-- Wifi Off Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="offline-icon">
                        <line x1="2" y1="2" x2="22" y2="22"></line>
                        <path d="M8.5 16.5a5 5 0 0 1 7 0"></path>
                        <path d="M2 8.82a15 15 0 0 1 4.17-2.65"></path>
                        <path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76"></path>
                        <path d="M16.85 11.25a10 10 0 0 1 2.22 1.68"></path>
                        <path d="M5 13a10 10 0 0 1 5.24-2.76"></path>
                        <circle cx="12" cy="20" r="1"></circle>
                    </svg>
                </div>

                <h2 class="offline-title">No Internet Connection</h2>
                <p class="offline-description">
                    Please check your network connection and try again. All activities are temporarily blocked until
                    connection is restored.
                </p>

                <div class="offline-spinner-wrapper">
                    <div class="offline-spinner"></div>
                    <span class="offline-status">Waiting for connection...</span>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.offline-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
    padding: 1rem;
}

.dark .offline-overlay {
    background: rgba(2, 6, 23, 0.98);
}

.offline-content {
    background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%);
    border: 1px solid rgba(148, 163, 184, 0.2);
    border-radius: 24px;
    padding: 3rem 2rem;
    max-width: 480px;
    width: 100%;
    text-align: center;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    position: relative;
    overflow: hidden;
}

.dark .offline-content {
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 0.98) 100%);
    border-color: rgba(148, 163, 184, 0.1);
}

/* Animated gradient border effect */
.offline-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    padding: 2px;
    background: linear-gradient(135deg,
            rgba(239, 68, 68, 0.3),
            rgba(244, 63, 94, 0.3),
            rgba(239, 68, 68, 0.3));
    background-size: 200% 200%;
    animation: gradient-shift 3s ease infinite;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
}

@keyframes gradient-shift {

    0%,
    100% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }
}

.offline-icon-wrapper {
    width: 96px;
    height: 96px;
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(244, 63, 94, 0.1));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 2rem;
    animation: pulse-icon 2s ease-in-out infinite;
}

@keyframes pulse-icon {

    0%,
    100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
    }

    50% {
        transform: scale(1.05);
        box-shadow: 0 0 0 20px rgba(239, 68, 68, 0);
    }
}

.offline-icon {
    color: #ef4444;
    animation: wiggle 1s ease-in-out infinite;
}

@keyframes wiggle {

    0%,
    100% {
        transform: rotate(0deg);
    }

    25% {
        transform: rotate(-5deg);
    }

    75% {
        transform: rotate(5deg);
    }
}

.offline-title {
    font-size: 1.875rem;
    font-weight: 700;
    color: #f8fafc;
    margin-bottom: 1rem;
    letter-spacing: -0.025em;
}

.offline-description {
    color: #cbd5e1;
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 2.5rem;
    max-width: 80%;
    margin-left: auto;
    margin-right: auto;
}

.offline-spinner-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}

.offline-spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(148, 163, 184, 0.2);
    border-top-color: #ef4444;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.offline-status {
    color: #94a3b8;
    font-size: 0.875rem;
    font-weight: 500;
}

/* Transition effects */
.offline-fade-enter-active,
.offline-fade-leave-active {
    transition: opacity 0.3s ease, backdrop-filter 0.3s ease;
}

.offline-fade-enter-from,
.offline-fade-leave-to {
    opacity: 0;
    backdrop-filter: blur(0px);
}

.offline-fade-enter-active .offline-content {
    animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.offline-fade-leave-active .offline-content {
    animation: slide-down 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slide-up {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes slide-down {
    from {
        transform: translateY(0);
        opacity: 1;
    }

    to {
        transform: translateY(20px);
        opacity: 0;
    }
}

/* Mobile responsive */
@media (max-width: 640px) {
    .offline-content {
        padding: 2rem 1.5rem;
        border-radius: 16px;
    }

    .offline-icon-wrapper {
        width: 80px;
        height: 80px;
        margin-bottom: 1.5rem;
    }

    .offline-icon {
        width: 48px;
        height: 48px;
    }

    .offline-title {
        font-size: 1.5rem;
        margin-bottom: 0.75rem;
    }

    .offline-description {
        font-size: 0.9rem;
        margin-bottom: 2rem;
        max-width: 95%;
    }

    .offline-spinner {
        width: 20px;
        height: 20px;
        border-width: 2px;
    }

    .offline-status {
        font-size: 0.8125rem;
    }
}
</style>
