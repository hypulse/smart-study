import { useAppContext } from "../../hooks/useAppContext.js";
import { html, useState } from "../../libs/preact.js";

export default function StudyPlanner() {
  const { studyData } = useAppContext();
  const subjects = Object.keys(studyData);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const subjectChapters = studyData[selectedSubject];

  return html`
    <div className="grid gap-4">
      <div className="join">
        ${subjects.map(
          (subject) => html`
            <button
              className="btn join-item"
              onClick=${() => setSelectedSubject(subject)}
            >
              ${subject}
            </button>
          `
        )}
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
  const { chapter, studyRoutines: chapterStudyRoutines } = chapterData;
  const doneCount = chapterStudyRoutines.filter(
    (routine) => routine.done
  ).length;

  return html`
    <details className="collapse bg-base-200">
      <summary className="collapse-title text-xl font-medium">
        ${chapter} (${doneCount}/${chapterStudyRoutines.length})
      </summary>
      <div className="collapse-content">
        <div className="grid gap-2">
          ${chapterStudyRoutines.map((chapterRoutine) => {
            return html`
              <${ChapterRoutine} chapterRoutine=${chapterRoutine} />
            `;
          })}
        </div>
      </div>
    </details>
  `;
}

function ChapterRoutine({ chapterRoutine }) {
  const { what, how, done, doneDate, expectedDoneDate } = chapterRoutine;

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
          <input type="checkbox" className="checkbox checkbox-success" />
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
