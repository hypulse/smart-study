/**
 * @returns {Record<string, RawStudy[]>}
 * rawStudyData를 가공한 데이터
 * subject를 key로 하고 chapterStudyRoutines의 각 항목에 expectedDoneDate를 추가한 데이터
 */
function getNewStudyData(
  /**
   * @type {RawStudy[]}
   */
  rawStudyData
) {
  const newStudyData = {};

  rawStudyData.forEach((chapterData) => {
    const { subject, chapterStudyRoutines } = chapterData;
    const tempDates = [];
    const studyRoutinesWithExpected = chapterStudyRoutines.map(
      (studyRoutine, index) => {
        const { done, doneDate, dayAfter } = studyRoutine;
        let expectedDoneDate = null;

        if (done) {
          tempDates.push(doneDate);
        } else {
          if (tempDates[index - 1]) {
            expectedDoneDate = dayjs(tempDates[index - 1])
              .add(dayAfter, "day")
              .format("YYYY-MM-DD");
          }
          tempDates.push(expectedDoneDate);
        }

        return {
          ...routine,
          expectedDoneDate,
        };
      }
    );

    if (!newStudyData[subject]) {
      newStudyData[subject] = [];
    }

    newStudyData[subject].push({
      ...chapterData,
      chapterStudyRoutines: studyRoutinesWithExpected,
    });
  });

  return newStudyData;
}

export { getNewStudyData };
