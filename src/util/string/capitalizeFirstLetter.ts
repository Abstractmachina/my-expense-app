export function capitalizeFirstLetter(val: string) {
  if (!val || val.length === 0) return "";
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}