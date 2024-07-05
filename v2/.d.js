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
 * done: boolean
 * doneDate: string
 * }} ToDo
 */

/**
 * @typedef {{
 * what: string
 * how: string
 * dayAfter: number
 * done: boolean
 * doneDate: string
 * expectedDoneDate: string
 * }} NewToDo
 */

/**
 * @typedef {ToDo[]} ToDos
 */

/**
 * @typedef {{
 * title: string
 * toDosForm: ToDos
 * }} RawSubject
 */

/**
 * @typedef {{
 * toDosExample: ToDos
 * }} RawConfig
 */

/**
 * @typedef {{
 * subject: string
 * title: string
 * toDos: ToDos
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
 * rawConfig: RawConfig
 * RawSubjects: RawSubject[]
 * updateRawSubjects: function
 * RawChapters: RawChapter[]
 * updateRawChapters: function
 * chaptersBySubject: Record<string, NewChapter[]>
 * }} AppContext
 */
