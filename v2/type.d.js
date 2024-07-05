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
 * @typedef {{
 * rawConfig: RawConfig
 * rawSubjects: RawSubject[]
 * rawChapters: RawChapter[]
 * chaptersBySubject: Record<string, NewChapter[]>
 * calendarEvents: CalendarEvent[]
 * }} AppContext
 */
