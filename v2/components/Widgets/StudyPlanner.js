import { useAppContext } from "../../hooks/useAppContext.js";
import usePb from "../../hooks/usePb.js";
import { html, useState } from "../../libs/preact.js";

export default function StudyPlanner() {
  const { newStudyData, subjects } = useAppContext();
  const subjectIds = Object.keys(newStudyData);
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjectIds[0]);
  const subjectChapters = newStudyData[selectedSubjectId];

  return html`
    <div className="grid gap-4">
      <div className="join">
        ${subjectIds.map((subjectId) => {
          const subject = subjects.find(({ id }) => id === subjectId);

          return html`
            <button
              className="btn join-item ${selectedSubjectId === subjectId
                ? "btn-primary"
                : ""}"
              onClick=${() => setSelectedSubjectId(subjectId)}
            >
              ${subject.title}
            </button>
          `;
        })}
      </div>
      <${SubjectBox} subjectChapters=${subjectChapters} />
    </div>
  `;
}

function SubjectBox({ subjectChapters }) {
  if (!subjectChapters) {
    return html`<div>No data</div>`;
  }

  return html`
    <div className="grid gap-2">
      ${subjectChapters.map((chapterData) => {
        return html`<${ChapterBox} chapterData=${chapterData} />`;
      })}
    </div>
  `;
}

function ChapterBox({ chapterData }) {
  const { pb } = usePb();
  const { fetchRawStudyData } = useAppContext();
  const { chapter, chapterStudyRoutines } = chapterData;
  const doneCount = chapterStudyRoutines.filter(
    (routine) => routine.done
  ).length;
  const todayDate = dayjs().format("YYYY-MM-DD");
  const isToday = chapterStudyRoutines.some(
    (routine) => routine.expectedDoneDate === todayDate
  );
  const isOverdue = chapterStudyRoutines.some(
    (routine) => routine.expectedDoneDate < todayDate
  );

  return html`
    <details className="collapse bg-base-200">
      <summary className="collapse-title text-xl font-medium">
        ${isToday && html`<span className="badge badge-info">Today</span>`}
        ${isOverdue && html`<span className="badge badge-warning">Late</span>`}
        ${" "}${chapter} (${doneCount}/${chapterStudyRoutines.length})
      </summary>
      <div className="collapse-content">
        <div className="grid gap-2">
          ${chapterStudyRoutines.map((studyRoutine, index) => {
            async function checkDone() {
              const newStudyRoutine = chapterStudyRoutines[index];
              newStudyRoutine.done = true;
              newStudyRoutine.doneDate = dayjs().format("YYYY-MM-DD");
              const newChapterStudyRoutines = [
                ...chapterStudyRoutines.slice(0, index),
                newStudyRoutine,
                ...chapterStudyRoutines.slice(index + 1),
              ];
              const data = {
                chapterStudyRoutines: newChapterStudyRoutines,
              };
              const record = await pb
                .collection("smst_studies")
                .update(chapterData.id, data);
              alert("저장되었습니다.");
              fetchRawStudyData();
            }

            return html`
              <${ChapterRoutine}
                studyRoutine=${studyRoutine}
                checkDone=${checkDone}
              />
            `;
          })}
        </div>
      </div>
    </details>
  `;
}

function ChapterRoutine({ studyRoutine, checkDone }) {
  const { what, how, done, doneDate, expectedDoneDate } = studyRoutine;

  if (done) {
    return html`
      <div>
        <div className="form-control">
          <label className="cursor-pointer label">
            <span className="text-xl">${what}</span>
            <input
              defaultChecked
              type="checkbox"
              className="checkbox checkbox-success"
              onClick=${(e) => {
                e.preventDefault();
              }}
            />
          </label>
        </div>
        <p>${how}</p>
        <p>학습일: ${doneDate}</p>
      </div>
    `;
  }

  const todayDate = dayjs().format("YYYY-MM-DD");
  const isToday = todayDate === expectedDoneDate;
  const isOverdue = todayDate > expectedDoneDate;

  return html`
    <div>
      <div className="form-control">
        <label className="cursor-pointer label">
          <span className="text-xl">${what}</span>
          <input
            type="checkbox"
            className="checkbox checkbox-success"
            onClick=${checkDone}
          />
        </label>
      </div>
      <p>${how}</p>
      <p>
        ${isToday && html`<span className="badge badge-info">Today</span>`}
        ${isOverdue && html`<span className="badge badge-warning">Late</span>`}
        ${" "}학습 예정일: ${expectedDoneDate}
      </p>
    </div>
  `;
}
