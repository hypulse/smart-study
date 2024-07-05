/**
 * @typedef {{
 * what: string
 * how: string
 * dayAfter: number
 * }} WhatHow
 */

/**
 * @typedef {{
 * done: boolean
 * doneDate: string
 * }} DoneData
 */

/**
 * @typedef {{
 * title: string
 * whatHow: WhatHow
 * }} RawSubject
 */

/**
 * @typedef {{
 * whatHowTemplate: WhatHow
 * }} RawConfig
 */

/**
 * @typedef {{
 * subject: string
 * title: string
 * doneData: DoneData
 * }} RawChapter
 */

/**
 * @typedef {{
 * }} AppContext
 */

/**
 * @typedef {Object} DbFields
 * @property {string} id
 * @property {string} collectionId
 * @property {string} collectionName
 * @property {string} created
 * @property {string} updated
 */
