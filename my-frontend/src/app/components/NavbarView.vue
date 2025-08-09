<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const isAuthenticated = ref(true) // Ganti dengan state auth sesuai kebutuhan
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container flex h-16 items-center justify-between px-4 mx-auto">
      <!-- Logo dan Menu Navigasi -->
      <div class="flex items-center gap-8">
        <RouterLink to="/" class="flex items-center gap-2">
          <span class="text-xl font-bold text-primary bg-amber-300">TokenKu</span>
        </RouterLink>

        <NavigationMenu v-if="isAuthenticated">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Produk</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul class="grid gap-3 p-4 md:w-[400px]">
                  <li>
                    <NavigationMenuLink as-child>
                      <RouterLink to="/buyWancash"
                        class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div class="text-sm font-medium leading-none">Beli Token</div>
                        <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Beli token untuk kebutuhan Anda
                        </p>
                      </RouterLink>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink as-child>
                      <RouterLink to="/history"
                        class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div class="text-sm font-medium leading-none">Riwayat Transaksi</div>
                        <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Lihat riwayat pembelian token Anda
                        </p>
                      </RouterLink>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <RouterLink to="/help" :class="navigationMenuTriggerStyle()">
                Bantuan
              </RouterLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <!-- Menu User -->
      <div class="flex items-center gap-4">
        <Button v-if="!isAuthenticated" variant="outline" as-child>
          <RouterLink to="/login">Masuk</RouterLink>
        </Button>

        <template v-else>
          <Button variant="ghost" size="icon" class="relative">
            <span class="sr-only">Notifikasi</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <span class="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" class="relative h-8 w-8 rounded-full">
                <Avatar class="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>US</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent class="w-56 z-[1000]" :align="'end'" :side="'bottom'" :side-offset="8"
              :avoid-collisions="false">
              <DropdownMenuLabel class="font-normal">
                <div class="flex flex-col space-y-1">
                  <p class="text-sm font-medium leading-none">shadcn</p>
                  <p class="text-xs leading-none text-muted-foreground">
                    m@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <RouterLink to="/profile" class="w-full hover:bg-accent hover:text-accent-foreground" @click.prevent>
                  Profil
                </RouterLink>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <RouterLink to="/settings" class="w-full hover:bg-accent hover:text-accent-foreground" @click.prevent>
                  Pengaturan
                </RouterLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem class="text-red-600 focus:bg-accent focus:text-red-600 hover:bg-red-50" @select.prevent>
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </template>
      </div>
    </div>
  </header>
</template>
