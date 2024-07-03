const speakText = (text) => {
  if (!window.textsToSpeak) {
    window.textsToSpeak = [];
  }
  textsToSpeak.push(text);
};

export default speakText;
