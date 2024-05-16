export default function validateInput(input: HTMLInputElement | null): boolean {
  if (input) {
    const data = input.value;
    if (data.length <= 0) {
      return false;
    }
    return true;
  }
  return false;
}
