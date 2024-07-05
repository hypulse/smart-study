function getSubjectIdTitleMap(rawSubjects) {
  return rawSubjects.reduce((acc, subject) => {
    acc[subject.id] = subject.title;
    return acc;
  }, {});
}

export default getSubjectIdTitleMap;
