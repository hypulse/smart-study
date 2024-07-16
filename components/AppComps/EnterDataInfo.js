import { html } from "../../libs/preact.js";

export default function EnterDataInfo() {
  function getLocal() {
    const pbUrl = localStorage.getItem("pb_url");
    const configRecordId = localStorage.getItem("config_record_id");
    if (pbUrl && configRecordId) {
      window.location.href = `?pb_url=${pbUrl}&config_record_id=${configRecordId}`;
    }
  }

  function saveLocal() {
    const pbUrl = document.getElementById("pb-url").value;
    const configRecordId = document.getElementById("config-record-id").value;
    localStorage.setItem("pb_url", pbUrl);
    localStorage.setItem("config_record_id", configRecordId);
    window.location.href = `?pb_url=${pbUrl}&config_record_id=${configRecordId}`;
  }

  return html`
    <div className="flex flex-col gap-2">
      <input
        type="text"
        className="input input-bordered"
        placeholder="PB URL"
        id="pb-url"
      />
      <input
        type="text"
        className="input input-bordered"
        placeholder="Config Record ID"
        id="config-record-id"
      />
      <button type="button" className="btn" onClick=${getLocal}>
        불러오기
      </button>
      <button type="button" className="btn btn-primary" onClick=${saveLocal}>
        다음
      </button>
    </div>
  `;
}
