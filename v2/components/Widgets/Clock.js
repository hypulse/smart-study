import { html, useEffect, useRef } from "../../libs/preact.js";

export default function Clock() {
  const timerRef = useRef();
  const currentTime = new Date().toLocaleTimeString();

  useEffect(() => {
    const interval = setInterval(() => {
      timerRef.current.innerText = new Date().toLocaleTimeString();
    }, 1000);

    return () => clearInterval(interval);
  });

  return html`<div ref=${timerRef} className="text-4xl">${currentTime}</div>`;
}
