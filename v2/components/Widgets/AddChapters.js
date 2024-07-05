import { DB_PREFIX } from "../../env.js";
import { useAppContext } from "../../hooks/useAppContext.js";
import usePb from "../../hooks/usePb.js";
import { html, useState } from "../../libs/preact.js";
import requestUpdateRawData from "../../utils/requestUpdateRawData.js";

export default function AddChapters() {
  const { rawSubjects } = useAppContext();
  const { pb } = usePb();
  const [chapters, setChapters] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  async function selectSubject(subject) {
    let { items } = await pb
      .collection(`${DB_PREFIX}_chapters`)
      .getList(1, 50, {
        filter: `subject = '${subject.id}'`,
      });
    items = items.sort((a, b) => a.chapter - b.chapter);
    setChapters(items);
    setSelectedSubject(subject);
  }

  function addChapter() {
    if (!selectedSubject) return;
    setChapters((prevChapters) => [...prevChapters, { title: "", toDos: [] }]);
  }

  function updateChapterTitle(index, title) {
    const newChapters = [...chapters];
    newChapters[index].title = title;
    setChapters(newChapters);
  }

  async function createChapters() {
    if (!selectedSubject) return;
    const promises = chapters.map((chapter) => {
      if (chapter.id) {
        return pb.collection(`${DB_PREFIX}_chapters`).update(
          chapter.id,
          {
            title: chapter.title,
          },
          {
            requestKey: null,
          }
        );
      } else {
        return pb.collection(`${DB_PREFIX}_chapters`).create(
          {
            title: chapter.title,
            toDos: [],
            subject: selectedSubject.id,
          },
          {
            requestKey: null,
          }
        );
      }
    });
    await Promise.all(promises);
    alert("Chapters Created/Updated");
    requestUpdateRawData();
  }

  return html`
    <div className="grid gap-2">
      <div className="join">
        ${rawSubjects.map(
          (subject) => html`
            <button
              className="btn btn-sm join-item ${selectedSubject &&
              selectedSubject.id === subject.id
                ? "btn-primary"
                : ""}"
              onClick=${() => {
                selectSubject(subject);
              }}
            >
              ${subject.title}
            </button>
          `
        )}
      </div>
      <div className="grid gap-2">
        ${chapters.map(
          (chapter, index) => html`
            <input
              type="text"
              placeholder="Chapter Title"
              className="input input-bordered"
              defaultValue=${chapter.title}
              onChange=${(e) => updateChapterTitle(index, e.target.value)}
            />
          `
        )}
        <button className="btn btn-sm btn-outline" onClick=${addChapter}>
          Add Chapter
        </button>
      </div>
      <button className="btn btn-primary" onClick=${createChapters}>
        Create/Update Chapters
      </button>
    </div>
  `;
}
