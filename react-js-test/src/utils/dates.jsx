import dayjs from 'dayjs';

export function sortDates(arr) {
    return arr.sort((a, b) => dayjs(a.date, "DD-MM-YYYY").diff(dayjs(b.date, "DD-MM-YYYY")));
}