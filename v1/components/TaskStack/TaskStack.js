import { useAppContext } from "../../hooks/useAppContext.js";
import { html } from "../../libs/preact.js";
import TaskStackCard from "./TaskStackCard.js";

export default function TaskStack() {
  const { routineManager } = useAppContext();
  const stackRoutines = routineManager.getStackRoutines();

  return html`
    <div className="grid gap-2">
      ${stackRoutines.map(
        (routine) => html`
          <${TaskStackCard} routine=${routine} key=${routine.id} />
        `
      )}
    </div>
  `;
}
