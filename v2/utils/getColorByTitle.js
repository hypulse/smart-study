const getColorByTitle = (title) => {
  const hue =
    title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;

  return `hsl(${hue}, 50%, 50%)`;
};

export default getColorByTitle;
