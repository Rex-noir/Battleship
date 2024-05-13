export default class CreateElements<T extends HTMLElement> {
  private element: T;
  constructor(tag: string, id?: string, classList?: string) {
    this.element = document.createElement(tag) as T;
    if (id) this.element.id = id;
    if (classList) {
      const classNames = classList.split(" ");
      classNames.forEach((name) => {
        this.element.classList.add(name);
      });
    }
  }
  getElement(): T {
    return this.element;
  }
  setAttribute(name: string, value: string): void {
    this.element.setAttribute(name, value);
  }
}
