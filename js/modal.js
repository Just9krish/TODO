export default class Modal {
  constructor() {
    this.intiateModalWrapper();
  }

  intiateModalWrapper() {
    this.createModalWrapper();
    this.modalWrapper.addEventListener("click", () => this.clear());
  }

  createModalWrapper() {
    this.modalWrapper = document.createElement("div");
    this.modalWrapper.classList.add("modal");
    document.body.appendChild(this.modalWrapper);
  }

  createModalElement() {
    this.modalElement = document.createElement("div");
    this.modalElement.classList.add("modal__item");
    this.modalWrapper.appendChild(this.modalElement);

    if (this.modalWrapper.childNodes.length > 2) {
      this.modalWrapper.removeChild(this.modalWrapper.firstChild);
    }
  }

  show(msg, state, icon) {
    this.createModalElement();
    this.modalElement.className = `modal__item modal__item--${state}`;
    this.modalElement.innerHTML = `<i class="modal__item-icon">${icon}</i> ${msg}`;
    this.remove();
  }

  clear() {
    this.modalWrapper.removeChild(this.modalWrapper.firstChild);
  }

  remove() {
    setTimeout(() => this.clear(), 2000);
  }
}
