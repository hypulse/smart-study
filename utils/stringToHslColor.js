export default function stringToHslColor(string) {
  const hue =
    string.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;

  return `hsl(${hue}, 50%, 50%)`;
}
