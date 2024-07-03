import { useAppContext } from "../../hooks/useAppContext.js";
import { html, useMemo } from "../../libs/preact.js";
import StudyReviewDayItem from "./StudyReviewDayItem.js";

export default function StudyReviewItem({ item, updateData, subject }) {
  let { studyWidgetData, setCalendarStudyEvents } = useAppContext();
  const dayFields = ["day0", "day1", "day5", "day10", "day12", "day30"];
  const formatedDate = (date, daysAfter = 0) => {
    if (!date) return null;
    return dayjs(date).add(daysAfter, "day").format("YYYY-MM-DD");
  };

  const formattedStudyWidgetData = useMemo(() => {
    const initialProcessedData = studyWidgetData.map((data, i) => {
      const dayField = dayFields[i];
      return {
        ...data,
        date: item[`${dayField}_date`],
        type: item[`${dayField}_type`],
        done: item[`${dayField}_done`],
        isFirstDayItem: i === 0,
        dayField,
        parent: item,
        key: `${item.id}-${dayField}`,
      };
    });

    const temp = [];
    const processedData = initialProcessedData.map((data, i) => {
      if (i === 0) {
        const item = {
          ...data,
          expectedDate: data.date,
        };
        temp.push(item);
        return item;
      }

      const dataBefore = temp[temp.length - 1];
      const dayGap = data.day - dataBefore.day;
      const expectedDate = dataBefore.done
        ? formatedDate(dataBefore.date, dayGap)
        : formatedDate(dataBefore.expectedDate, dayGap);

      const item = {
        ...data,
        expectedDate: expectedDate,
      };
      temp.push(item);
      return item;
    });

    /**
     * Start of setting up calendar events
     */
    const calendarStudyEvents = processedData
      .filter((data) => data.date || data.expectedDate)
      .map((data) => {
        const title = data.parent.title;
        const type =
          (data.type ? `Day ${data.day} ${data.type}` : null) || data.title;
        return {
          title: `${title.substring(0, 10) + "..."} - ${type}`,
          start: data.date || data.expectedDate,
          backgroundColor: data.done ? "green" : "gray",
          description: `${title} - ${type}`,
          allDay: true,
          key: data.key,
          subject,
        };
      });

    setCalendarStudyEvents((prev) => [
      ...prev.filter((event) => event.subject === subject),
      ...calendarStudyEvents.filter(
        (event) => !prev.find((e) => e.key === event.key)
      ),
    ]);
    /**
     * End of setting up calendar events
     */

    return processedData;
  }, [item]);

  const countDone = formattedStudyWidgetData.filter((data) => data.done).length;
  const displayTitle = `${item.title} (${countDone}/${formattedStudyWidgetData.length})`;
  const hasToday = formattedStudyWidgetData.find(
    (data) => data.expectedDate === dayjs().format("YYYY-MM-DD") && !data.done
  );
  const hasPassed = formattedStudyWidgetData.find(
    (data) =>
      dayjs(data.expectedDate).isBefore(dayjs().format("YYYY-MM-DD")) &&
      !data.done
  );

  return html`
    <div className="collapse bg-base-200">
      <input type="checkbox" />
      <h2 className="text-lg font-bold collapse-title">
        <span className="indicator inline">
          ${hasToday &&
          html`<span
            className="indicator-item indicator-top indicator-start badge badge-info"
            >오늘</span
          >`}
          ${hasPassed &&
          html`<span
            className="indicator-item indicator-top indicator-start badge badge-warning"
          >
            지남
          </span>`}
          ${displayTitle}
        </span>
      </h2>
      <div className="collapse-content">
        ${formattedStudyWidgetData.map((data, i) => {
          return html`<${StudyReviewDayItem}
            data=${data}
            updateData=${updateData}
            key=${i}
          />`;
        })}
      </div>
    </div>
  `;
}
