'use client';

import { useEffect, useState } from 'react';

/** True only after hydration. Gate anything that would otherwise mismatch on the server. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
