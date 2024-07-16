function speak(text) {
  if (!window.speakList) {
    window.speakList = [];
  }
  speakList.push(text);
}

export default speak;
