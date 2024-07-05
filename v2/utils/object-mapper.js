function getChaptersBySubject(
  /**
   * @type {(RawChapter&DbFields)[]}
   */
  rawChapters,
  /**
   * @type {(RawSubject&DbFields)[]}
   */
  rawSubjects
) {
  /**
   * @type {Record<string, RawChapter[]>}
   */
  const chaptersBySubject = {};
  rawChapters = rawChapters.sort((a, b) => a.title.localeCompare(b.title));
  rawChapters = rawChapters.map((chapter) => {
    const { subject, toDos } = chapter;
  });

  // rawChapters.forEach((chapter) => {
  //   console.log(chapter);
  //   const { subject } = chapter;

  //   if (!chaptersBySubject[subject]) {
  //     chaptersBySubject[subject] = [];
  //   }

  //   chaptersBySubject[subject].push(chapterData);
  // });

  // rawChapters.forEach((chapterData) => {
  //   const { subject, chapterStudyRoutines } = chapterData;
  //   const tempDates = [];
  //   const studyRoutinesWithExpected = chapterStudyRoutines.map(
  //     (studyRoutine, index) => {
  //       const { done, doneDate, dayAfter } = studyRoutine;
  //       let expectedDoneDate = null;
  //       if (done) {
  //         tempDates.push(doneDate);
  //       } else {
  //         if (tempDates[index - 1]) {
  //           expectedDoneDate = dayjs(tempDates[index - 1])
  //             .add(dayAfter, "day")
  //             .format("YYYY-MM-DD");
  //         }
  //         tempDates.push(expectedDoneDate);
  //       }
  //       return {
  //         ...studyRoutine,
  //         expectedDoneDate,
  //       };
  //     }
  //   );
  //   if (!newStudyData[subject]) {
  //     newStudyData[subject] = [];
  //   }
  //   newStudyData[subject].push({
  //     ...chapterData,
  //     chapterStudyRoutines: studyRoutinesWithExpected,
  //   });
  // });
  // return newStudyData;
  return {};
}

export { getChaptersBySubject };
