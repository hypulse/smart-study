import { CONFIG_RECORD_ID, DB_PREFIX } from "../../env.js";
import { useAppContext } from "../../hooks/useAppContext.js";
import usePb from "../../hooks/usePb.js";
import { html, useEffect, useRef, useState } from "../../libs/preact.js";
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import requestUpdateRawData from "../../utils/requestUpdateRawData.js";

export default function Note() {
  const { pb } = usePb();
  const { rawConfig } = useAppContext();
  const [editable, setEditable] = useState(false);
  const ref = useRef(null);
  const note = rawConfig.note || "";

  const handleClick = async () => {
    if (editable) {
      await pb.collection(`${DB_PREFIX}_configs`).update(CONFIG_RECORD_ID, {
        note: ref.current.value,
      });
      alert("Note Updated");
      requestUpdateRawData(["updateRawConfig"]);
    }
    setEditable((prev) => !prev);
  };

  useEffect(() => {
    if (!ref.current) return;
    if (editable) {
      ref.current.value = note;
    } else {
      ref.current.innerHTML = marked.parse(note);
    }
  }, [editable, rawConfig]);

  return html`
    <div className="grid gap-2">
      ${editable
        ? html`<textarea ref=${ref} rows="10"></textarea>`
        : html`<div className="prose max-w-none" ref=${ref}></div>`}
      <div className="flex justify-end">
        <button className="btn btn-primary" onClick=${handleClick}>
          ${editable ? "저장" : "수정"}
        </button>
      </div>
    </div>
  `;
}
