/**
 * @typedef {Object} DbFields
 * @property {string} id
 * @property {string} collectionId
 * @property {string} collectionName
 * @property {string} created
 * @property {string} updated
 */

/**
 * @typedef {{
 * what: string
 * how: string
 * dayAfter: number
 * }} ToDoTypeA
 */

/**
 * @typedef {{
 * done: boolean
 * doneDate: string
 * }} ToDoTypeB
 */

/**
 * @typedef {ToDoTypeA&ToDoTypeB&{expectedDoneDate: string}} NewToDo
 */

/**
 * @typedef {{
 * title: string
 * toDosForm: ToDoTypeA[]
 * }} RawSubject
 */

/**
 * @typedef {{
 * toDosExample: ToDoTypeA[]
 * tasks: string[]
 * }} RawConfig
 */

/**
 * @typedef {{
 * subject: string
 * title: string
 * toDos?: ToDoTypeB[]
 * }} RawChapter
 */

/**
 * @typedef {{
 * subject: string
 * title: string
 * toDos: NewToDo[]
 * }} NewChapter
 */

/**
 * @typedef {{
 * title: string
 * description: string
 * start: Date
 * end: Date
 * allDay: boolean
 * backgroundColor: string
 * }} CalendarEvent
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
 * @typedef {{
 * rawConfig: RawConfig
 * rawSubjects: RawSubject[]
 * rawChapters: RawChapter[]
 * chaptersBySubject: Record<string, NewChapter[]>
 * calendarStudyEvents: (CalendarEvent&{allDay:true})[]
 * calendarRoutineEvents: CalendarEvent[]
 * routinesToDo: (RawUserRoutine&DbFields)[]
 * }} AppContext
 */
