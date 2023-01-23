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

export type DatabaseTypes = Database['public']['Tables'];

export type _EventToFrosh = DatabaseTypes['_EventToFrosh'];
export type Event = DatabaseTypes['event'];
export type Frosh = DatabaseTypes['frosh'];
export type Message = DatabaseTypes['message'];
export type Offer = DatabaseTypes['offer'];
export type Payment = DatabaseTypes['payment'];
export type Profile = DatabaseTypes['profile'];
export type Resource = DatabaseTypes['resource'];
export type ResourceTag = DatabaseTypes['resource_tag'];
export type Team = DatabaseTypes['team'];
export type University = DatabaseTypes['university'];

/* Enums */
export type PaymentType = Database['public']['Enums']['PaymentType'];
export type Role = Database['public']['Enums']['Role'];
