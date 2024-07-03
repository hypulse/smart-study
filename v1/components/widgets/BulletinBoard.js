import { useAppContext } from "../../hooks/useAppContext.js";
import { html } from "../../libs/preact.js";

export default function BulletinBoard() {
  const { bulletin_board } = useAppContext();

  return html`
    <div
      dangerouslySetInnerHTML=${{ __html: bulletin_board }}
      className="prose"
    />
  `;
}
