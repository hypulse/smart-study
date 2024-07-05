import { DB_PREFIX } from "../../env.js";
import { useAppContext } from "../../hooks/useAppContext.js";
import usePb from "../../hooks/usePb.js";
import { html, useState } from "../../libs/preact.js";

export default function AddSubject() {
  const { rawSubjects } = useAppContext();
  const { pb } = usePb();
  const [subjectName, setSubjectName] = useState("");
  const [toDos, setToDos] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  async function selectSubject(subject) {
    setSubjectName(subject.title);
    setToDos(subject.toDosForm);
    setSelectedSubject(subject);
  }

  async function createSubject() {
    if (selectedSubject) {
      await pb.collection(`${DB_PREFIX}_subjects`).update(selectedSubject.id, {
        title: subjectName,
        toDosForm: toDos,
      });
      alert("Subject Updated");
    } else {
      await pb.collection(`${DB_PREFIX}_subjects`).create({
        title: subjectName,
        toDosForm: toDos,
      });
      alert("Subject Created");
    }
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
      <input
        type="text"
        placeholder="Subject Name"
        className="input input-bordered"
        value=${subjectName}
        onChange=${(e) => setSubjectName(e.target.value)}
      />
      <${ToDosBox} toDos=${toDos} setToDos=${setToDos} />
      <button className="btn btn-primary" onClick=${createSubject}>
        Create/Update Subject
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
