export interface Chain {
  id: number;
  name: string;
  symbol: string;
  type: string;
  fee: number;
  network: string;
  icon?: string; // Optional karena mungkin tidak selalu ada
  eid: number; // LayerZero Endpoint ID
  isTestnet?: boolean;
}

export interface Token {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  chainId?: number;
  logoURI?: string;
}

export interface BridgeHistory {
  id: number;
  fromChain: string;
  toChain: string;
  token: string;
  amount: string;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
}

export interface BridgeQuote {
  fromChain: Chain;
  toChain: Chain;
  fromToken: Token;
  toToken: Token;
  amount: string;
  fee: string;
  estimatedAmount: string;
  estimatedTime: string;
}
