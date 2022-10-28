import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

type GetDatesBetweenType = {
  startDate: Date;
  endDate: Date;
}

export const getDatesBetween = ({ startDate, endDate }: GetDatesBetweenType): Dayjs[] => {
  const dayjsStartDate = dayjs(startDate);
  const dayjsEndDate = dayjs(endDate);

  const dateArray: Dayjs[] = [];
  let currentDate = dayjsStartDate;

  while (currentDate <= dayjsEndDate) {
    dateArray.push(currentDate);
    currentDate = currentDate.add(1, 'day');
  }

  return dateArray;
}
