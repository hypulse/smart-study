import { html, useEffect, useRef } from "../../libs/preact.js";

export default function Clock() {
  const timerRef = useRef();
  const currentTime = new Date().toLocaleTimeString("ko-KR");

  useEffect(() => {
    const interval = setInterval(() => {
      timerRef.current.innerText = new Date().toLocaleTimeString("ko-KR");
    }, 1000);

    return () => clearInterval(interval);
  });

  return html`<div ref=${timerRef} className="text-4xl">${currentTime}</div>`;
}
