import { CONFIG_RECORD_ID, DB_PREFIX } from "../../env.js";
import { useAppContext } from "../../hooks/useAppContext.js";
import usePb from "../../hooks/usePb.js";
import { html, useState } from "../../libs/preact.js";
import requestUpdateRawData from "../../utils/requestUpdateRawData.js";

export default function StudyCycle() {
  const { pb } = usePb();
  const { rawConfig } = useAppContext();
  const studyCycle = rawConfig.studyCycle.data;
  const studyCycleStart = rawConfig.studyCycle.start;
  const dayFromStart = dayjs().diff(dayjs(studyCycleStart), "day");
  const allDone = studyCycle.every((step) => step.done);
  const [stepDescriptions, setStepDescriptions] = useState(
    studyCycle.map((step) => step.description || "")
  );
  const itemIndex = studyCycle.findIndex((step) => !step.done);

  const handleClick = async () => {
    const lastStep = studyCycle.findIndex((step) => !step.done);
    if (lastStep === -1) {
      return;
    }
    const newStudyCycle = [
      ...studyCycle.slice(0, lastStep),
      { ...studyCycle[lastStep], done: true },
      ...studyCycle.slice(lastStep + 1),
    ];
    console.table(newStudyCycle);
    await pb.collection(`${DB_PREFIX}_configs`).update(CONFIG_RECORD_ID, {
      studyCycle: {
        ...rawConfig.studyCycle,
        data: newStudyCycle,
      },
    });
    alert("다음 단계로 넘어갔습니다.");
    requestUpdateRawData(["updateRawConfig"]);
  };

  const handleReset = async () => {
    await pb.collection(`${DB_PREFIX}_configs`).update(CONFIG_RECORD_ID, {
      studyCycle: {
        ...rawConfig.studyCycle,
        data: rawConfig.studyCycle.data.map((step, index) => ({
          ...step,
          done: false,
          description: stepDescriptions[index],
        })),
        start: dayjs().format("YYYY-MM-DD"),
      },
    });
    alert("다시 시작합니다.");
    requestUpdateRawData(["updateRawConfig"]);
  };

  return html`
    <div className="grid gap-2">
      <p>시작일: ${studyCycleStart} (${dayFromStart}일 경과)</p>
      <ul className="steps">
        ${studyCycle.map(
          (step, i) =>
            html`
              <li
                key=${i}
                className=${`step ${step.done ? "step-success" : ""}`}
              >
                ${step.title}
              </li>
            `
        )}
      </ul>
      ${allDone
        ? html`
            <div className="grid gap-2">
              ${studyCycle.map(
                (step, index) => html`
                  <input
                    type="text"
                    placeholder="${index + 1}. ${step.title}"
                    className="input input-sm input-bordered"
                    value=${stepDescriptions[index]}
                    onChange=${(e) => {
                      const newStepDescriptions = [...stepDescriptions];
                      newStepDescriptions[index] = e.target.value;
                      setStepDescriptions(newStepDescriptions);
                    }}
                  />
                `
              )}
            </div>
          `
        : html`
            <ul>
              ${studyCycle.map(
                (step, index) =>
                  html`<li
                    className="${itemIndex === index
                      ? "text-info font-bold"
                      : ""}"
                  >
                    ${step.title}: ${step.description}
                  </li>`
              )}
            </ul>
          `}
      ${allDone
        ? html`
            <button className="btn btn-primary" onClick=${handleReset}>
              다시 시작하기
            </button>
          `
        : html`
            <button className="btn btn-primary" onClick=${handleClick}>
              다음 단계로
            </button>
          `}
    </div>
  `;
}
