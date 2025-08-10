<script setup lang="ts">
import { SunIcon, MoonIcon, DesktopIcon } from '@radix-icons/vue'
import { useTheme } from '@/app/components/providers/theme-provider'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const { setTheme, resolvedTheme } = useTheme()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="sm" class="h-9 w-9 px-0">
        <SunIcon v-if="resolvedTheme === 'light'" class="h-4 w-4" />
        <MoonIcon v-else class="h-4 w-4" />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="setTheme('light')">
        <SunIcon class="mr-2 h-4 w-4" />
        <span>Light</span>
      </DropdownMenuItem>
      <DropdownMenuItem @click="setTheme('dark')">
        <MoonIcon class="mr-2 h-4 w-4" />
        <span>Dark</span>
      </DropdownMenuItem>
      <DropdownMenuItem @click="setTheme('system')">
        <DesktopIcon class="mr-2 h-4 w-4" />
        <span>System</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
