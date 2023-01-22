import dayjs from "dayjs";
import isToday from 'dayjs/plugin/isToday';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { timezone as expoTimezone } from 'expo-localization';

dayjs.extend(isToday);
dayjs.extend(utc);
dayjs.extend(timezone);

const userTimezone = expoTimezone;

dayjs.prototype.formatToUserTimezone = (date: string | Date): Date => dayjs.utc(date).tz(userTimezone).toDate();

export default dayjs;
