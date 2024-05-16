export default class CreateElements<T extends HTMLElement> {
  private element: T;
  constructor(tag: string | T, id?: string, classList?: string) {
    if (typeof tag === "string") {
      this.element = document.createElement(tag) as T;
    } else {
      this.element = tag;
    }
    if (id) this.element.id = id;
    if (classList) {
      const classNames = classList.split(" ");
      classNames.forEach((name) => {
        this.element.classList.add(name);
      });
    }
  }
  build(): T {
    return this.element;
  }
  setClass(classList: string): this {
    if (classList) {
      const classNames = classList.split(" ");
      classNames.forEach((name) => {
        this.element.classList.add(name);
      });
    }
    return this;
  }
  removeClass(classList: string): this {
    if (classList) {
      const classNames = classList.split(" ");
      classNames.forEach((name) => {
        this.element.classList.remove(name);
      });
    }
    return this;
  }
  setAttribute(name: string, value: string): this {
    this.element.setAttribute(name, value);
    return this;
  }
}
