<template>
  <div class="space-y-6">
    <!-- Notifikasi Email -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-foreground">Notifikasi Email</h3>
      <div class="space-y-3">
        <div
          class="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-border hover:bg-accent/50 transition-colors">
          <div>
            <h4 class="font-medium text-foreground">Promosi & Penawaran</h4>
            <p class="text-sm text-muted-foreground">Dapatkan informasi tentang promo dan penawaran khusus</p>
          </div>
          <Switch v-model:checked="localNotifications.email.promotions" class="data-[state=checked]:bg-primary" />
        </div>

        <div
          class="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-border hover:bg-accent/50 transition-colors">
          <div>
            <h4 class="font-medium text-foreground">Pembaruan Keamanan</h4>
            <p class="text-sm text-muted-foreground">Notifikasi tentang aktivitas akun yang mencurigakan</p>
          </div>
          <Switch v-model:checked="localNotifications.email.security" class="data-[state=checked]:bg-primary" />
        </div>

        <div
          class="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-border hover:bg-accent/50 transition-colors">
          <div>
            <h4 class="font-medium text-foreground">Newsletter Mingguan</h4>
            <p class="text-sm text-muted-foreground">Ringkasan aktivitas dan konten terbaru</p>
          </div>
          <Switch v-model:checked="localNotifications.email.newsletter" class="data-[state=checked]:bg-primary" />
        </div>
      </div>
    </div>

    <!-- Notifikasi Push -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-foreground">Notifikasi Aplikasi</h3>
      <div class="space-y-3">
        <div
          class="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-border hover:bg-accent/50 transition-colors">
          <div>
            <h4 class="font-medium text-foreground">Seseorang menyebut Anda</h4>
            <p class="text-sm text-muted-foreground">Ketika seseorang menyebut Anda dalam komentar atau posting</p>
          </div>
          <Switch v-model:checked="localNotifications.push.mentions" class="data-[state=checked]:bg-primary" />
        </div>

        <div
          class="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-border hover:bg-accent/50 transition-colors">
          <div>
            <h4 class="font-medium text-foreground">Komentar Baru</h4>
            <p class="text-sm text-muted-foreground">Notifikasi untuk komentar baru pada posting Anda</p>
          </div>
          <Switch v-model:checked="localNotifications.push.comments" class="data-[state=checked]:bg-primary" />
        </div>

        <div
          class="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-border hover:bg-accent/50 transition-colors">
          <div>
            <h4 class="font-medium text-foreground">Pembaruan Sistem</h4>
            <p class="text-sm text-muted-foreground">Informasi tentang pembaruan dan maintenance sistem</p>
          </div>
          <Switch v-model:checked="localNotifications.push.updates" class="data-[state=checked]:bg-primary" />
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end space-x-3 pt-4 border-t border-border">
      <Button variant="outline" @click="resetNotifications"
        class="border-input hover:bg-accent hover:text-accent-foreground">
        Reset
      </Button>
      <Button @click="saveNotifications" class="bg-primary text-primary-foreground hover:bg-primary/90">
        Simpan Preferensi
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'

const props = defineProps({
  notifications: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:notifications'])

// Data lokal
const localNotifications = ref(JSON.parse(JSON.stringify(props.notifications)))

// Watch for prop changes
watch(() => props.notifications, (newVal) => {
  localNotifications.value = JSON.parse(JSON.stringify(newVal))
}, { deep: true })

// Methods
const saveNotifications = () => {
  emit('update:notifications', localNotifications.value)
  alert('Preferensi notifikasi berhasil disimpan!')
}

const resetNotifications = () => {
  localNotifications.value = JSON.parse(JSON.stringify(props.notifications))
}
</script>
