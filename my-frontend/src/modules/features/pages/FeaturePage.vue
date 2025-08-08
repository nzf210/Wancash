<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';



const testimonials = [
  {
    name: "John A",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
    rating: 4.1,
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
  },
  {
    name: "John B",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
    rating: 4.5,
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
  },
  {
    name: "John C",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
    rating: 4.8,
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
  },
  {
    name: "John Doe",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
    rating: 2.3,
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
  },
]

const liveActivities = [
  {
    id: 1,
    name: "John Doe",
    initials: "JD",
    amount: 100,
    time: "1 menit yang lalu",
  },
  {
    id: 2,
    name: "John Doe",
    initials: "JD",
    amount: 100,
    time: "1 menit yang lalu",
  },
  {
    id: 3,
    name: "John Doe",
    initials: "JD",
    amount: 100,
    time: "1 menit yang lalu",
  },
]

const paymentMethods = [
  {
    name: "Gopay",
    icon: "gopay",
    method: "gopay",
  },
  {
    name: "OVO",
    icon: "ovo",
    method: "ovo",
  },
  {
    name: "Dana",
    icon: "dana",
    method: "dana",
  },
]
</script>

<template>
  <Carousel class="py-8">
    <CarouselContent>
      <CarouselItem v-for="(testi, i) in testimonials" :key="i" class="md:basis-1/2 lg:basis-1/3">
        <Card>
          <CardContent class="p-6">
            <StarRating :rating="testi.rating" />
            <p class="mt-4 italic">"{{ testi.text }}"</p>
            <div class="mt-4 flex items-center">
              <Avatar class="mr-2">
                <AvatarImage :src="testi.avatar" />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
              <span class="font-medium">{{ testi.name }}</span>
            </div>
          </CardContent>
        </Card>
      </CarouselItem>
    </CarouselContent>
  </Carousel>

  <div class="bg-gradient-to-r from-primary to-primary/90 py-12 text-center text-white">
    <h1 class="text-4xl font-bold mb-4">Isi Token Sekarang!</h1>
    <p class="text-xl mb-6">Dapatkan bonus hingga 20% untuk pembelian pertama</p>
    <Button class="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg font-bold">
      BELI SEKARANG →
    </Button>
  </div>


  <div class="mt-8 border rounded-lg p-4 max-w-2xl mx-auto">
    <h3 class="font-medium mb-2">Aktivitas Terkini</h3>
    <div class="space-y-3">
      <div v-for="activity in liveActivities" :key="activity.id" class="flex items-center text-sm">
        <Avatar class="h-6 w-6 mr-2">
          <AvatarFallback>{{ activity.initials }}</AvatarFallback>
        </Avatar>
        <span>{{ activity.name }} membeli {{ activity.amount }} token</span>
        <span class="text-muted-foreground ml-auto">{{ activity.time }}</span>
      </div>
    </div>
  </div>


  <div class="flex items-center justify-center mt-8 gap-6 flex-wrap">
    <div class="flex items-center">
      <Icon name="shield-check" class="text-green-500 mr-2" />
      <span>Garansi 100% aman</span>
    </div>
    <div class="flex items-center">
      <Icon name="zap" class="text-yellow-500 mr-2" />
      <span>Pengiriman instan</span>
    </div>
    <div class="flex items-center">
      <Icon name="help-circle" class="text-blue-500 mr-2" />
      <span>Bantuan 24/7</span>
    </div>
  </div>

  <div class="mt-6">
    <h4 class="text-sm font-medium mb-2">Metode Pembayaran:</h4>
    <div class="flex gap-4">
      <img v-for="method in paymentMethods" :key="method.method" :src="`/payment-methods/${method.method}.png`"
        class="h-8 opacity-80 hover:opacity-100 transition-opacity" :alt="method.name">
    </div>
  </div>
</template>


<style>
@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

.highlight-package {
  animation: pulse 2s infinite;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
}
</style>
