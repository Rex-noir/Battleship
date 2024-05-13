export default class Ship {
  private readonly length: number;
  private sunk: boolean;
  private hits: number;

  constructor(length: number) {
    this.length = length;
    this.hits = 0;
    this.sunk = false;
  }
  hit(): void {
    this.hits++;
    if (this.hits >= this.length) {
      this.sunk = true;
    }
  }
  get isSunk(): boolean {
    return this.sunk;
  }
  get Length(): number {
    return this.length;
  }
  get totalHit(): number {
    return this.hits;
  }
}
