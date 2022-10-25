import type { Dayjs } from "dayjs";

type GetDatesBetweenType = {
  startDate: Dayjs;
  endDate: Dayjs;
}

export const getDatesBetween = ({ startDate, endDate }: GetDatesBetweenType): Dayjs[] => {
  const dateArray: Dayjs[] = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    dateArray.push(currentDate);
    currentDate = currentDate.add(1, 'day');
  }

  return dateArray;
}
