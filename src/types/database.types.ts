export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      iris: {
        Row: {
          created_at: string
          id: number
          petal_length: number
          petal_width: number
          sepal_length: number
          sepal_width: number
          species: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: never
          petal_length: number
          petal_width: number
          sepal_length: number
          sepal_width: number
          species: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: never
          petal_length?: number
          petal_width?: number
          sepal_length?: number
          sepal_width?: number
          species?: string
          updated_at?: string
        }
        Relationships: []
      }
      wisconsin_breast_cancer: {
        Row: {
          area_mean: number
          area_se: number
          area_worst: number
          compactness_mean: number
          compactness_se: number
          compactness_worst: number
          concave_points_mean: number
          concave_points_se: number
          concave_points_worst: number
          concavity_mean: number
          concavity_se: number
          concavity_worst: number
          created_at: string
          diagnosis:
            | Database["public"]["Enums"]["breast_cancer_diagnosis"]
            | null
          fractal_dimension_mean: number
          fractal_dimension_se: number
          fractal_dimension_worst: number
          id: number
          perimeter_mean: number
          perimeter_se: number
          perimeter_worst: number
          radius_mean: number
          radius_se: number
          radius_worst: number
          smoothness_mean: number
          smoothness_se: number
          smoothness_worst: number
          symmetry_mean: number
          symmetry_se: number
          symmetry_worst: number
          texture_mean: number
          texture_se: number
          texture_worst: number
          updated_at: string
        }
        Insert: {
          area_mean: number
          area_se: number
          area_worst: number
          compactness_mean: number
          compactness_se: number
          compactness_worst: number
          concave_points_mean: number
          concave_points_se: number
          concave_points_worst: number
          concavity_mean: number
          concavity_se: number
          concavity_worst: number
          created_at?: string
          diagnosis?:
            | Database["public"]["Enums"]["breast_cancer_diagnosis"]
            | null
          fractal_dimension_mean: number
          fractal_dimension_se: number
          fractal_dimension_worst: number
          id?: never
          perimeter_mean: number
          perimeter_se: number
          perimeter_worst: number
          radius_mean: number
          radius_se: number
          radius_worst: number
          smoothness_mean: number
          smoothness_se: number
          smoothness_worst: number
          symmetry_mean: number
          symmetry_se: number
          symmetry_worst: number
          texture_mean: number
          texture_se: number
          texture_worst: number
          updated_at?: string
        }
        Update: {
          area_mean?: number
          area_se?: number
          area_worst?: number
          compactness_mean?: number
          compactness_se?: number
          compactness_worst?: number
          concave_points_mean?: number
          concave_points_se?: number
          concave_points_worst?: number
          concavity_mean?: number
          concavity_se?: number
          concavity_worst?: number
          created_at?: string
          diagnosis?:
            | Database["public"]["Enums"]["breast_cancer_diagnosis"]
            | null
          fractal_dimension_mean?: number
          fractal_dimension_se?: number
          fractal_dimension_worst?: number
          id?: never
          perimeter_mean?: number
          perimeter_se?: number
          perimeter_worst?: number
          radius_mean?: number
          radius_se?: number
          radius_worst?: number
          smoothness_mean?: number
          smoothness_se?: number
          smoothness_worst?: number
          symmetry_mean?: number
          symmetry_se?: number
          symmetry_worst?: number
          texture_mean?: number
          texture_se?: number
          texture_worst?: number
          updated_at?: string
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
      breast_cancer_diagnosis: "malignant" | "benign"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objects_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

