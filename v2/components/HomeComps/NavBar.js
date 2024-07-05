import { html } from "../../libs/preact.js";

export default function NavBar({ menuOpen, setMenuOpen }) {
  function toggleMenu() {
    setMenuOpen((prev) => !prev);
  }

  return html`
    <div>
      <a className="text-4xl link link-hover" onClick=${toggleMenu}>
        ${menuOpen ? "Menu" : "Home"}
      </a>
    </div>
  `;
}
