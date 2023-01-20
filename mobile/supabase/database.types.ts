export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      _EventToFrosh: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
      }
      event: {
        Row: {
          id: string
          name: string
          description: string
          startDate: string
          endDate: string
          location: string
          accessibility: string
          imageUrl: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id: string
          name: string
          description: string
          startDate: string
          endDate: string
          location: string
          accessibility: string
          imageUrl?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          startDate?: string
          endDate?: string
          location?: string
          accessibility?: string
          imageUrl?: string | null
          createdAt?: string
          updatedAt?: string
        }
      }
      frosh: {
        Row: {
          id: string
          name: string
          description: string
          stripeProductId: string
          stripePriceId: string
          price: number
          applicationFee: number
          universityId: string
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id: string
          name: string
          description: string
          stripeProductId: string
          stripePriceId: string
          price: number
          applicationFee: number
          universityId: string
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          stripeProductId?: string
          stripePriceId?: string
          price?: number
          applicationFee?: number
          universityId?: string
          createdAt?: string
          updatedAt?: string
        }
      }
      message: {
        Row: {
          id: string
          content: string
          profileFirstName: string
          profileLastName: string
          profileImageUrl: string | null
          profileRole: Database["public"]["Enums"]["Role"]
          profileId: string
          teamId: string
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id: string
          content: string
          profileFirstName: string
          profileLastName: string
          profileImageUrl?: string | null
          profileRole: Database["public"]["Enums"]["Role"]
          profileId: string
          teamId: string
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          content?: string
          profileFirstName?: string
          profileLastName?: string
          profileImageUrl?: string | null
          profileRole?: Database["public"]["Enums"]["Role"]
          profileId?: string
          teamId?: string
          createdAt?: string
          updatedAt?: string
        }
      }
      offer: {
        Row: {
          id: string
          title: string
          description: string
          location: string
          provider: string
          imageUrl: string
          color: string
          universityId: string
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id: string
          title: string
          description: string
          location: string
          provider: string
          imageUrl: string
          color: string
          universityId: string
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          location?: string
          provider?: string
          imageUrl?: string
          color?: string
          universityId?: string
          createdAt?: string
          updatedAt?: string
        }
      }
      payment: {
        Row: {
          id: string
          amount: number
          type: Database["public"]["Enums"]["PaymentType"]
          stripePaymentIntentId: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id: string
          amount: number
          type: Database["public"]["Enums"]["PaymentType"]
          stripePaymentIntentId?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          amount?: number
          type?: Database["public"]["Enums"]["PaymentType"]
          stripePaymentIntentId?: string | null
          createdAt?: string
          updatedAt?: string
        }
      }
      profile: {
        Row: {
          id: string
          email: string
          phoneNumber: string | null
          firstName: string
          lastName: string
          role: Database["public"]["Enums"]["Role"]
          imageUrl: string | null
          interests: string | null
          program: string | null
          universityId: string
          froshId: string | null
          teamId: string | null
          paymentId: string | null
          createdAt: string
          updatedAt: string
          faculty: string | null
        }
        Insert: {
          id: string
          email: string
          phoneNumber?: string | null
          firstName: string
          lastName: string
          role: Database["public"]["Enums"]["Role"]
          imageUrl?: string | null
          interests?: string | null
          program?: string | null
          universityId: string
          froshId?: string | null
          teamId?: string | null
          paymentId?: string | null
          createdAt?: string
          updatedAt?: string
          faculty?: string | null
        }
        Update: {
          id?: string
          email?: string
          phoneNumber?: string | null
          firstName?: string
          lastName?: string
          role?: Database["public"]["Enums"]["Role"]
          imageUrl?: string | null
          interests?: string | null
          program?: string | null
          universityId?: string
          froshId?: string | null
          teamId?: string | null
          paymentId?: string | null
          createdAt?: string
          updatedAt?: string
          faculty?: string | null
        }
      }
      resource: {
        Row: {
          id: string
          title: string
          description: string
          phoneNumber: string | null
          email: string | null
          resourceTagId: string
          universityId: string
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id: string
          title: string
          description: string
          phoneNumber?: string | null
          email?: string | null
          resourceTagId: string
          universityId: string
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          phoneNumber?: string | null
          email?: string | null
          resourceTagId?: string
          universityId?: string
          createdAt?: string
          updatedAt?: string
        }
      }
      resource_tag: {
        Row: {
          id: string
          name: string
          imageUrl: string
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id: string
          name: string
          imageUrl: string
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          name?: string
          imageUrl?: string
          createdAt?: string
          updatedAt?: string
        }
      }
      team: {
        Row: {
          id: string
          number: string
          name: string
          froshId: string
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id: string
          number: string
          name: string
          froshId: string
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          number?: string
          name?: string
          froshId?: string
          createdAt?: string
          updatedAt?: string
        }
      }
      university: {
        Row: {
          id: string
          name: string
          subdomain: string
          imageUrl: string
          stripeConnectedAccountId: string
          stripeConnectedAccountLink: string
          maxTeamCapacity: number
          timezone: string
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id: string
          name: string
          subdomain: string
          imageUrl: string
          stripeConnectedAccountId: string
          stripeConnectedAccountLink: string
          maxTeamCapacity: number
          timezone: string
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          name?: string
          subdomain?: string
          imageUrl?: string
          stripeConnectedAccountId?: string
          stripeConnectedAccountLink?: string
          maxTeamCapacity?: number
          timezone?: string
          createdAt?: string
          updatedAt?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      PaymentType: "Cash" | "Online"
      Role: "Admin" | "Organizer" | "Leader" | "Froshee"
    }
  }
}

export type LoggedInProfile = Database['public']['Tables']['profile']['Row']
  & { frosh: Database['public']['Tables']['frosh']['Row'] }
  & { university: Database['public']['Tables']['university']['Row'] };
