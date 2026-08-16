export default function getDate(num: number): string {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate() - num).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
