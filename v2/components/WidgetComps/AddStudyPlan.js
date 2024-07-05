import { DB_PREFIX } from "../../env.js";
import { useAppContext } from "../../hooks/useAppContext.js";
import usePb from "../../hooks/usePb.js";
import { html, useState } from "../../libs/preact.js";

export default function AddStudyPlan() {
  const { pb } = usePb();
  const { subjects, fetchRawStudyData } = useAppContext();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [chapters, setChapters] = useState(null);
  const [tab, setTab] = useState("chapters");
  const [routines, setRoutines] = useState([]);

  async function loadSubjectData() {
    let { items } = await pb.collection(`${DB_PREFIX}_studies`).getList(1, 50, {
      filter: `subject = '${selectedSubject.id}'`,
    });
    items = items.sort((a, b) => a.chapter - b.chapter);
    setChapters(items);
  }

  if (!chapters) {
    return html`
      <div className="grid gap-2">
        <div className="join">
          ${subjects.map(
            (subject) => html`
              <button
                className="btn join-item ${selectedSubject &&
                selectedSubject.id === subject.id
                  ? "btn-primary"
                  : ""}"
                onClick=${() => setSelectedSubject(subject)}
              >
                ${subject.title}
              </button>
            `
          )}
        </div>
        <button
          className="btn btn-primary"
          disabled=${!selectedSubject}
          onClick=${loadSubjectData}
        >
          정보 불러오기
        </button>
      </div>
    `;
  }

  function save() {
    const patchChapters = chapters.filter((chapter) => chapter.id);
    const postChapters = chapters.filter((chapter) => !chapter.id);
    const apiCalls = [];

    patchChapters.forEach((chapter) => {
      const dataLength = Math.max(
        chapter.chapterStudyRoutines.length,
        routines.length
      );

      const newChapterStudyRoutines = [];
      for (let i = 0; i < dataLength; i++) {
        const routine = routines ? routines[i] || [] : {};
        const chapterStudyRoutine = chapter.chapterStudyRoutines
          ? chapter.chapterStudyRoutines[i] || {}
          : {};

        newChapterStudyRoutines.push({
          ...chapterStudyRoutine,
          what: routine.what || chapterStudyRoutine.what,
          how: routine.how || chapterStudyRoutine.how,
          dayAfter: routine.dayAfter || chapterStudyRoutine.dayAfter,
        });
      }

      const data = {
        chapter: chapter.chapter,
        chapterStudyRoutines: JSON.stringify(newChapterStudyRoutines),
      };

      apiCalls.push(pb.collection("smst_studies").update(chapter.id, data));
    });

    postChapters.forEach(async (chapter) => {
      const data = {
        subject: selectedSubject.id,
        chapter: chapter.chapter,
        chapterStudyRoutines: JSON.stringify(
          routines.map((routine) => ({
            what: routine.what,
            how: routine.how,
            dayAfter: routine.dayAfter,
            done: false,
            doneDate: "",
          }))
        ),
      };

      apiCalls.push(pb.collection("smst_studies").create(data));
    });

    Promise.all(apiCalls).then(() => {
      setChapters(null);
      setTab("chapters");
      setRoutines([]);
      alert("저장되었습니다.");
      fetchRawStudyData();
    });
  }

  return html`
    <div className="grid gap-2">
      <div className="flex gap-2">
        <button
          className="btn"
          onClick=${() => {
            setSelectedSubject(null);
            setChapters(null);
            setTab("chapters");
            setRoutines([]);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            className="fill-current"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
            />
          </svg>
          Back
        </button>
        <div className="join">
          <button
            className="btn join-item ${tab === "chapters" ? "btn-primary" : ""}"
            onClick=${() => setTab("chapters")}
          >
            Chapters
          </button>
          <button
            className="btn join-item ${tab === "routines" ? "btn-primary" : ""}"
            onClick=${() => setTab("routines")}
          >
            Routines
          </button>
        </div>
      </div>
      ${tab === "chapters"
        ? html`
            <${ChaptersTab}
              chapters=${chapters}
              setChapters=${setChapters}
              setRoutines=${setRoutines}
            />
          `
        : null}
      ${tab === "routines"
        ? html`
            <${RoutinesTab} routines=${routines} setRoutines=${setRoutines} />
          `
        : null}
      <button className="btn btn-primary" onClick=${save}>저장</button>
    </div>
  `;

  function ChaptersTab({ chapters, setChapters, setRoutines }) {
    function addChapter() {
      setChapters([
        ...chapters,
        {
          cahpter: "",
          chapterStudyRoutines: [],
        },
      ]);
    }

    return html`
      ${chapters.map((chapter, index) => {
        function updateState(key, value) {
          const newChapters = [...chapters];
          newChapters[index] = {
            ...newChapters[index],
            [key]: value,
          };
          setChapters(newChapters);
        }

        return html`
          <span className="flex flex-wrap gap-2 items-center">
            <span>${index + 1}.</span>
            <input
              type="text"
              placeholder="챕터 이름을 입력하세요"
              className="input input-sm input-bordered w-full max-w-xs"
              value=${chapter.chapter}
              onChange=${(e) => updateState("chapter", e.target.value)}
            />
            <button
              className="btn btn-sm btn-outline"
              onClick=${() => setRoutines(chapter.chapterStudyRoutines)}
            >
              선택
            </button>
          </span>
        `;
      })}
      <button className="btn" onClick=${addChapter}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          className="fill-current"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
        추가
      </button>
    `;
  }

  function RoutinesTab({ routines, setRoutines }) {
    const { whatHowTemplate } = useAppContext();

    function addRoutine() {
      setRoutines([
        ...routines,
        {
          what: "",
          how: "",
          dayAfter: 0,
        },
      ]);
    }

    function loadTemplate() {
      setRoutines(whatHowTemplate);
    }

    return html`
      <button className="btn" onClick=${loadTemplate}>템플릿 불러오기</button>
      ${routines.map(({ what, how, dayAfter }, index) => {
        const todayIsAfter = routines.slice(0, index + 1).reduce((acc, cur) => {
          return Number(acc) + Number(cur.dayAfter || 0);
        }, 0);

        function updateState(key, value) {
          const newRoutines = [...routines];
          newRoutines[index] = {
            ...newRoutines[index],
            [key]: value,
          };
          setRoutines(newRoutines);
        }

        return html`
          <div className="grid gap-2">
            <div className="divider">${todayIsAfter}일 후</div>
            <input
              type="text"
              className="input input-sm input-bordered"
              placeholder="무엇을 학습할지 입력하세요"
              value=${what}
              onChange=${(e) => updateState("what", e.target.value)}
            />
            <input
              type="text"
              className="input input-sm input-bordered"
              placeholder="어떻게 학습할지 입력하세요"
              value=${how}
              onChange=${(e) => updateState("how", e.target.value)}
            />
            <input
              type="number"
              className="input input-sm input-bordered"
              placeholder="이전 학습 후 며칠 뒤에 학습할지 입력하세요"
              value=${dayAfter}
              onChange=${(e) => updateState("dayAfter", Number(e.target.value))}
            />
          </div>
        `;
      })}
      <button className="btn" onClick=${addRoutine}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          className="fill-current"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
        추가
      </button>
    `;
  }
}
