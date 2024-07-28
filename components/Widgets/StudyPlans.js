import { DB_PREFIX, ROUTINE_DATE } from "../../env.js";
import { useAppContext } from "../../hooks/useAppContext.js";
import usePb from "../../hooks/usePb.js";
import { html, useState } from "../../libs/preact.js";
import getSubjectIdTitleMap from "../../utils/obj-mappers/getSubjectIdTitleMap.js";
import requestUpdateRawData from "../../utils/requestUpdateRawData.js";

export default function StudyPlans() {
  const { chaptersBySubject, rawSubjects } = useAppContext();
  const subjects = Object.keys(chaptersBySubject);
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]);
  const chapters = chaptersBySubject[selectedSubjectId] || [];
  const subjectIdTitleMap = getSubjectIdTitleMap(rawSubjects);

  return html`
    <div className="grid gap-2">
      <div className="join flex-wrap">
        ${subjects.map(
          (subject) => html`
            <button
              className="btn btn-sm join-item ${selectedSubjectId === subject
                ? "btn-primary"
                : ""}"
              onClick=${() => {
                setSelectedSubjectId(subject);
              }}
            >
              ${subjectIdTitleMap[subject]}
            </button>
          `
        )}
      </div>
      <div className="grid gap-2">
        ${chapters.map(
          (chapter) =>
            html`<${ChapterBox} chapter=${chapter} key=${chapter.id} />`
        )}
      </div>
    </div>
  `;
}

function ChapterBox(
  /**
   * @type {{
   * chapter: NewChapter&DbFields
   * }}
   */
  { chapter }
) {
  const { toDos, title, id } = chapter;
  const { pb } = usePb();
  const nextDoDate = toDos.find((toDo) => !toDo.done).expectedDoneDate;
  const isToday = nextDoDate && nextDoDate === dayjs().format("YYYY-MM-DD");
  const isLate = nextDoDate && nextDoDate < dayjs().format("YYYY-MM-DD");
  const badgeToDisplay = isToday
    ? html`<${TodyBadge} />`
    : isLate
    ? html`<${LateBadge} />`
    : null;

  const handleDone = (index) => async (done) => {
    const answer = confirm(
      `Are you sure you want to mark this as ${done ? "done" : "undone"}?`
    );
    if (!answer) {
      return;
    }
    const newToDos = [...toDos];
    newToDos[index].done = done;
    newToDos[index].doneDate = dayjs(ROUTINE_DATE).format("YYYY-MM-DD");
    await pb.collection(`${DB_PREFIX}_chapters`).update(id, {
      toDos: newToDos,
    });
    alert(`Marked as ${done ? "done" : "undone"}!`);
    requestUpdateRawData();
  };

  return html`
    <details className="collapse bg-base-200">
      <summary className="text-xl p-2 font-medium">
        <p className="flex items-center gap-2">
          <span>
            ${title}${" "}
            (${toDos.filter((toDo) => toDo.done).length}/${toDos.length})
          </span>
          ${badgeToDisplay}
        </p>
      </summary>
      <div className="collapse-content">
        <div className="grid gap-2">
          ${toDos.map((toDo, index) => {
            const accDayAfter = toDos.slice(0, index + 1).reduce((acc, cur) => {
              return Number(acc) + Number(cur.dayAfter || 0);
            }, 0);

            return html`
              <${ToDoBox}
                toDo=${toDo}
                accDayAfter=${accDayAfter}
                handleDone=${handleDone(index)}
              />
            `;
          })}
        </div>
      </div>
    </details>
  `;
}

function ToDoBox(
  /**
   * @type {{
   * toDo: NewToDo
   * handleDone: function
   * }}
   */
  { toDo, handleDone, accDayAfter }
) {
  const { what, how, done, doneDate, expectedDoneDate } = toDo;
  const dateToDisplay = done ? doneDate : expectedDoneDate;
  const dateDisplay = dateToDisplay
    ? dayjs(dateToDisplay).format("YYYY-MM-DD")
    : "없음";
  const isToday =
    !done &&
    expectedDoneDate &&
    expectedDoneDate === dayjs().format("YYYY-MM-DD");
  const isLate =
    !done &&
    expectedDoneDate &&
    expectedDoneDate < dayjs().format("YYYY-MM-DD");
  const badgeToDisplay = isToday
    ? html`<${TodyBadge} />`
    : isLate
    ? html`<${LateBadge} />`
    : null;

  return html`
    <div>
      <h3 className="text-lg flex items-center gap-2">
        ${badgeToDisplay}
        <span>Day ${accDayAfter}: ${what}</span>
        <input
          type="checkbox"
          className="checkbox checkbox-success"
          defaultChecked=${done}
          checked=${done}
          onClick=${() => {
            handleDone(!done);
          }}
        />
      </h3>
      <p className="text-xs">${how}</p>
      <p>
        <span>${done ? "학습 완료" : "학습 예정"}: </span>
        <span>${dateDisplay}</span>
      </p>
    </div>
  `;
}

function TodyBadge() {
  return html`<div className="badge badge-info">Today</div>`;
}

function LateBadge() {
  return html`<div className="badge badge-warning">Late</div>`;
}
