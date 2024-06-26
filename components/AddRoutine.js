import { useAppContext } from "../hooks/useAppContext.js";
import usePb from "../hooks/usePb.js";
import { html, useState } from "../libs/preact.js";

export default function AddRoutine() {
  const { routineManager } = useAppContext();
  const { authenticated } = usePb();
  const [form, setForm] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
  });
  const [frequency, setFrequency] = useState("everyday");
  const [isEvent, setIsEvent] = useState(false);
  const [allDay, setAllDay] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const { title, description, startTime, endTime } = form;
    const startTimes = startTime.split(",").map(Number);
    const endTimes = endTime.split(",").map(Number);
    const repeatDaysTask =
      frequency === "weekdays"
        ? ["1", "2", "3", "4", "5"]
        : frequency === "weekends"
        ? ["0", "6"]
        : ["0", "1", "2", "3", "4", "5", "6"];

    let start, end;
    if (startTimes.length === 2) {
      const [startTimeHour, startTimeMinute] = startTimes;
      start = dayjs()
        .set("year", dayjs().year())
        .set("month", dayjs().month())
        .set("date", dayjs().date())
        .set("hour", startTimeHour)
        .set("minute", startTimeMinute)
        .set("second", 0)
        .set("millisecond", 0)
        .toDate();
    } else if (startTimes.length === 4) {
      const [startTimeMonth, startTimeDate, startTimeHour, startTimeMinute] =
        startTimes;
      start = dayjs()
        .set("year", dayjs().year())
        .set("month", startTimeMonth - 1)
        .set("date", startTimeDate)
        .set("hour", startTimeHour)
        .set("minute", startTimeMinute)
        .set("second", 0)
        .set("millisecond", 0)
        .toDate();
    }

    if (endTimes.length === 2) {
      const [endTimeHour, endTimeMinute] = endTimes;
      end = dayjs()
        .set("year", dayjs().year())
        .set("month", dayjs().month())
        .set("date", dayjs().date())
        .set("hour", endTimeHour)
        .set("minute", endTimeMinute)
        .set("second", 0)
        .set("millisecond", 0)
        .toDate();
    } else if (startTimes.length === 4) {
      const [endTimeMonth, endTimeDate, endTimeHour, endTimeMinute] = endTimes;
      end = dayjs()
        .set("year", dayjs().year())
        .set("month", endTimeMonth - 1)
        .set("date", endTimeDate)
        .set("hour", endTimeHour)
        .set("minute", endTimeMinute)
        .set("second", 0)
        .set("millisecond", 0)
        .toDate();
    }

    await routineManager.createNewRoutine({
      title,
      description,
      start,
      end,
      repeatDaysTask: isEvent ? [] : repeatDaysTask,
      isEvent,
      allDay,
    });
    alert("추가되었습니다.");
    setForm({
      title: "",
      description: "",
      startTime: "",
      endTime: "",
    });
    setFrequency("everyday");
    setIsEvent(false);
    setAllDay(false);
  };

  const handleFrequencyChange = (e) => {
    setFrequency(e.target.value);
  };

  if (!authenticated) {
    return null;
  }

  return html`
    <div className="grid gap-2">
      <input
        type="text"
        name="title"
        placeholder="title"
        value=${form.title}
        onInput=${handleChange}
      />
      <textarea
        name="description"
        placeholder="description"
        value=${form.description}
        onInput=${handleChange}
      ></textarea>
      <input
        type="text"
        name="startTime"
        placeholder="시작 시간 (13시, 30분 또는 1월, 1일, 13시, 30분)"
        value=${form.startTime}
        onInput=${handleChange}
      />
      <input
        type="text"
        name="endTime"
        placeholder="종료 시간 (13시, 30분 또는 1월, 1일, 13시, 30분)"
        value=${form.endTime}
        onInput=${handleChange}
      />
      <div>
        <label>
          <input
            type="radio"
            name="frequency"
            value="weekdays"
            checked=${frequency === "weekdays"}
            onChange=${handleFrequencyChange}
          />
          평일에만
        </label>
        <label>
          <input
            type="radio"
            name="frequency"
            value="weekends"
            checked=${frequency === "weekends"}
            onChange=${handleFrequencyChange}
          />
          주말에만
        </label>
        <label>
          <input
            type="radio"
            name="frequency"
            value="everyday"
            checked=${frequency === "everyday"}
            onChange=${handleFrequencyChange}
          />
          매일
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="isEvent"
            checked=${isEvent}
            onChange=${() => setIsEvent(!isEvent)}
          />
          Event 여부
        </label>
        <label>
          <input
            type="checkbox"
            name="allDay"
            checked=${allDay}
            onChange=${() => setAllDay(!allDay)}
          />
          하루종일
        </label>
      </div>
      <button className="btn btn-primary" onClick=${handleSubmit}>추가</button>
    </div>
  `;
}
