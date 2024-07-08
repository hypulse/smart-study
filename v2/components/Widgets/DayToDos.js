import { useAppContext } from "../../hooks/useAppContext.js";
import { html } from "../../libs/preact.js";

export default function DayToDos() {
  const { dayToDos } = useAppContext();

  return html`
    <div className="flex flex-col">
      ${dayToDos.map(
        ({ title, start, end, description, id }) => html`
          <div key=${id} className="flex justify-between">${title}</div>
        `
      )}
    </div>
  `;
}
