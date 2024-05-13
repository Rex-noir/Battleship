export default class CreateElements<T extends HTMLElement> {
  private element: T;
  constructor(tag: string, id?: string, className?: string) {
    this.element = document.createElement(tag) as T;
    if (id) this.element.id = id;
    if (className) this.element.classList.add(className);
  }
  getElement(): T {
    return this.element;
  }
}
