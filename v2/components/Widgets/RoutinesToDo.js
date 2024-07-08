import { DB_PREFIX } from "../../env.js";
import { useAppContext } from "../../hooks/useAppContext.js";
import usePb from "../../hooks/usePb.js";
import { html, useEffect, useRef } from "../../libs/preact.js";
import requestUpdateRawData from "../../utils/requestUpdateRawData.js";

export default function RoutinesToDo() {
  const { routinesToDo } = useAppContext();

  return html`
    <div className="grid grid-cols-2 gap-2">
      ${routinesToDo.map(
        (routine) => html`<${RoutinesToDoCard} routine=${routine} />`
      )}
    </div>
  `;
}

function RoutinesToDoCard(
  /**
   * @type {{
   * routine: RawUserRoutine&DbFields
   * }}
   */
  { routine }
) {
  const { pb } = usePb();
  const ref = useRef();
  const { title, start, end } = routine;
  const startDisplay = dayjs()
    .set("hour", start.split(":")[0])
    .set("minute", start.split(":")[1])
    .set("second", 0)
    .format("A hh시 mm분");
  const endDisplay = dayjs()
    .set("hour", end.split(":")[0])
    .set("minute", end.split(":")[1])
    .set("second", 0)
    .format("A hh시 mm분");

  async function handleComplete() {
    if (routine.start >= dayjs().format("HH:mm")) {
      return;
    }
    await pb.collection(`${DB_PREFIX}_user_routines`).update(routine.id, {
      end: dayjs().format("HH:mm"),
      done: true,
    });
    requestUpdateRawData();
  }

  async function handleDelete() {
    await pb.collection(`${DB_PREFIX}_user_routines`).delete(routine.id);
    requestUpdateRawData();
  }

  useEffect(() => {
    if (!ref.current) return;
    const interval = setInterval(() => {
      const diff = dayjs()
        .set("hour", end.split(":")[0])
        .set("minute", end.split(":")[1])
        .set("second", 0)
        .diff(dayjs(), "millisecond");
      ref.current.innerText = dayjs(diff).format("mm분 ss초 남음");
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return html`
    <div className="grid gap-2 bg-neutral text-neutral-content relative p-4">
      <button className="absolute top-0 right-0" onClick=${handleDelete}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          className="fill-current"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
          />
        </svg>
      </button>
      <h2 className="text-lg">${title} (<span ref=${ref}></span>)</h2>
      <p>${startDisplay} - ${endDisplay}</p>
      <div className="card-actions justify-end">
        <button className="btn btn-primary" onClick=${handleComplete}>
          완료
        </button>
      </div>
    </div>
  `;
}
