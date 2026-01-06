import { ref } from 'vue';
import { useConnection } from '@wagmi/vue';
import type { AddressBookEntry } from '@/modules/send/types/send.types';

export function useAddressBook() {
  const { address: userAddress } = useConnection();

  const addresses = ref<AddressBookEntry[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const API_BASE = '/api/addressBook';

  async function fetchAddresses(chainId?: number) {
    if (!userAddress.value) return;

    loading.value = true;
    error.value = null;

    try {
      const url = new URL(`${API_BASE}`);
      url.searchParams.set('userAddress', userAddress.value);
      if (chainId) {
        url.searchParams.set('chainId', chainId.toString());
      }

      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        addresses.value = result.data;
      } else {
        throw new Error(result.error || 'Failed to fetch addresses');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      }
      console.error('Fetch addresses error:', err);
    } finally {
      loading.value = false;
    }
  }

  async function addAddress(data: Omit<AddressBookEntry, 'id' | 'created_at' | 'updated_at'>) {
    if (!userAddress.value) throw new Error('User not connected');

    const response = await fetch(`${API_BASE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, user_address: userAddress.value })
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to add address');
    }

    return result.data;
  }

  async function updateAddress(id: number, data: Partial<AddressBookEntry>) {
    if (!userAddress.value) throw new Error('User not connected');

    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to update address');
    }

    return result.data;
  }

  async function deleteAddress(id: number) {
    if (!userAddress.value) throw new Error('User not connected');

    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE'
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to delete address');
    }

    return result;
  }

  return {
    addresses,
    loading,
    error,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress
  };
}
