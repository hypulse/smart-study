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
   * @type {Record<string, NewChapter[]>}
   */
  const chaptersBySubject = {};
  // subject로 구분한 다음에 정렬하지 않고, 사전에 정렬하고 subject로 구분하도록 처리
  rawChapters = rawChapters.sort((a, b) => {
    const indexA = Number(a.title.split(".")[0]);
    const indexB = Number(b.title.split(".")[0]);
    return indexA - indexB;
  });
  rawChapters = rawChapters.filter(({ subject }) =>
    rawSubjects.find(({ id }) => id === subject)
  );
  // subject>toDosForm의 ToDoTypeA[]에 chapter>toDos의 ToDoTypeB[]를 합치는 작업
  // chapter>toDos는 undefined일 수 있으므로, 해당 경우에 대한 처리도 추가
  // toaDos의 길이는 toDosForm의 길이를 따라가야 하므로, toDosForm의 길이를 기준으로 처리
  rawChapters = rawChapters.map((chapter) => {
    const { subject, toDos } = chapter;
    const toDosForm = rawSubjects.find(({ id }) => id === subject).toDosForm;
    const newToDos = toDosForm.map((formToDo, index) => {
      let done = false;
      let doneDate = "";
      if (toDos && toDos[index]) {
        done = toDos[index].done;
        doneDate = toDos[index].doneDate;
      }
      return {
        ...formToDo,
        done,
        doneDate,
      };
    });
    return {
      ...chapter,
      toDos: newToDos,
    };
  });
  // subject id를 key로 해서 chaptersBySubject에 추가
  rawChapters.forEach((chapter) => {
    const { subject } = chapter;

    if (!chaptersBySubject[subject]) {
      chaptersBySubject[subject] = [];
    }

    chaptersBySubject[subject].push(chapter);
  });
  // expectedDoneDate를 추가
  for (const subject in chaptersBySubject) {
    chaptersBySubject[subject] = chaptersBySubject[subject].map((chapter) => {
      const tempDates = [];
      const newToDos = chapter.toDos.map((toDo, index) => {
        let expectedDoneDate = "";
        const { done, doneDate, dayAfter } = toDo;
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
          ...toDo,
          expectedDoneDate,
        };
      });
      return {
        ...chapter,
        toDos: newToDos,
      };
    });
  }

  return chaptersBySubject;
}

export default getChaptersBySubject;
