/**
 * @typedef {Object} DbFields
 * @property {string} id
 * @property {string} collectionId
 * @property {string} collectionName
 * @property {string} created
 * @property {string} updated
 */

/**
 * @typedef {Object} RawRoutine
 * @property {string} title - title of the routine
 * @property {string} start - "HH:MM"
 * @property {string} end - "HH:MM"
 * @property {string} description - description of the routine
 * @property {Array<string>} repeat - ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
 */

/**
 * @typedef {Object} RawUserRoutine
 * @property {string} title - title of the routine
 * @property {string} start - "HH:MM"
 * @property {string} end - "HH:MM"
 * @property {string} description - description of the routine
 * @property {string} date - "YYYY-MM-DD"
 * @property {boolean} done - true if the routine is done
 */

/**
 * @typedef {Object} RawStudy
 * @property {string} subject - title of the routine
 * @property {string} chapter - "HH:MM"
 * @property {Array<{
 * what: string
 * how: string
 * done: boolean
 * doneDate: string
 * }>} chapterStudyRoutines - doneDate is "YYYY-MM-DD"
 */

/**
 * @typedef {Object} RawCalendar
 * @property {string} title - title of the calendar event
 * @property {string} start - "YYYY-MM-DDTHH:MM:SS"
 * @property {string} end - "YYYY-MM-DDTHH:MM:SS"
 * @property {string} description - description of the calendar event
 * @property {"YEARLY"|"MONTHLY"|""} repeat - repeat type
 * @property {boolean} allDay - true if the event is all day
 */

/**
 * @typedef {Object} RawConfig
 * @property {Array<number>} studyGapsBetween
 */
