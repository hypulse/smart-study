import { html, useEffect, useRef } from "../libs/preact.js";

export default function useToast() {
  const ref = useRef();
  const timer = useRef();
  const setToast = (message) => {
    const toastEvent = new CustomEvent("toast", { detail: { message } });
    document.dispatchEvent(toastEvent);
  };

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    window.setToast = setToast;

    const toastHandler = (e) => {
      ref.current.classList.remove("hidden");
      ref.current.querySelector("p").textContent = e.detail.message;
      timer.current && clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        ref.current.classList.add("hidden");
      }, 2000);
    };

    document.addEventListener("toast", toastHandler);

    return () => {
      document.removeEventListener("toast", toastHandler);
    };
  }, []);

  return () => html`
    <div
      className="toast toast-top toast-start hidden"
      style="z-index: 1001;"
      ref=${ref}
    >
      <div className="alert alert-info">
        <p className="text-wrap text-start"></p>
      </div>
    </div>
  `;
}
