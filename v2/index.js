import App from "./components/App.js";
import { html, render } from "./libs/preact.js";

render(html`<${App} />`, document.getElementById("app"));
