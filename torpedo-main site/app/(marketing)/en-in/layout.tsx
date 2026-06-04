/**
 * Indian version (en-in) uses the same marketing layout from the parent.
 * ContactInfoProvider in ClientLayout reads pathname and sets India contact when path starts with /en-in.
 */
export default function EnInLayout({ children }: { children: React.ReactNode }) {
  return children;
}
