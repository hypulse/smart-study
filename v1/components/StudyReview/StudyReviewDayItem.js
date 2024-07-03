import { html } from "../../libs/preact.js";
import { getPb } from "../../utils/pb-utils.js";

export default function StudyReviewDayItem({ data, updateData }) {
  const {
    title,
    description,
    date,
    type,
    done,
    isFirstDayItem,
    expectedDate,
    dayField,
    parent,
  } = data;
  const isToday = expectedDate === dayjs().format("YYYY-MM-DD") && !done;
  const passed =
    dayjs(expectedDate).isBefore(dayjs().format("YYYY-MM-DD")) && !done;

  const updateDone = async (e) => {
    if (done) {
      e.target.checked = true;
      return;
    }

    const data = {};
    data[`${dayField}_date`] = dayjs().format("YYYY-MM-DD");
    data[`${dayField}_done`] = true;

    await getPb().collection("life_study").update(parent.id, data);
    alert("업데이트 되었습니다.");

    updateData();
  };

  return html`
    <div>
      <h3 className="text-lg">
        <span className="indicator">
          ${isToday &&
          html`<span
            className="indicator-item indicator-top indicator-start badge badge-info badge-sm"
            >오늘</span
          >`}
          ${passed &&
          html`<span
            className="indicator-item indicator-top indicator-start badge badge-warning badge-sm"
            >지남</span
          >`}
          ${title}
        </span>
      </h3>
      <p className="font-bold text-primary">${type}</p>
      <p className="text-sm text-gray-500">${description}</p>
      <div className="grid grid-cols-3">
        ${isFirstDayItem
          ? html`<div>Start Date: ${done ? date : null}</div>`
          : html`<div>Actual Study Day: ${date}</div>`}
        ${isFirstDayItem && done
          ? html`<div />`
          : html`<div>Expected Study Day: ${expectedDate}</div>`}
        <div className="form-control">
          <label className="cursor-pointer label">
            <span className="label-text">완료</span>
            <input
              type="checkbox"
              className="checkbox checkbox-success"
              checked=${done}
              onChange=${updateDone}
            />
          </label>
        </div>
      </div>
    </div>
  `;
}
