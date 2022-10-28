import dayjs from "./dayjs";

type GetDatesBetweenType = {
  startDate: Date;
  endDate: Date;
}

export const getDatesBetween = ({ startDate, endDate }: GetDatesBetweenType): Date[] => {
  const dayjsStartDate = dayjs.utc(startDate);
  const dayjsEndDate = dayjs.utc(endDate);

  const dateArray: Date[] = [];
  let currentDate = dayjsStartDate;

  while (currentDate <= dayjsEndDate || currentDate.isSame(dayjsEndDate, 'day')) {
    dateArray.push(currentDate.toDate());
    currentDate = currentDate.add(1, 'day');
  }

  return dateArray;
}
