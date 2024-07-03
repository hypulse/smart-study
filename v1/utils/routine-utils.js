import {
  isToday,
  toTodayDate,
  transformDbUtcStrToLocal,
  transformLocalToDbUtcStr,
} from "./date-utils.js";

/**
 * @param {BaseRoutine} routine
 */
export const getConvRoutine = (routine) => {
  const isEvent = !!routine.isEvent;
  const newRoutine = { ...routine };

  const keys = ["start", "end", "userStart", "userEnd"];
  keys.forEach((key) => {
    if (newRoutine[key]) {
      newRoutine[key] = transformDbUtcStrToLocal(newRoutine[key]);
    }
  });

  if (isEvent) {
    return convEventRoutine(newRoutine);
  }

  return convTaskRoutine(newRoutine);
};

/**
 * @param {ConvBaseRoutine & ConvBaseRoutineEventFields} newRoutine
 * @returns {ConvEventRoutine}
 */
const convEventRoutine = (newRoutine) => {
  return newRoutine;
};

/**
 * @param {ConvBaseRoutine & ConvBaseRoutineTaskFields} newRoutine
 * @returns {ConvTaskRoutine}
 */
const convTaskRoutine = (newRoutine) => {
  if (newRoutine.isDirty) {
    newRoutine.taskState = "stack";
    if (newRoutine.userEnd) {
      newRoutine.taskState = "done";
    }
  } else {
    newRoutine.start = newRoutine.start
      ? toTodayDate(newRoutine.start)
      : newRoutine.start;
    newRoutine.end = newRoutine.end
      ? toTodayDate(newRoutine.end)
      : newRoutine.end;
  }

  return newRoutine;
};

/**
 * @param {Array<BaseRoutine>} routines
 */
export const prepareRoutine = (routines) => {
  const newRoutines = [...routines].map((routine) => getConvRoutine(routine));
  /**
   * @type {Array<ConvEventRoutine>}
   */
  const eventRoutines = newRoutines.filter((routine) => routine.isEvent);
  /**
   * @type {Array<ConvTaskRoutine & DatabaseField>}
   */
  const taskRoutines = newRoutines
    .filter((routine) => !routine.isEvent)
    .filter((routine) => {
      if (routine.isDirty) {
        return isToday(routine.created);
      }
      if (routine.repeatDaysTask.length > 0) {
        return routine.repeatDaysTask.includes(dayjs().get("day").toString());
      }
      return true;
    });

  return {
    eventRoutines,
    taskRoutines,
  };
};

/**
 * @param {ConvTaskRoutine} routine
 * @param {"stack"|"done"} taskState
 * @param {Date|undefined} stackUserStart
 */
export const getDirtyRoutine = (routine, taskState) => {
  const newRoutine = { ...routine };
  newRoutine.isDirty = true;

  if (taskState === "stack") {
    newRoutine.parentId = routine.id;
  } else if (taskState === "done") {
    if (!newRoutine.userStart) {
      newRoutine.userStart = toTodayDate(newRoutine.start);
    }
    newRoutine.userEnd = new Date();
  }

  return newRoutine;
};

/**
 * @param {ConvEventRoutine|ConvTaskRoutine} routine
 */
export const getConvRoutineToBase = (routine) => {
  const newRoutine = { ...routine };

  const keys = ["start", "end", "userStart", "userEnd"];
  keys.forEach((key) => {
    if (newRoutine[key]) {
      newRoutine[key] = transformLocalToDbUtcStr(newRoutine[key]);
    }
  });

  const availableKeys = [
    "title",
    "description",
    "image",
    "start",
    "end",
    "isEvent",
    "parentId",
    "userStart",
    "userEnd",
    "isDirty",
    "repeatTypeEvent",
    "repeatDaysTask",
    "allDay",
  ];
  Object.keys(newRoutine).forEach((key) => {
    if (!availableKeys.includes(key)) {
      delete newRoutine[key];
    }
  });

  return newRoutine;
};
