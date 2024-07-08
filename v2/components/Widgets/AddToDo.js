import { useAppContext } from "../../hooks/useAppContext.js";
import { html, useState } from "../../libs/preact.js";

export default function AddToDo() {
  const { rawConfig, rawSubjects } = useAppContext();
  const [toDoValue, setToDoValue] = useState("");
  const [timeValue, setTimeValue] = useState("40+10");
  const dayToDos = rawConfig.dayToDos;

  return html`
    <div className="grid grid-cols-1 gap-y-4">
      <${ToDoTimes} setTimeValue=${setTimeValue} />
    </div>
  `;
}

function ToDoTimes({ setTimeValue }) {
  const minutes = [15, 20, 30, 60];

  const handleInputChange = (e) => {
    setTimeValue(e.target.value);
  };

  return html`
    <div className="grid grid-cols-3 gap-x-4">
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">40분 학습 + 10분 휴식</span>
          <input
            type="radio"
            name="radio-1"
            className="radio"
            value="40+10"
            onChange=${handleInputChange}
            defaultChecked
          />
        </label>
      </div>
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">90분 학습 + 30분 휴식</span>
          <input
            type="radio"
            name="radio-1"
            className="radio"
            value="90+30"
            onChange=${handleInputChange}
          />
        </label>
      </div>
      ${minutes.map(
        (minute) => html`
          <div className="form-control" key=${minute}>
            <label className="label cursor-pointer">
              <span className="label-text">${minute}분</span>
              <input
                type="radio"
                name="radio-1"
                className="radio"
                value=${minute}
                onChange=${handleInputChange}
              />
            </label>
          </div>
        `
      )}
    </div>
  `;
}
