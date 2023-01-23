import dayjs from "./dayjs";
import type { Event } from "../supabase/types/extended";

type GetDatesBetweenType = {
  startDate: Date;
  endDate: Date;
}

export const getDatesBetween = ({ startDate, endDate }: GetDatesBetweenType): Date[] => {
  const dayjsStartDate = dayjs(startDate);
  const dayjsEndDate = dayjs(endDate);

  const dateArray: Date[] = [];
  let currentDate = dayjsStartDate;

  while (currentDate <= dayjsEndDate || currentDate.isSame(dayjsEndDate, 'day')) {
    dateArray.push(currentDate.toDate());
    currentDate = currentDate.add(1, 'day');
  }

  return dateArray;
}

export const getDatesFromEvents = (events: Event['Row'][] | null | undefined): Date[] => {
  if (!events || !events.length) return [];

  const firstDate = events[0].startDate;
  const lastDate = events[events.length - 1].startDate;

  return getDatesBetween({ startDate: new Date(firstDate), endDate: new Date(lastDate) });
}
