export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      nftpool: {
        Row: {
          token: string
        }
        Insert: {
          token: string
        }
        Update: {
          token?: string
        }
        Relationships: []
      }
      pool: {
        Row: {
          address: string
          decimals: number
          immutable: boolean
          klast: number
          name: string
          reserve0: number
          reserve1: number
          stable: boolean
          symbol: string
          token0: string
          token0_fee: number
          token1: string
          token1_fee: number
          total_supply: number
        }
        Insert: {
          address: string
          decimals?: number
          immutable?: boolean
          klast: number
          name: string
          reserve0?: number
          reserve1?: number
          stable?: boolean
          symbol: string
          token0: string
          token0_fee?: number
          token1: string
          token1_fee?: number
          total_supply?: number
        }
        Update: {
          address?: string
          decimals?: number
          immutable?: boolean
          klast?: number
          name?: string
          reserve0?: number
          reserve1?: number
          stable?: boolean
          symbol?: string
          token0?: string
          token0_fee?: number
          token1?: string
          token1_fee?: number
          total_supply?: number
        }
        Relationships: []
      }
      price: {
        Row: {
          token: string
          usd: number
        }
        Insert: {
          token: string
          usd: number
        }
        Update: {
          token?: string
          usd?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_token"
            columns: ["token"]
            isOneToOne: false
            referencedRelation: "token"
            referencedColumns: ["address"]
          }
        ]
      }
      token: {
        Row: {
          address: string
          decimals: number
          logo: string | null
          name: string
          stable: boolean
          symbol: string
        }
        Insert: {
          address: string
          decimals?: number
          logo?: string | null
          name: string
          stable?: boolean
          symbol: string
        }
        Update: {
          address?: string
          decimals?: number
          logo?: string | null
          name?: string
          stable?: boolean
          symbol?: string
        }
        Relationships: []
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
