import { useRouter } from "vue-router"

// composables/useNavigate.ts
export const useNavigate = () => {
  const router = useRouter()

  const goToPortfolio = () => router.push({ name: 'portfolio' })
  const goToProfile = () => router.push({ name: 'User Profile' })
  const goToSettings = () => router.push({ name: 'settings' })
  const goToTransfer = () => router.push({ name: 'transfer' })
  const goToBridge = () => router.push({ name: 'bridge' })
  const goToHome = () => router.push({ name: '/' })

  return {
    goToPortfolio,
    goToProfile,
    goToSettings,
    goToTransfer,
    goToBridge,
    goToHome,
  }
}
