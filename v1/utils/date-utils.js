export function getUtcOffset() {
  const now = dayjs();
  return now.utcOffset();
}

/**
 * Checks if a string is in the format HH:MM.
 *
 * @param {string} str - The string to be checked.
 * @returns {boolean} Returns true if the string is in the format HH:MM, otherwise returns false.
 */
export const isHHMM = (str) => {
  return /^\d{2}:\d{2}$/.test(str);
};

/**
 * Converts a time string in the format "hh:mm" to a Date object representing today's date.
 *
 * @param {string} hhmm - The time string in the format "hh:mm".
 * @returns {Date} - A Date object representing today's date with the specified time.
 */
export const hhmmToTodayDate = (hhmm) => {
  const [hh, mm] = hhmm.split(":");
  return dayjs().hour(hh).minute(mm).second(0).millisecond(0).toDate();
};

/**
 * @param {Date|string} dateOrdateStr - The date or date string to be normalized.
 * @returns {Date} - The normalized date as a Date object.
 */
export const transformDbUtcStrToLocal = (dateOrdateStr) => {
  if (isHHMM(dateOrdateStr)) {
    return hhmmToTodayDate(dateOrdateStr);
  }
  return dayjs(dateOrdateStr).subtract(getUtcOffset(), "minute").toDate();
};

export const transformLocalToDbUtcStr = (date) => {
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss.SSS") + "Z";
};

/**
 * Converts a given date to today's date.
 *
 * @param {Date} date - The date to be converted.
 * @returns {Date} - The converted date.
 */
export const toTodayDate = (date) => {
  return dayjs(date)
    .set("year", dayjs().year())
    .set("month", dayjs().month())
    .set("date", dayjs().date())
    .toDate();
};

export const toStartOfDay = (date) => {
  return dayjs(date).startOf("day").toDate();
};

export const toEndOfDay = (date) => {
  return dayjs(date).endOf("day").toDate();
};

export const hhmmFormatDate = (date) => {
  return dayjs(date).format("HH:mm");
};

export const isToday = (date) => {
  return dayjs(date).isSame(dayjs(), "day");
};

export const isBetween = (date, start, end) => {
  return dayjs(date).isBetween(start, end, null, "[]");
};
