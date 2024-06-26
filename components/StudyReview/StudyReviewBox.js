import usePb from "../../hooks/usePb.js";
import { html, useEffect, useState } from "../../libs/preact.js";
import StudyReviewItem from "./StudyReviewItem.js";

export default function StudyReviewBox({ subject }) {
  const { pb, authenticated } = usePb();
  const [data, setData] = useState([]);

  async function updateData() {
    const { items } = await pb.collection("life_study").getList(1, 50, {
      filter: `subject = '${subject}'`,
    });
    items.sort((a, b) => {
      const aIndex = Number(a.title.split(".")[0]);
      const bIndex = Number(b.title.split(".")[0]);
      return aIndex - bIndex;
    });
    setData(items);
  }

  useEffect(() => {
    if (!subject || !authenticated) {
      return;
    }

    updateData();
  }, [subject]);

  return html`
    <div className="grid gap-2">
      ${data.map((item) => {
        return html`
          <${StudyReviewItem}
            item=${item}
            subject=${subject}
            updateData=${updateData}
            key=${item.id}
          />
        `;
      })}
    </div>
  `;
}
