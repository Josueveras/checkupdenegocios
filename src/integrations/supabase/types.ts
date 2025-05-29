export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      configuracoes: {
        Row: {
          cor_primaria: string | null
          cor_secundaria: string | null
          created_at: string
          dominio_proprio: string | null
          fonte: string | null
          fuso_horario: string | null
          id: string
          idioma: string | null
          logo_url: string | null
          nome_agencia: string | null
          notificacoes: Json | null
          updated_at: string
        }
        Insert: {
          cor_primaria?: string | null
          cor_secundaria?: string | null
          created_at?: string
          dominio_proprio?: string | null
          fonte?: string | null
          fuso_horario?: string | null
          id?: string
          idioma?: string | null
          logo_url?: string | null
          nome_agencia?: string | null
          notificacoes?: Json | null
          updated_at?: string
        }
        Update: {
          cor_primaria?: string | null
          cor_secundaria?: string | null
          created_at?: string
          dominio_proprio?: string | null
          fonte?: string | null
          fuso_horario?: string | null
          id?: string
          idioma?: string | null
          logo_url?: string | null
          nome_agencia?: string | null
          notificacoes?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      diagnosticos: {
        Row: {
          created_at: string
          empresa_id: string
          id: string
          nivel: string
          pdf_url: string | null
          pontos_atencao: Json | null
          pontos_fortes: Json | null
          recomendacoes: Json | null
          score_estrategia: number
          score_gestao: number | null
          score_marketing: number
          score_total: number
          score_vendas: number
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          empresa_id: string
          id?: string
          nivel: string
          pdf_url?: string | null
          pontos_atencao?: Json | null
          pontos_fortes?: Json | null
          recomendacoes?: Json | null
          score_estrategia?: number
          score_gestao?: number | null
          score_marketing?: number
          score_total?: number
          score_vendas?: number
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          empresa_id?: string
          id?: string
          nivel?: string
          pdf_url?: string | null
          pontos_atencao?: Json | null
          pontos_fortes?: Json | null
          recomendacoes?: Json | null
          score_estrategia?: number
          score_gestao?: number | null
          score_marketing?: number
          score_total?: number
          score_vendas?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnosticos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          cliente_email: string | null
          cliente_nome: string | null
          cliente_telefone: string | null
          created_at: string
          faturamento: string | null
          funcionarios: string | null
          id: string
          nome: string
          setor: string | null
          site_instagram: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          cliente_email?: string | null
          cliente_nome?: string | null
          cliente_telefone?: string | null
          created_at?: string
          faturamento?: string | null
          funcionarios?: string | null
          id?: string
          nome: string
          setor?: string | null
          site_instagram?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          cliente_email?: string | null
          cliente_nome?: string | null
          cliente_telefone?: string | null
          created_at?: string
          faturamento?: string | null
          funcionarios?: string | null
          id?: string
          nome?: string
          setor?: string | null
          site_instagram?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      integracoes: {
        Row: {
          ativa: boolean
          configuracao: Json
          created_at: string
          id: string
          tipo: string
          updated_at: string
        }
        Insert: {
          ativa?: boolean
          configuracao: Json
          created_at?: string
          id?: string
          tipo: string
          updated_at?: string
        }
        Update: {
          ativa?: boolean
          configuracao?: Json
          created_at?: string
          id?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      perguntas: {
        Row: {
          ativa: boolean
          categoria: string
          created_at: string
          id: string
          obrigatoria: boolean
          opcoes: Json | null
          pergunta: string
          tipo: string
          updated_at: string
        }
        Insert: {
          ativa?: boolean
          categoria: string
          created_at?: string
          id?: string
          obrigatoria?: boolean
          opcoes?: Json | null
          pergunta: string
          tipo?: string
          updated_at?: string
        }
        Update: {
          ativa?: boolean
          categoria?: string
          created_at?: string
          id?: string
          obrigatoria?: boolean
          opcoes?: Json | null
          pergunta?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      planos: {
        Row: {
          ativo: boolean
          categoria: string | null
          created_at: string
          id: string
          nome: string
          objetivo: string
          tarefas: Json
          updated_at: string
          valor: number
        }
        Insert: {
          ativo?: boolean
          categoria?: string | null
          created_at?: string
          id?: string
          nome: string
          objetivo: string
          tarefas: Json
          updated_at?: string
          valor: number
        }
        Update: {
          ativo?: boolean
          categoria?: string | null
          created_at?: string
          id?: string
          nome?: string
          objetivo?: string
          tarefas?: Json
          updated_at?: string
          valor?: number
        }
        Relationships: []
      }
      propostas: {
        Row: {
          acoes_sugeridas: Json
          created_at: string
          diagnostico_id: string
          id: string
          objetivo: string
          pdf_url: string | null
          plano_id: string | null
          prazo: string | null
          status: string
          updated_at: string
          valor: number
        }
        Insert: {
          acoes_sugeridas: Json
          created_at?: string
          diagnostico_id: string
          id?: string
          objetivo: string
          pdf_url?: string | null
          plano_id?: string | null
          prazo?: string | null
          status?: string
          updated_at?: string
          valor: number
        }
        Update: {
          acoes_sugeridas?: Json
          created_at?: string
          diagnostico_id?: string
          id?: string
          objetivo?: string
          pdf_url?: string | null
          plano_id?: string | null
          prazo?: string | null
          status?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "propostas_diagnostico_id_fkey"
            columns: ["diagnostico_id"]
            isOneToOne: false
            referencedRelation: "diagnosticos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "propostas_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos"
            referencedColumns: ["id"]
          },
        ]
      }
      respostas: {
        Row: {
          created_at: string
          diagnostico_id: string
          id: string
          pergunta_id: string
          resposta: string | null
          score: number
        }
        Insert: {
          created_at?: string
          diagnostico_id: string
          id?: string
          pergunta_id: string
          resposta?: string | null
          score?: number
        }
        Update: {
          created_at?: string
          diagnostico_id?: string
          id?: string
          pergunta_id?: string
          resposta?: string | null
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "respostas_diagnostico_id_fkey"
            columns: ["diagnostico_id"]
            isOneToOne: false
            referencedRelation: "diagnosticos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "respostas_pergunta_id_fkey"
            columns: ["pergunta_id"]
            isOneToOne: false
            referencedRelation: "perguntas"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notifications: {
        Row: {
          created_at: string | null
          diagnostic_notifications: boolean | null
          email_enabled: boolean | null
          id: string
          proposal_notifications: boolean | null
          reports_enabled: boolean | null
          subscription_notifications: boolean | null
          updated_at: string | null
          user_id: string | null
          whatsapp_enabled: boolean | null
        }
        Insert: {
          created_at?: string | null
          diagnostic_notifications?: boolean | null
          email_enabled?: boolean | null
          id?: string
          proposal_notifications?: boolean | null
          reports_enabled?: boolean | null
          subscription_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          whatsapp_enabled?: boolean | null
        }
        Update: {
          created_at?: string | null
          diagnostic_notifications?: boolean | null
          email_enabled?: boolean | null
          id?: string
          proposal_notifications?: boolean | null
          reports_enabled?: boolean | null
          subscription_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          whatsapp_enabled?: boolean | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          cargo: string | null
          created_at: string | null
          empresa: string | null
          id: string
          nome: string | null
          telefone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cargo?: string | null
          created_at?: string | null
          empresa?: string | null
          id?: string
          nome?: string | null
          telefone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cargo?: string | null
          created_at?: string | null
          empresa?: string | null
          id?: string
          nome?: string | null
          telefone?: string | null
          updated_at?: string | null
          user_id?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
