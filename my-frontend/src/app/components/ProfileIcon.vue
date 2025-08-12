<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/app/stores/auth'
import { Button } from '@/components/ui/button'

const authStore = useAuthStore()

</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger asChild class="flex justify-end w-full">
      <Button variant="ghost" class="relative h-10 w-10 rounded-full hover:bg-accent avatar-ring">
        <Avatar class="h-10 w-10">
          <AvatarImage :src="authStore.userAvatar!" :alt="authStore.userDisplayName" />
          <AvatarFallback>{{ authStore.userInitials }}</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent class="w-56 z-[1000]" align="end" :side-offset="8">
      <DropdownMenuLabel class="font-normal">
        <div class="flex flex-col space-y-1">
          <p class="text-sm font-medium leading-none">{{ authStore.userDisplayName }}</p>
          <p class="text-xs leading-none text-muted-foreground">{{ authStore.userEmail }}</p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />

      <DropdownMenuItem @click="authStore.handleProfileClick" class="cursor-pointer" v-if="!authStore.isAuthenticated">
        <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Profil
      </DropdownMenuItem>

      <DropdownMenuItem @click="authStore.handleSettingsClick" class="cursor-pointer">
        <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Pengaturan
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem @click="authStore.handleDisconnect"
        class="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer">
        <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Disconnect
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
