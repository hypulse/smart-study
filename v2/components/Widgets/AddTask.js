import { DB_PREFIX } from "../../env.js";
import { useAppContext } from "../../hooks/useAppContext.js";
import usePb from "../../hooks/usePb.js";
import { html, useState } from "../../libs/preact.js";
import requestUpdateRawData from "../../utils/requestUpdateRawData.js";

export default function AddTask() {
  const { pb } = usePb();
  const { rawConfig, rawSubjects } = useAppContext();
  const tasks = rawConfig.tasks;
  const subjects = rawSubjects.map((subject) => subject.title);
  const [task, setTask] = useState(null);
  const [timeType, setTimeType] = useState(null);

  const addTask = async () => {
    const start = dayjs().format("HH:mm");
    const data = {
      title: task,
      start,
      date: dayjs().format("YYYY-MM-DD"),
      done: false,
    };
    if (timeType.indexOf("+") > -1) {
      const [studyTime, breakTime] = timeType.split("+").map(Number);
      data.end = dayjs().add(studyTime, "minute").format("HH:mm");
      await pb.collection(`${DB_PREFIX}_user_routines`).create(data);
      data.title = "휴식";
      data.start = dayjs().add(studyTime, "minute").format("HH:mm");
      data.end = dayjs()
        .add(studyTime + breakTime, "minute")
        .format("HH:mm");
      await pb.collection(`${DB_PREFIX}_user_routines`).create(data);
    } else {
      const minutes = Number(timeType);
      data.end = dayjs().add(minutes, "minute").format("HH:mm");
      await pb.collection(`${DB_PREFIX}_user_routines`).create(data);
    }
    alert("Task Added");
    requestUpdateRawData();
  };

  return html`
    <div className="grid gap-2">
      <div className="join flex-wrap">
        ${[...tasks, ...subjects].map(
          (title) => html`
            <button
              className="btn btn-sm join-item ${task && task === title
                ? "btn-primary"
                : ""}"
              onClick=${() => {
                setTask(title);
              }}
            >
              ${title}
            </button>
          `
        )}
      </div>
      <${TimeTypes} setTimeType=${setTimeType} />
      <button
        className="btn btn-primary"
        onClick=${addTask}
        disabled=${!task || !timeType}
      >
        Add Task
      </button>
    </div>
  `;
}

function TimeTypes({ setTimeType }) {
  const timeTypes = ["40+10", "90+30", "15", "20", "30", "60", "90"];

  return html`
    <div className="grid grid-cols-3 gap-x-4">
      ${timeTypes.map(
        (timeType) => html`
          <div className="form-control" key=${timeType}>
            <label className="label cursor-pointer">
              <span className="label-text">${timeType}분</span>
              <input
                type="radio"
                name="radio-1"
                className="radio"
                value=${timeType}
                onChange=${() => setTimeType(timeType)}
              />
            </label>
          </div>
        `
      )}
    </div>
  `;
}
