import { html } from "../../libs/preact.js";
import { signIn } from "../../utils/pb-utils.js";

export default function EnterCred() {
  async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    await signIn(username, password);
  }

  return html`
    <div className="flex flex-col gap-2">
      <input
        type="text"
        className="input input-bordered"
        placeholder="Username"
        id="username"
      />
      <input
        type="password"
        className="input input-bordered"
        placeholder="Password"
        id="password"
      />
      <button type="button" className="btn btn-primary" onClick=${login}>
        Login
      </button>
    </div>
  `;
}
