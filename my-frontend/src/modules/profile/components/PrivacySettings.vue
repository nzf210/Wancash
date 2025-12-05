<template>
  <div class="space-y-6">
    <!-- Visibilitas Profil -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-foreground">Visibilitas Profil</h3>
      <div>
        <Label for="profileVisibility" class="text-foreground">Siapa yang dapat melihat profil Anda?</Label>
        <Select v-model="localPrivacy.profileVisibility">
          <SelectTrigger class="mt-1 bg-background border-input text-foreground">
            <SelectValue placeholder="Pilih visibilitas" />
          </SelectTrigger>
          <SelectContent class="bg-popover border-border">
            <SelectItem value="public">Publik (Semua orang)</SelectItem>
            <SelectItem value="followers">Hanya Pengikut</SelectItem>
            <SelectItem value="private">Pribadi (Hanya Anda)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Pengaturan Privasi -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-foreground">Pengaturan Privasi</h3>
      <div class="space-y-3">
        <div
          class="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-border hover:bg-accent/50 transition-colors">
          <div>
            <h4 class="font-medium text-foreground">Tampilkan Status Online</h4>
            <p class="text-sm text-muted-foreground">Izinkan orang lain melihat kapan Anda online</p>
          </div>
          <Switch v-model:checked="localPrivacy.showOnlineStatus" class="data-[state=checked]:bg-primary" />
        </div>

        <div
          class="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-border hover:bg-accent/50 transition-colors">
          <div>
            <h4 class="font-medium text-foreground">Izinkan Penandaan</h4>
            <p class="text-sm text-muted-foreground">Izinkan orang lain menandai Anda dalam posting</p>
          </div>
          <Switch v-model:checked="localPrivacy.allowTagging" class="data-[state=checked]:bg-primary" />
        </div>

        <div
          class="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-border hover:bg-accent/50 transition-colors">
          <div>
            <h4 class="font-medium text-foreground">Izinkan Mesin Pencari</h4>
            <p class="text-sm text-muted-foreground">Izinkan mesin pencari mengindeks profil Anda</p>
          </div>
          <Switch v-model:checked="localPrivacy.searchEngineIndex" class="data-[state=checked]:bg-primary" />
        </div>
      </div>
    </div>

    <!-- Keamanan -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-foreground">Keamanan Akun</h3>
      <div class="space-y-3">
        <Button variant="outline" class="w-full justify-start border-input hover:bg-accent hover:text-accent-foreground"
          @click="changePassword">
          <Lock class="mr-2 h-4 w-4 text-muted-foreground" />
          Ubah Kata Sandi
        </Button>

        <Button variant="outline"
          class="w-full justify-start text-warning border-input hover:bg-warning/10 hover:text-warning"
          @click="manageSessions">
          <Shield class="mr-2 h-4 w-4" />
          Kelola Sesi Login
        </Button>

        <Button variant="outline"
          class="w-full justify-start text-destructive border-input hover:bg-destructive/10 hover:text-destructive"
          @click="deleteAccount">
          <Trash2 class="mr-2 h-4 w-4" />
          Hapus Akun
        </Button>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end space-x-3 pt-4 border-t border-border">
      <Button variant="outline" @click="resetPrivacy" class="border-input hover:bg-accent hover:text-accent-foreground">
        Reset
      </Button>
      <Button @click="savePrivacy" class="bg-primary text-primary-foreground hover:bg-primary/90">
        Simpan Pengaturan
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select/'
import Label from '@/components/ui/label/Label.vue'
import Switch from '@/components/ui/switch/Switch.vue'
import { Button } from '@/components/ui/button'
import { Lock, Shield, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  privacy: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:privacy'])

// Data lokal
const localPrivacy = ref({ ...props.privacy })
const showSessions = ref(false)

const manageSessions = () => {
  showSessions.value = true
}
// Watch for prop changes
watch(() => props.privacy, (newVal) => {
  localPrivacy.value = { ...newVal }
}, { deep: true })

// Methods
const savePrivacy = () => {
  emit('update:privacy', localPrivacy.value)
  alert('Pengaturan privasi berhasil disimpan!')
}

const resetPrivacy = () => {
  localPrivacy.value = { ...props.privacy }
}

const changePassword = () => {
  alert('Fungsi ubah kata sandi akan diimplementasikan di sini')
}

const deleteAccount = () => {
  if (confirm('Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.')) {
    alert('Fungsi hapus akun akan diimplementasikan di sini')
  }
}
</script>
