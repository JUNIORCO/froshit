import type { Event } from "../supabase/types/extended";
import dayjs from "../utils/dayjs";

export const eventFormatter = (event: Event['Row']): Event['Row'] => ({
  ...event,
  startDate: dayjs.prototype.formatToUserTimezone(event.startDate),
  endDate: dayjs.prototype.formatToUserTimezone(event.endDate),
})
