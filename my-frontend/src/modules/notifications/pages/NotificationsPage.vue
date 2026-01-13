<script setup lang="ts">
import NotificationList from '@/app/components/navbar/notifications/NotificationList.vue'
import { Card, CardContent } from '@/components/ui/card'
</script>

<template>
    <div class="container py-8 max-w-3xl mx-auto">
        <div class="mb-6">
            <h1 class="text-3xl font-bold tracking-tight">Notifications</h1>
            <p class="text-muted-foreground mt-2">
                Manage your notifications and alerts.
            </p>
        </div>

        <Card>
            <CardContent class="p-0">
                <NotificationList :is-page="true" />
            </CardContent>
        </Card>
    </div>
</template>
