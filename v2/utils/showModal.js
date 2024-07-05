const showModal = (text, title = "Alert") => {
  const modal = document.getElementById("my_modal_1");
  if (text) {
    modal.querySelector("#modal-content").innerText = text;
  } else {
    modal.querySelector("#modal-content").innerText = "";
  }
  if (title) {
    modal.querySelector("#modal-title").innerText = title;
  }
  modal.showModal();
};

export default showModal;
