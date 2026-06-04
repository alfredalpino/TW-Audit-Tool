/** Pathname when this module first loads — before App Router client navigations. */
const initialPathname = typeof window !== 'undefined' ? window.location.pathname : null;

export function isHomepagePath(path: string): boolean {
  return path === '/';
}

/** True only when the document was loaded directly on `/` (not via client nav to home). */
export function wasHomepageDocumentLoad(): boolean {
  if (initialPathname == null) return false;
  return isHomepagePath(initialPathname);
}
