/**
 * src/scripts/fontFamily.js
 */



export function getFontFamily(ff) {
  const start = ff.indexOf('family=');
  if (start === -1) return 'sans-serif';
  let end = ff.indexOf('&', start);
  if(end === -1) end = undefined;
  return ff.slice(start + 7, end).replace("+", " ");
}