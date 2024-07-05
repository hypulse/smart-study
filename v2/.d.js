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
 * rawConfig: RawConfig
 * RawSubjects: RawSubject[]
 * updateRawSubjects: function
 * RawChapters: RawChapter[]
 * updateRawChapters: function
 * }} AppContext
 */
