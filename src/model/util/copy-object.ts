export function copyObject(object : object) {
  return JSON.parse(JSON.stringify(object));
}