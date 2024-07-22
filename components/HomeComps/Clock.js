import { html, useEffect, useRef } from "../../libs/preact.js";

export default function Clock() {
  const timerRef = useRef();

  useEffect(() => {
    if (!timerRef.current) return;
    timerRef.current.innerText = new Date().toLocaleTimeString("ko-KR");
    const interval = setInterval(() => {
      timerRef.current.innerText = new Date().toLocaleTimeString("ko-KR");
    }, 1000);

    return () => clearInterval(interval);
  });

  return html`<div ref=${timerRef} className="text-2xl"></div>`;
}
