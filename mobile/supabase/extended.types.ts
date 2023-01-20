import { Database } from "./database.types";

/* Tables */
export type Tables = keyof Database['public']['Tables'];

export const Tables: { [key in Tables]: Tables } = {
  _EventToFrosh: '_EventToFrosh',
  event: 'event',
  frosh: 'frosh',
  message: 'message',
  offer: 'offer',
  payment: 'payment',
  profile: 'profile',
  resource: 'resource',
  resource_tag: 'resource_tag',
  team: 'team',
  university: 'university',
};

export type _EventToFrosh = Database['public']['Tables']['_EventToFrosh'];
export type Event = Database['public']['Tables']['event'];
export type Frosh = Database['public']['Tables']['frosh'];
export type Message = Database['public']['Tables']['message'];
export type Offer = Database['public']['Tables']['offer'];
export type Payment = Database['public']['Tables']['payment'];
export type Profile = Database['public']['Tables']['profile'];
export type Resource = Database['public']['Tables']['resource'];
export type ResourceTag = Database['public']['Tables']['resource_tag'];
export type Team = Database['public']['Tables']['team'];
export type University = Database['public']['Tables']['university'];

/* Enums */
export type PaymentType = Database['public']['Enums']['PaymentType'];
export type Role = Database['public']['Enums']['Role'];
