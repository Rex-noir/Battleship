export default class Reference {
  static byId<T>(id: string): T | null {
    return document.getElementById(id) as T;
  }
}
