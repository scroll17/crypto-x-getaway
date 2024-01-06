export function generateRandomColorExcludingWhite() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  do {
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
  } while (color === '#FFFFFF');
  return color;
}
