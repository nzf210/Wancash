<template>
    <div class="space-y-6">
        <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Contact Information</h3>

            <div class="space-y-6">
                <!-- Phone -->
                <div class="space-y-2">
                    <Label for="phone">Phone Number</Label>
                    <Input id="phone" v-model="form.phone" placeholder="081234567890" />
                    <p class="text-xs text-gray-500">Used for redemption contact</p>
                </div>

                <!-- Shipping Address -->
                <div class="space-y-2">
                    <Label for="address">Default Shipping Address</Label>
                    <Textarea id="address" v-model="form.shipping_address" placeholder="Full address including zip code"
                        class="min-h-[100px]" />
                    <p class="text-xs text-gray-500">Default address for gold redemption shipping</p>
                </div>

                <div class="pt-4 flex justify-end">
                    <Button @click="saveProfile" :disabled="loading">
                        {{ loading ? 'Saving...' : 'Save Changes' }}
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { useProfileStore } from '@/modules/profile/store/profileStore'
import { storeToRefs } from 'pinia'
import { useConnection } from '@wagmi/vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'vue-sonner'

const profileStore = useProfileStore()
const { profile, loading } = storeToRefs(profileStore)
const { address } = useConnection()

const form = ref({
    phone: '',
    shipping_address: ''
})

// Initialize form
onMounted(() => {
    if (profile.value) {
        form.value.phone = profile.value.phone || ''
        form.value.shipping_address = profile.value.shipping_address || ''
    }
})

// Watch for profile updates
watch(profile, (newProfile) => {
    if (newProfile) {
        form.value.phone = newProfile.phone || ''
        form.value.shipping_address = newProfile.shipping_address || ''
    }
})

const saveProfile = async () => {
    if (!address.value) {
        toast.error('Wallet not connected')
        return
    }

    const success = await profileStore.updateProfile(address.value, {
        phone: form.value.phone,
        shipping_address: form.value.shipping_address
    })

    if (success) {
        toast.success('Profile updated successfully')
    }
}
</script>
