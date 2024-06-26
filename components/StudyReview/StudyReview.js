import { useAppContext } from "../../hooks/useAppContext.js";
import { html, useEffect, useMemo, useState } from "../../libs/preact.js";
import StudyReviewBox from "./StudyReviewBox.js";

export default function StudyReview() {
  const { subjects, subjectsSortOrder } = useAppContext();
  const [activeSubject, setActiveSubject] = useState("");

  const sortedSubjects = useMemo(() => {
    if (!subjects || !subjectsSortOrder) {
      return [];
    }
    return subjects.sort((a, b) => {
      function findSortIndex(subject) {
        for (let i = 0; i < subjectsSortOrder.length; i++) {
          if (subject.startsWith(subjectsSortOrder[i])) {
            return i;
          }
        }
        return -1;
      }

      return findSortIndex(a.title) - findSortIndex(b.title);
    });
  }, [subjects, subjectsSortOrder]);

  useEffect(() => {
    if (sortedSubjects.length > 0 && subjectsSortOrder.length > 0) {
      setActiveSubject(sortedSubjects[0].id);
    }
  }, [subjects, subjectsSortOrder]);

  return html`
    <div className="grid gap-2">
      <div role="tablist" className="tabs tabs-bordered flex flex-wrap">
        ${sortedSubjects.map((subject) => {
          return html`
            <a
              role="tab"
              className="tab h-auto ${activeSubject === subject.id
                ? "tab-active"
                : ""}"
              onClick=${() => setActiveSubject(subject.id)}
              key=${subject.id}
            >
              ${subject.title}
            </a>
          `;
        })}
      </div>
      <${StudyReviewBox} subject=${activeSubject} />
    </div>
  `;
}
