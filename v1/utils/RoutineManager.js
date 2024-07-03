import { getPb } from "./pb-utils.js";
import {
  getConvRoutine,
  getConvRoutineToBase,
  getDirtyRoutine,
} from "./routine-utils.js";

class RoutineManager {
  constructor(routines, setRoutines) {
    this.routines = routines;
    this.setRoutines = setRoutines;
  }

  createNewRoutine = async (routine) => {
    const baseRoutine = getConvRoutineToBase(routine);
    const newRoutine = await getPb()
      .collection("life_routines")
      .create(baseRoutine);
    return newRoutine;
  };

  updateRoutine = async (routine) => {
    const id = routine.id;
    const baseRoutine = getConvRoutineToBase(routine);
    const updatedRoutine = await getPb()
      .collection("life_routines")
      .update(id, baseRoutine);
    return updatedRoutine;
  };

  deleteRoutine = async (routine) => {
    await getPb().collection("life_routines").delete(routine.id);
  };

  setStackRoutine = async (routine) => {
    const stackRoutine = getDirtyRoutine(routine, "stack");
    const newRoutine = await this.createNewRoutine(stackRoutine);
    this.setRoutines((prev) => [...prev, getConvRoutine(newRoutine)]);
  };

  setStackRoutibneForTaskShortcut = async (selectedTask, selectedMinute) => {
    const newRoutine = await this.createNewRoutine({
      title: selectedTask,
      start: dayjs().toDate(),
      end: dayjs().add(selectedMinute, "minute").toDate(),
      isDirty: true,
    });
    this.setRoutines((prev) => [...prev, getConvRoutine(newRoutine)]);
  };

  setStackRoutineUpdateUserStart = async (dirtyRoutine, userStart) => {
    const newRoutine = await this.updateRoutine({ ...dirtyRoutine, userStart });
    this.setRoutines((prev) =>
      prev.map((routine) =>
        routine.id === dirtyRoutine.id ? getConvRoutine(newRoutine) : routine
      )
    );
  };

  setDoneRoutine = async (stackRoutine) => {
    const doneRoutine = getDirtyRoutine(stackRoutine, "done");
    const newRoutine = await this.updateRoutine(doneRoutine);
    const targetRoutine = this.routines.find(
      (routine) => routine.id === stackRoutine.id
    );
    this.setRoutines((prev) =>
      prev.map((routine) =>
        routine.id === targetRoutine.id ? getConvRoutine(newRoutine) : routine
      )
    );
  };

  skipRoutine = async (stackRoutine) => {
    await this.deleteRoutine(stackRoutine);
    this.setRoutines((prev) =>
      prev.filter((routine) => routine.id !== stackRoutine.id)
    );
  };

  getCleanRoutines = () => {
    return this.routines.filter((routine) => !routine.isDirty);
  };

  getDirtyRoutines = () => {
    return this.routines.filter((routine) => routine.isDirty);
  };

  getStackRoutines = () => {
    return this.routines.filter((routine) => routine.taskState === "stack");
  };

  getDoneRoutines = () => {
    return this.routines.filter((routine) => routine.taskState === "done");
  };
}

export default RoutineManager;
