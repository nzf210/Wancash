export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bridge_transactions: {
        Row: {
          amount: number
          bridge_fee: number | null
          bridge_id: string
          bridge_provider: string | null
          bridge_status: string | null
          completed_at: string | null
          created_at: string | null
          destination_chain_id: number
          destination_tx_hash: string | null
          id: string
          initiated_at: string | null
          source_chain_id: number
          source_tx_hash: string | null
          token_id: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          bridge_fee?: number | null
          bridge_id: string
          bridge_provider?: string | null
          bridge_status?: string | null
          completed_at?: string | null
          created_at?: string | null
          destination_chain_id: number
          destination_tx_hash?: string | null
          id?: string
          initiated_at?: string | null
          source_chain_id: number
          source_tx_hash?: string | null
          token_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          bridge_fee?: number | null
          bridge_id?: string
          bridge_provider?: string | null
          bridge_status?: string | null
          completed_at?: string | null
          created_at?: string | null
          destination_chain_id?: number
          destination_tx_hash?: string | null
          id?: string
          initiated_at?: string | null
          source_chain_id?: number
          source_tx_hash?: string | null
          token_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bridge_transactions_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bridge_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      redemption_transactions: {
        Row: {
          amount: number
          claim_tx_hash: string | null
          claimed_at: string | null
          created_at: string | null
          id: string
          redemption_type: string | null
          status: string | null
          token_id: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          claim_tx_hash?: string | null
          claimed_at?: string | null
          created_at?: string | null
          id?: string
          redemption_type?: string | null
          status?: string | null
          token_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          claim_tx_hash?: string | null
          claimed_at?: string | null
          created_at?: string | null
          id?: string
          redemption_type?: string | null
          status?: string | null
          token_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "redemption_transactions_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "redemption_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      staking_transactions: {
        Row: {
          amount: number
          block_timestamp: string
          created_at: string | null
          id: string
          pool_address: string
          status: string | null
          token_id: string | null
          transaction_type: string | null
          tx_hash: string
          user_id: string | null
        }
        Insert: {
          amount: number
          block_timestamp: string
          created_at?: string | null
          id?: string
          pool_address: string
          status?: string | null
          token_id?: string | null
          transaction_type?: string | null
          tx_hash: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          block_timestamp?: string
          created_at?: string | null
          id?: string
          pool_address?: string
          status?: string | null
          token_id?: string | null
          transaction_type?: string | null
          tx_hash?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staking_transactions_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staking_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      token_transfers: {
        Row: {
          amount: number
          block_number: number
          block_timestamp: string
          chain_id: number
          created_at: string | null
          from_address: string
          gas_fee: number | null
          id: string
          status: string | null
          to_address: string
          token_id: string | null
          transaction_type: string | null
          tx_hash: string
          user_id: string | null
        }
        Insert: {
          amount: number
          block_number: number
          block_timestamp: string
          chain_id: number
          created_at?: string | null
          from_address: string
          gas_fee?: number | null
          id?: string
          status?: string | null
          to_address: string
          token_id?: string | null
          transaction_type?: string | null
          tx_hash: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          block_number?: number
          block_timestamp?: string
          chain_id?: number
          created_at?: string | null
          from_address?: string
          gas_fee?: number | null
          id?: string
          status?: string | null
          to_address?: string
          token_id?: string | null
          transaction_type?: string | null
          tx_hash?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "token_transfers_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "token_transfers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tokens: {
        Row: {
          chain_id: number
          contract_address: string
          created_at: string | null
          decimals: number
          id: string
          is_active: boolean | null
          is_native: boolean | null
          logo_url: string | null
          name: string
          price_updated_at: string | null
          price_usd: number | null
          symbol: string
        }
        Insert: {
          chain_id: number
          contract_address: string
          created_at?: string | null
          decimals: number
          id?: string
          is_active?: boolean | null
          is_native?: boolean | null
          logo_url?: string | null
          name: string
          price_updated_at?: string | null
          price_usd?: number | null
          symbol: string
        }
        Update: {
          chain_id?: number
          contract_address?: string
          created_at?: string | null
          decimals?: number
          id?: string
          is_active?: boolean | null
          is_native?: boolean | null
          logo_url?: string | null
          name?: string
          price_updated_at?: string | null
          price_usd?: number | null
          symbol?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          chain_id: number | null
          created_at: string | null
          email: string | null
          id: string
          last_login: string | null
          updated_at: string | null
          username: string | null
          wallet_address: string
        }
        Insert: {
          avatar_url?: string | null
          chain_id?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_login?: string | null
          updated_at?: string | null
          username?: string | null
          wallet_address: string
        }
        Update: {
          avatar_url?: string | null
          chain_id?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_login?: string | null
          updated_at?: string | null
          username?: string | null
          wallet_address?: string
        }
        Relationships: []
      }
      user_tables: {
        Row: {
          bio: string | null
          created_at: string
          currency: string | null
          email: string | null
          full_name: string | null
          id: number
          language: string | null
          name: string | null
          notif_keamanan: string | null
          notif_newslater: string | null
          notif_penawaran: string | null
          role: string | null
          w_address: string | null
          xxx_i: string | null
          xxx_ii: string | null
          xxx_iii: string | null
          zona: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          currency?: string | null
          email?: string | null
          full_name?: string | null
          id?: number
          language?: string | null
          name?: string | null
          notif_keamanan?: string | null
          notif_newslater?: string | null
          notif_penawaran?: string | null
          role?: string | null
          w_address?: string | null
          xxx_i?: string | null
          xxx_ii?: string | null
          xxx_iii?: string | null
          zona?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          currency?: string | null
          email?: string | null
          full_name?: string | null
          id?: number
          language?: string | null
          name?: string | null
          notif_keamanan?: string | null
          notif_newslater?: string | null
          notif_penawaran?: string | null
          role?: string | null
          w_address?: string | null
          xxx_i?: string | null
          xxx_ii?: string | null
          xxx_iii?: string | null
          zona?: string | null
        }
        Relationships: []
      }
      user_token_balances: {
        Row: {
          balance: number | null
          created_at: string | null
          id: string
          last_updated: string | null
          token_id: string | null
          user_id: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          id?: string
          last_updated?: string | null
          token_id?: string | null
          user_id?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          id?: string
          last_updated?: string | null
          token_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_token_balances_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_token_balances_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
