import { apiClient } from '@/utils/apiClient';
import { toast } from 'vue-sonner';

export const newsletterApi = {
    async subscribe(email: string): Promise<void> {
        const response = await apiClient.fetch('/api/newsletter/subscribe', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 409 || (response.status === 200 && data.message === 'Email already subscribed')) {
                toast.info('You are already subscribed to our newsletter.');
                return;
            }
            throw new Error(data.error || 'Failed to subscribe');
        }

        toast.success(data.message || 'Subscribed successfully!');
    },
};
