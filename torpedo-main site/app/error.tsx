'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';

const isEthereumExtensionError = (message: string) =>
  /redefine property: ethereum|cannot redefine property.*ethereum/i.test(message);

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isExtension = isEthereumExtensionError(error.message);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-sm">
        {isExtension ? (
          <>
            <h1 className="text-lg font-semibold text-[var(--fg-primary)]">
              Browser extension conflict
            </h1>
            <p className="mt-2 text-sm text-[var(--fg-secondary)]">
              A wallet or crypto extension (e.g. EvmAsk, MetaMask) is trying to override{' '}
              <code className="rounded bg-gray-100 px-1 text-xs">window.ethereum</code> and
              conflicting with another extension. This is not a bug in this site.
            </p>
            <p className="mt-3 text-sm text-[var(--fg-secondary)]">
              <strong>Fix:</strong> Disable one of the wallet extensions for this site, or use a
              different browser profile / incognito without the extension. Then refresh.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-lg font-semibold text-[var(--fg-primary)]">Something went wrong</h1>
            <p className="mt-2 text-sm text-[var(--fg-secondary)]">
              An unexpected error occurred. Try refreshing the page.
            </p>
          </>
        )}
        <Button type="button" variant="light-brand" size="sm" onClick={reset} className="mt-4">
          Try again
        </Button>
      </div>
    </div>
  );
}
