import { DB_PREFIX } from "../../env.js";
import { useAppContext } from "../../hooks/useAppContext.js";
import usePb from "../../hooks/usePb.js";
import { html, useState } from "../../libs/preact.js";

export default function AddChapters() {
  const { rawSubjects } = useAppContext();
  const { pb } = usePb();
  const [chapters, setChapters] = useState([]);

  /**
   * load chapters of a subject
   */
  async function loadChapters(id) {
    let { items } = await pb
      .collection(`${DB_PREFIX}_chapters`)
      .getList(1, 50, {
        filter: `subject = '${id}'`,
      });
    items = items.sort((a, b) => a.chapter - b.chapter);
    setChapters(items);
  }

  function addChapter() {
    setChapters((prevChapters) => [...prevChapters, { title: "", toDos: [] }]);
  }

  function updateChapterTitle(index, title) {
    const newChapters = [...chapters];
    newChapters[index].title = title;
    setChapters(newChapters);
  }

  return html`
    <div className="grid gap-2">
      <div className="join">
        ${rawSubjects.map(
          (subject) => html`
            <button
              className="btn btn-sm join-item"
              onClick=${() => loadChapters(subject.id)}
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
      </div>
      <button className="btn btn-primary">Add Chapters</button>
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
