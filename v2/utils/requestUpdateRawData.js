function requestUpdateRawData(list) {
  document.dispatchEvent(new CustomEvent("updateRawData", { detail: list }));
}

export default requestUpdateRawData;
