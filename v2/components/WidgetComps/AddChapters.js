import { DB_PREFIX } from "../../env.js";
import { useAppContext } from "../../hooks/useAppContext.js";
import usePb from "../../hooks/usePb.js";
import { html, useState } from "../../libs/preact.js";

export default function AddChapters() {
  const { rawSubjects } = useAppContext();
  const { pb } = usePb();
  const [chapters, setChapters] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  async function selectSubject(subject) {
    let { items } = await pb
      .collection(`${DB_PREFIX}_chapters`)
      .getList(1, 50, {
        filter: `subject = '${subject.id}'`,
      });
    items = items.sort((a, b) => a.chapter - b.chapter);
    setChapters(items);
    setSelectedSubject(subject);
  }

  function addChapter() {
    if (!selectedSubject) return;
    setChapters((prevChapters) => [...prevChapters, { title: "", toDos: [] }]);
  }

  function updateChapterTitle(index, title) {
    const newChapters = [...chapters];
    newChapters[index].title = title;
    setChapters(newChapters);
  }

  async function createChapters() {
    if (!selectedSubject) return;
    const promises = chapters.map((chapter) => {
      if (chapter.id) {
        return pb.collection(`${DB_PREFIX}_chapters`).update(chapter.id, {
          title: chapter.title,
        });
      } else {
        return pb.collection(`${DB_PREFIX}_chapters`).create({
          title: chapter.title,
          toDos: [],
          subject: selectedSubject.id,
        });
      }
    });
    await Promise.all(promises);
    alert("Chapters Created/Updated");
  }

  return html`
    <div className="grid gap-2">
      <div className="join">
        ${rawSubjects.map(
          (subject) => html`
            <button
              className="btn btn-sm join-item ${selectedSubject &&
              selectedSubject.id === subject.id
                ? "btn-primary"
                : ""}"
              onClick=${() => {
                selectSubject(subject);
              }}
            >
              ${subject.title}
            </button>
          `
        )}
      </div>
      <div className="grid gap-2">
        ${chapters.map(
          (chapter, index) => html`
            <input
              type="text"
              placeholder="Chapter Title"
              className="input input-bordered"
              defaultValue=${chapter.title}
              onChange=${(e) => updateChapterTitle(index, e.target.value)}
            />
          `
        )}
        <button className="btn btn-sm btn-outline" onClick=${addChapter}>
          Add Chapter
        </button>
      </div>
      <button className="btn btn-primary" onClick=${createChapters}>
        Create/Update Chapters
      </button>
    </div>
  `;
}

function ToDosBox({ toDos, setToDos }) {
  const { rawConfig } = useAppContext();
  const { toDosExample } = rawConfig;

  function loadExampleToDos() {
    setToDos(toDosExample);
  }

  function addToDo() {
    setToDos((prevToDos) => [...prevToDos, { what: "", how: "", dayAfter: 0 }]);
  }

  function updateToDo(index, key, value) {
    const newToDos = [...toDos];
    newToDos[index][key] = value;
    setToDos(newToDos);
  }

  return html`
    <div className="grid gap-2">
      ${toDos.map((toDo, index) => {
        const accDayAfter = toDos.slice(0, index + 1).reduce((acc, cur) => {
          return Number(acc) + Number(cur.dayAfter || 0);
        }, 0);

        return html`
          <${ToDoBox}
            key=${index}
            toDo=${toDo}
            accDayAfter=${accDayAfter}
            updateToDo=${updateToDo.bind(null, index)}
          />
        `;
      })}
      <button className="btn btn-sm btn-outline" onClick=${loadExampleToDos}>
        Load Example ToDos
      </button>
      <button className="btn btn-sm btn-outline" onClick=${addToDo}>
        Add ToDo
      </button>
    </div>
  `;
}

function ToDoBox({ toDo, updateToDo, accDayAfter }) {
  return html`
    <div>
      <p>${accDayAfter} days after</p>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="What"
          className="input input-sm input-bordered"
          value=${toDo.what}
          onChange=${(e) => updateToDo("what", e.target.value)}
        />
        <input
          type="text"
          placeholder="How"
          className="input input-sm input-bordered"
          value=${toDo.how}
          onChange=${(e) => updateToDo("how", e.target.value)}
        />
        <input
          type="number"
          placeholder="DayAfter"
          className="input input-sm input-bordered"
          value=${toDo.dayAfter}
          onChange=${(e) => updateToDo("dayAfter", e.target.value)}
        />
      </div>
    </div>
  `;
}
