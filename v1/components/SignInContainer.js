import usePb from "../hooks/usePb.js";
import { html } from "../libs/preact.js";
import { signIn, signOut } from "../utils/pb-utils.js";

export default function SignInContainer() {
  const { authenticated } = usePb();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const identity = form.get("identity");
    const password = form.get("password");

    if (!identity || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await signIn(identity, password);
    } catch (err) {
      alert(err.message);
    }
  };

  if (authenticated) {
    return html`
      <button onClick=${signOut} type="button" className="btn btn-primary">
        로그아웃
      </button>
    `;
  }

  return html`
    <form onSubmit=${handleSubmit} className="grid gap-2">
      <input
        type="text"
        name="identity"
        placeholder="Email or Username"
        className="input input-bordered"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="input input-bordered"
      />
      <button type="submit" className="btn btn-primary">로그인</button>
    </form>
  `;
}
