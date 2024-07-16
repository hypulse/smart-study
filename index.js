import App from "./components/AppComps/App.js";
import { html, render } from "./libs/preact.js";

render(html`<${App} />`, document.getElementById("app"));
