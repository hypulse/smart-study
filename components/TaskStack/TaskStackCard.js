import { useAppContext } from "../../hooks/useAppContext.js";
import { html, useEffect, useRef } from "../../libs/preact.js";
import { getImageUrl } from "../../utils/pb-utils.js";
import speakText from "../../utils/speakText.js";
import stringToHslColor from "../../utils/stringToHslColor.js";

/**
 * @param {{
 * routine: ConvTaskRoutine
 * }} param0
 */
export default function TaskStackCard({ routine }) {
  const { routineManager } = useAppContext();
  const ref = useRef();
  const countdownElement = useRef();
  const background = stringToHslColor(routine.title);
  const routineMinutes = dayjs(routine.end).diff(
    dayjs(routine.start),
    "minute"
  );
  const routineStartHHMM = dayjs(routine.start).format("HH:mm");
  const routineEndHHMM = dayjs(routine.end).format("HH:mm");
  const uttered = useRef(false);
  const utteredEnd = useRef(false);

  const handleStart = () => {
    const userStart = new Date();
    routineManager.setStackRoutineUpdateUserStart(routine, userStart);
  };

  const handleDone = () => {
    routineManager.setDoneRoutine(routine);
  };

  const handleSkip = () => {
    routineManager.skipRoutine(routine);
  };

  useEffect(() => {
    if (!ref.current || !routine.image) {
      return;
    }

    async function updateBackgroundImage() {
      const imageUrl = await getImageUrl(routine);
      ref.current.style.backgroundImage = `url(${imageUrl})`;
    }

    updateBackgroundImage();
  }, [routine]);

  useEffect(() => {
    if (!countdownElement.current) {
      return;
    }

    const interval = setInterval(() => {
      const diff = dayjs(routine.end).diff(dayjs(), "millisecond");
      if (diff < 0) {
        countdownElement.current.textContent = "0:0:0";
      } else {
        const hours = Math.floor(diff / 1000 / 60 / 60);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        countdownElement.current.textContent = `${hours}:${minutes}:${seconds}`;
        if (!uttered.current && diff < 1000 * 60 * 10) {
          speakText(`${routine.title} 시간이 10분 남았습니다.`);
          uttered.current = true;
        }
        if (!utteredEnd.current && diff < 0) {
          speakText(`${routine.title} 시간이 종료되었습니다.`);
          utteredEnd.current = true;
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [routine]);

  return html`
    <div style="position: relative;" className="card image-full">
      <figure
        style="background-size: cover; background-position: center; background: ${background};"
        ref=${ref}
      ></figure>
      <div className="card-body">
        <h2 className="card-title">
          <span>
            <span>${routine.title}</span>${" "}
            <span>${routineStartHHMM} ~ ${routineEndHHMM}</span>${" "}
            <span>(${routineMinutes}분, <span ref=${countdownElement} />)</span>
          </span>
        </h2>
        <p>${routine.description}</p>
        <div className="card-actions justify-end">
          <button
            className="btn"
            onClick=${handleStart}
            disabled=${!!routine.userStart}
          >
            시작
          </button>
          <button className="btn btn-primary" onClick=${handleDone}>
            완료
          </button>
        </div>
        <button
          style="position: absolute; top: 0; right: 0;"
          className="btn btn-circle btn-ghost"
          onClick=${handleSkip}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M16.5 18V6h2v12zm-11 0V6l9 6z" />
          </svg>
        </button>
      </div>
    </div>
  `;
}
