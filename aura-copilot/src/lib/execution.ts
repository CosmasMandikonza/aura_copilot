// src/lib/execution.ts

/**
 * Build a best-effort deep link to execute a strategy on the first listed platform,
 * pre-filling the user's address if the platform supports a generic ?address= param.
 */
export function generateExecutionLink(strategy: any, userAddress: string): string | null {
  const platform = strategy?.actions?.[0]?.platforms?.[0];
  if (!platform?.url) return null;

  try {
    const url = new URL(String(platform.url));
    // Common param many dapps accept; harmless if ignored.
    if (userAddress && /^0x[a-fA-F0-9]{40}$/.test(userAddress)) {
      url.searchParams.set('address', userAddress);
    }
    return url.toString();
  } catch {
    return null;
  }
}

