function requestUpdateRawData() {
  document.dispatchEvent(new CustomEvent("updateRawData"));
}

export default requestUpdateRawData;
