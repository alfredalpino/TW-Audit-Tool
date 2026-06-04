'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const proseClasses =
  'prose prose-sm md:prose-base max-w-none leading-[1.75] text-[var(--fg-primary)] prose-headings:text-[var(--fg-primary)] prose-p:text-[var(--fg-primary)] prose-li:text-[var(--fg-primary)] prose-strong:text-[var(--fg-primary)]';

const components = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="mt-8 mb-4 font-display text-2xl font-bold tracking-tight text-[var(--fg-primary)] first:mt-0 md:text-3xl">
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="mt-8 mb-3 font-display text-lg font-semibold text-[var(--fg-primary)] md:text-xl">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="mt-6 mb-2 font-display text-base font-semibold text-[var(--fg-primary)] md:text-lg">
      {children}
    </h3>
  ),
  h4: ({ children }: { children?: React.ReactNode }) => (
    <h4 className="mt-5 mb-2 text-base font-semibold text-[var(--fg-primary)]">{children}</h4>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-4 text-[var(--fg-primary)]">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-4 list-disc space-y-2 pl-6 text-[var(--fg-primary)]">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mb-4 list-decimal space-y-2 pl-6 text-[var(--fg-primary)]">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="leading-[1.75] text-[var(--fg-primary)]">{children}</li>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="my-6 border-l-2 border-[var(--brand)] pl-4 text-[var(--fg-primary)] italic">
      {children}
    </blockquote>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
    const isExternal = href?.startsWith('http');
    return (
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="font-medium text-[var(--brand)] underline-offset-2 transition-colors hover:text-[var(--brand-hover)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] rounded"
      >
        {children}
        {isExternal && <span className="sr-only"> (opens in new tab)</span>}
      </a>
    );
  },
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-[var(--fg-primary)]">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="text-[var(--fg-primary)]">{children}</em>
  ),
  hr: () => <hr className="my-8 border-t border-[var(--border)]" />,
  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre className="my-4 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] p-4 text-sm text-[var(--fg-primary)]">
      {children}
    </pre>
  ),
  code: ({ className, children }: { className?: string; children?: React.ReactNode }) => {
    const isBlock = className?.includes('language-');
    if (isBlock) {
      return <code className={className}>{children}</code>;
    }
    return (
      <code className="rounded bg-[var(--bg-muted)] px-1.5 py-0.5 font-mono text-sm text-[var(--fg-primary)]">
        {children}
      </code>
    );
  },
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-[var(--border)]">
      <table className="min-w-full divide-y divide-[var(--border)]">{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead className="bg-[var(--bg-muted)]">{children}</thead>
  ),
  tbody: ({ children }: { children?: React.ReactNode }) => (
    <tbody className="divide-y divide-[var(--border)] bg-[var(--bg-surface)]">{children}</tbody>
  ),
  tr: ({ children }: { children?: React.ReactNode }) => <tr>{children}</tr>,
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--fg-primary)]">{children}</th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="px-4 py-3 text-sm text-[var(--fg-primary)]">{children}</td>
  ),
};

export function MarkdownProse({ content }: { content: string }) {
  return (
    <div className={`${proseClasses} markdown-policy`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
