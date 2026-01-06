export interface AddressBookEntry {
  id: number;
  user_address: string;
  label: string;
  address: `0x${string}`;
  chain_id: number;
  created_at: string;
  updated_at: string;
}

export interface TokenSendData {
  to: `0x${string}`;
  amount: string;
  chainId: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ContractConfig {
  address: `0x${string}`;
  abi: unknown[];
}
