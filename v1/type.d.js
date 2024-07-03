/**
 * @typedef {Object} DatabaseField
 * @property {string} id
 * @property {string} collectionId
 * @property {string} collectionName
 * @property {string} created
 * @property {string} updated
 */

/**
 * @typedef {"yearly"|"monthly"} RepeatTypeEvent
 */

/**
 * @typedef {Object} BaseRoutine
 * @property {string} title
 * @property {string} description
 * @property {string} image
 * @property {string} start
 * @property {string} end
 * @property {boolean} isEvent
 * @property {string} parentId
 * @property {string} userStart
 * @property {string} userEnd
 * @property {boolean} isDirty
 * @property {RepeatTypeEvent} repeatTypeEvent
 * @property {Array<string>} repeatDaysTask
 * @property {boolean} allDay
 */

/**
 * @typedef {Object} ConvBaseRoutine
 * @property {string} title
 * @property {string} description
 * @property {string} image
 * @property {Date} start
 * @property {Date} end
 * @property {boolean} isEvent
 * @property {string} parentId
 */

/**
 * @typedef {Object} ConvBaseRoutineEventFields
 * @property {RepeatTypeEvent} repeatTypeEvent
 * @property {boolean} allDay
 */

/**
 * @typedef {Object} ConvBaseRoutineTaskFields
 * @property {Date} userStart
 * @property {Date} userEnd
 * @property {boolean} isDirty
 * @property {Array<string>} repeatDaysTask
 */

/**
 * @typedef {ConvBaseRoutine & ConvBaseRoutineEventFields} ConvEventRoutine
 */

/**
 * @typedef {ConvBaseRoutine & ConvBaseRoutineTaskFields & {
 * taskState: "stack"|"done"
 * }} ConvTaskRoutine
 */

/**
 * @typedef {{
 * tasks: Array<string>
 * minutes: Array<number>
 * bulletin_board: string
 * studyWidgetData: Array<{title: string, description: string, day: number}>
 * taskRoutines: Array<ConvTaskRoutine>
 * eventRoutines: Array<ConvEventRoutine>
 * routineManager: any
 * calendarManager: any
 * setCalendarStudyEvents: any
 * subjectsSortOrder: Array<string>
 * radioStations: Array<any>
 * }} AppContext
 */
