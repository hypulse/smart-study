import { useAppContext } from "../../hooks/useAppContext.js";
import { html, useState } from "../../libs/preact.js";

export default function TaskShortcut() {
  const { tasks, subjects, minutes, routineManager } = useAppContext();
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedMinute, setSelectedMinute] = useState(null);
  const tasksAndSubjects = [...tasks, ...subjects.map((s) => s.title)];

  const handleTaskChange = (event) => {
    setSelectedTask(event.target.value);
  };

  const handleMinuteChange = (event) => {
    setSelectedMinute(event.target.value);
  };

  const handleAddTask = async () => {
    await routineManager.setStackRoutibneForTaskShortcut(
      selectedTask,
      selectedMinute
    );
    alert("할 일이 성공적으로 추가되었습니다.");
    setSelectedTask(null);
    setSelectedMinute(null);
  };

  return html`
    <div className="grid gap-2">
      <div className="join flex-wrap">
        ${tasksAndSubjects.map((task) => {
          return html`
            <input
              className="join-item btn"
              type="radio"
              name="task"
              value=${task}
              aria-label=${task}
              onChange=${handleTaskChange}
            />
          `;
        })}
      </div>
      <div className="join flex-wrap">
        ${minutes.map((minute) => {
          return html`
            <input
              className="join-item btn"
              type="radio"
              name="minute"
              value=${minute}
              aria-label=${`${minute}분`}
              onChange=${handleMinuteChange}
            />
          `;
        })}
      </div>
      <button
        className="btn btn-primary"
        disabled=${!selectedTask || !selectedMinute}
        onClick=${handleAddTask}
      >
        할 일 추가
      </button>
    </div>
  `;
}
