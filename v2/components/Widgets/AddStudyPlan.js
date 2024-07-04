import { DB_PREFIX } from "../../env.js";
import usePb from "../../hooks/usePb.js";
import usePbData from "../../hooks/usePbData.js";
import { html, useState } from "../../libs/preact.js";

export default function AddStudyPlan() {
  const { pb } = usePb();
  const { data: subjects } = usePbData("subjects");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [chapters, setChapters] = useState(null);

  async function loadSubjectData() {
    let { items } = await pb.collection(`${DB_PREFIX}_studies`).getList(1, 50, {
      filter: `subject = '${selectedSubjectId}'`,
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
                className="btn join-item ${selectedSubjectId === subject.id
                  ? "btn-primary"
                  : ""}"
                onClick=${() => setSelectedSubjectId(subject.id)}
              >
                ${subject.title}
              </button>
            `
          )}
        </div>
        <button
          className="btn"
          disabled=${!selectedSubjectId}
          onClick=${loadSubjectData}
        >
          정보 불러오기
        </button>
      </div>
    `;
  }

  return html``;

  // const { whatHowTemplate } = useAppContext();
  // const [chapterStudyRoutines, setChapterStudyRoutines] = useState([]);
  // function addChapter() {
  //   setChapters([...chapters]);
  // }
  // async function loadSubjectData() {
  //   let { items } = await pb.collection(`${DB_PREFIX}_studies`).getList(1, 50, {
  //     filter: `subject = '${selectedSubjectId}'`,
  //   });
  //   items = items.sort((a, b) => a.chapter - b.chapter);
  //   setChapters(items);
  // }
  // function loadTemplate() {
  //   setChapterStudyRoutines(whatHowTemplate);
  // }
  // function addStudyRoutine() {
  //   setChapterStudyRoutines([
  //     ...chapterStudyRoutines,
  //     { what: "", how: "", done: false, doneDate: "", dayAfter: 0 },
  //   ]);
  // }
  // function save() {
  //   console.table(chapters);
  //   // console.table(chapterStudyRoutines);
  // }
  // if ()
  // return html`
  //   <div className="grid gap-2">
  //     <h3>과목 선택</h3>
  // <div className="join">
  //   ${subjects.map(
  //     (subject) => html`
  //       <button
  //         className="btn join-item ${selectedSubjectId === subject.id
  //           ? "btn-primary"
  //           : ""}"
  //         onClick=${() => setSelectedSubjectId(subject.id)}
  //       >
  //         ${subject.title}
  //       </button>
  //     `
  //   )}
  // </div>
  // <button
  //   className="btn"
  //   disabled=${!selectedSubjectId}
  //   onClick=${loadSubjectData}
  // >
  //   정보 불러오기
  // </button>
  //     <h3>챕터 편집</h3>
  //     ${chapters.map((chapter, index) => {
  //       return html`
  //         <span>
  //           <span>${index + 1}.</span>${" "}
  //           <input
  //             type="text"
  //             placeholder="챕터 이름을 입력하세요"
  //             className="input input-sm input-bordered w-full max-w-xs"
  //             value=${chapter.chapter}
  //           />
  //         </span>
  //       `;
  //     })}
  //     <button className="btn" onClick=${addChapter}>
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         height="24"
  //         viewBox="0 0 24 24"
  //         width="24"
  //         className="fill-current"
  //       >
  //         <path d="M0 0h24v24H0z" fill="none" />
  //         <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  //       </svg>
  //       추가
  //     </button>
  //     <h3>공부 계획 편집</h3>
  //     <button className="btn" onClick=${loadTemplate}>템플릿 불러오기</button>
  //     ${chapterStudyRoutines.map(
  //       ({ what, how, done, doneDate, dayAfter }, index) => {
  //         const updateState = (key, value) => {
  //           const newChapterStudyRoutines = [...chapterStudyRoutines];
  //           newChapterStudyRoutines[index] = {
  //             ...newChapterStudyRoutines[index],
  //             [key]: value,
  //           };
  //           setChapterStudyRoutines(newChapterStudyRoutines);
  //         };
  //         const todayIsAfter = chapterStudyRoutines
  //           .slice(0, index + 1)
  //           .reduce((acc, cur) => {
  //             return acc + cur.dayAfter;
  //           }, 0);
  //         return html`
  //           <div className="grid gap-2">
  //             <div className="divider">${todayIsAfter}일 후</div>
  //             <input
  //               type="text"
  //               className="input input-sm input-bordered"
  //               placeholder="무엇을 학습할지 입력하세요"
  //               value=${what}
  //               onInput=${(e) => updateState("what", e.target.value)}
  //             />
  //             <input
  //               type="text"
  //               className="input input-sm input-bordered"
  //               placeholder="어떻게 학습할지 입력하세요"
  //               value=${how}
  //               onInput=${(e) => updateState("how", e.target.value)}
  //             />
  //             <div className="form-control">
  //               <label className="cursor-pointer label">
  //                 <span className="label-text">완료 여부</span>
  //                 <input
  //                   type="checkbox"
  //                   className="checkbox checkbox-success"
  //                   checked=${done}
  //                   onChange=${(e) => updateState("done", e.target.checked)}
  //                 />
  //               </label>
  //             </div>
  //             <input
  //               type="text"
  //               className="input input-sm input-bordered"
  //               placeholder="완료일 (YYYY-MM-DD)"
  //               value=${doneDate}
  //               onInput=${(e) => updateState("doneDate", e.target.value)}
  //             />
  //             <input
  //               type="number"
  //               className="input input-sm input-bordered"
  //               placeholder="이전 학습 후 며칠 뒤에 학습할지 입력하세요"
  //               value=${dayAfter}
  //               onInput=${(e) =>
  //                 updateState("dayAfter", Number(e.target.value))}
  //             />
  //           </div>
  //         `;
  //       }
  //     )}
  //     <button className="btn" onClick=${addStudyRoutine}>
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         height="24"
  //         viewBox="0 0 24 24"
  //         width="24"
  //         className="fill-current"
  //       >
  //         <path d="M0 0h24v24H0z" fill="none" />
  //         <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  //       </svg>
  //       추가
  //     </button>
  //     <button className="btn btn-primary" onClick=${save}>저장</button>
  //   </div>
  // `;
}
