// https://stackoverflow.com/a/4819886
export function isTouchable() {
  if (typeof window === 'undefined') {
    return false;
  }

  if ('ontouchstart' in window || 'msMaxTouchPoints' in window.navigator) return true;

  // eslint-disable-next-line
  // @ts-ignore
  if ('DocumentTouch' in window && document instanceof DocumentTouch) return true;

  const prefixes = ['', '-webkit-', '-moz-', '-o-', '-ms-'];
  const queries = prefixes.map(prefix => `(${prefix}touch-enabled)`);

  return window.matchMedia(queries.join(',')).matches;
}
