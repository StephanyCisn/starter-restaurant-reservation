const dateFormat = /\d\d\d\d-\d\d-\d\d/;
const timeFormat = /\d\d:\d\d/;

/**
 * Formats a Date object as YYYY-MM-DD.
 *
 * This function is *not* exported because the UI should generally avoid working directly with Date instance.
 * You may export this function if you need it.
 *
 * @param date
 *  an instance of a date object
 * @returns {string}
 *  the specified Date formatted as YYYY-MM-DD
 */
function asDateString(date) {
  return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
    .toString(10)
    .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
}

/**
 * Format a date string in ISO-8601 format (which is what is returned from PostgreSQL) as YYYY-MM-DD.
 * @param dateString
 *  ISO-8601 date string
 * @returns {*}
 *  the specified date string formatted as YYYY-MM-DD
 */
export function formatAsDate(dateString) {
  return dateString.match(dateFormat)[0];
}

/**
 * Format a time string in HH:MM:SS format (which is what is returned from PostgreSQL) as HH:MM.
 * @param timeString
 *  HH:MM:SS time string
 * @returns {*}
 *  the specified time string formatted as YHH:MM.
 */
export function formatAsTime(timeString) {
  return timeString.match(timeFormat)[0];
}

/**
 * Today's date as YYYY-MM-DD.
 * @returns {*}
 *  the today's date formatted as YYYY-MM-DD
 */
export function today() {
  return asDateString(new Date());
}

/**
 * Subtracts one day to the specified date and return it in as YYYY-MM-DD.
 * @param currentDate
 *  a date string in YYYY-MM-DD format (this is also ISO-8601 format)
 * @returns {*}
 *  the date one day prior to currentDate, formatted as YYYY-MM-DD
 */
export function previous(currentDate) {
  let [ year, month, day ] = currentDate.split("-");
  month -= 1;
  const date = new Date(year, month, day);
  date.setMonth(date.getMonth());
  date.setDate(date.getDate() - 1);
  return asDateString(date);
}

/**
 * Adds one day to the specified date and return it in as YYYY-MM-DD.
 * @param currentDate
 *  a date string in YYYY-MM-DD format (this is also ISO-8601 format)
 * @returns {*}
 *  the date one day after currentDate, formatted as YYYY-MM-DD
 */
export function next(currentDate) {
  let [ year, month, day ] = currentDate.split("-");
  month -= 1;
  const date = new Date(year, month, day);
  date.setMonth(date.getMonth());
  date.setDate(date.getDate() + 1);
  return asDateString(date);
}

/**
 * Accepts a date object and returns it written out in Month-Day-Year format.
 * @param date 
 * a date object
 * @returns {*}
 * a string of the date written out in Month-Day-Year format
 */
export function displayDate(date) {
  const monthArray = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const d = new Date(date);
  let month = monthArray[d.getMonth()];
  let dateString = `${month} ${d.getDate()}, ${d.getFullYear()}`;
  return dateString;
}

/**
 * Accepts a military time and returns it in standard time.
 * @param time 
 * a string of a specific time, either military or standard time
 * @returns {*}
 * a standard time formated with A.M./P.M. label
 */
export function displayTime(time) {
  let formatTime;
  const militaryTime = time.split(':');
  militaryTime[0] = parseInt(militaryTime[0]);
  if(militaryTime[0] > 11){ 
      if(militaryTime[0] > 12){ militaryTime[0] -= 12; }
      formatTime = `${militaryTime[0]}:${militaryTime[1]} P.M.`;
  } else {
      formatTime = `${militaryTime[0]}:${militaryTime[1]} A.M.`;
  }

  return formatTime;
}