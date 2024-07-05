import { DB_PREFIX } from "../../env.js";
import { useAppContext } from "../../hooks/useAppContext.js";
import usePb from "../../hooks/usePb.js";
import { html, useState } from "../../libs/preact.js";
import getSubjectIdTitleMap from "../../utils/obj-mappers/getSubjectIdTitleMap.js";
import requestUpdateRawData from "../../utils/requestUpdateRawData.js";

export default function SubjectsPlan() {
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const { chaptersBySubject, rawSubjects } = useAppContext();
  const subjectIdTitleMap = getSubjectIdTitleMap(rawSubjects);
  const subjects = Object.keys(chaptersBySubject);
  const chapters = chaptersBySubject[selectedSubjectId] || [];

  return html`
    <div className="grid gap-2">
      <div className="join">
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
        ${chapters.map((chapter) => html`<${ChapterBox} chapter=${chapter} />`)}
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

  async function handleDone(index) {
    const newToDos = [...toDos];
    newToDos[index].done = true;
    newToDos[index].doneDate = dayjs().format("YYYY-MM-DD");
    await pb.collection(`${DB_PREFIX}_chapters`).update(id, {
      toDos: newToDos,
    });
    alert("Done");
    requestUpdateRawData();
  }

  return html`
    <details className="collapse bg-base-200">
      <summary className="collapse-title text-xl font-medium">${title}</summary>
      <div className="collapse-content">
        <div className="grid gap-2">
          ${toDos.map(
            (toDo, index) => html`
              <${ToDoBox}
                toDo=${toDo}
                handleDone=${handleDone.bind(null, index)}
              />
            `
          )}
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
  { toDo, handleDone }
) {
  const { what, how, done, doneDate, expectedDoneDate } = toDo;
  const dateToDisplay = done ? doneDate : expectedDoneDate;
  const dateDisplay = dateToDisplay
    ? dayjs(dateToDisplay).format("YYYY-MM-DD")
    : "없음";

  return html`
    <div>
      <h3 className="text-lg flex justify-between items-center">
        ${what}
        ${done
          ? html`
              <input
                type="checkbox"
                className="checkbox checkbox-success"
                defaultChecked
                onClick=${(e) => {
                  e.preventDefault();
                }}
              />
            `
          : html`
              <input
                type="checkbox"
                className="checkbox checkbox-success"
                onClick=${handleDone}
              />
            `}
      </h3>
      <p className="text-sm">${how}</p>
      <p>
        <span>${done ? "학습 완료" : "학습 예정"}: </span>
        <span>${dateDisplay}</span>
      </p>
    </div>
  `;
}
