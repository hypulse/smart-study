import App from "./components/App.js";
import { html, render } from "./libs/preact.js";

function speak(text) {
  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";

    utterance.onend = () => resolve("TTS 처리가 완료되었습니다.");
    utterance.onerror = (event) =>
      reject("TTS 처리 중 오류 발생: " + event.error);

    speechSynthesis.speak(utterance);
  });
}

function speakRecursion() {
  if (window.textsToSpeak.length > 0) {
    window.speaking = true;
    speak(window.textsToSpeak.shift()).then(speakRecursion);
  } else {
    window.speaking = false;
  }
}

setInterval(() => {
  if (
    !window.speaking &&
    window.textsToSpeak &&
    window.textsToSpeak.length > 0
  ) {
    speakRecursion();
  }
}, 1000);

render(html`<${App} />`, document.getElementById("app"));
