'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { StampEntry, StampVerifyState, StampVerifySuccess } from '@/lib/types/stamp';

export function useStampVerify(stamps: StampEntry[] | undefined) {
  const [verifyState, setVerifyState] = useState<StampVerifyState>({ status: 'idle' });
  const requestIdRef = useRef(0);

  const runVerify = useCallback(async (stampsToVerify: StampEntry[]) => {
    const requestId = ++requestIdRef.current;
    setVerifyState({ status: 'verifying' });

    try {
      const response = await fetch('/api/stamp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stamps: stampsToVerify }),
      });

      if (requestId !== requestIdRef.current) {
        return;
      }

      if (!response.ok) {
        setVerifyState({ status: 'error' });
        return;
      }

      const data = (await response.json()) as StampVerifySuccess;
      if (requestId !== requestIdRef.current) {
        return;
      }

      setVerifyState({
        status: 'ok',
        validSlugs: data.validSlugs,
        isCleared: data.isCleared,
      });
    } catch {
      if (requestId !== requestIdRef.current) {
        return;
      }
      setVerifyState({ status: 'error' });
    }
  }, []);

  useEffect(() => {
    if (!stamps) {
      return;
    }
    void runVerify(stamps);
  }, [stamps, runVerify]);

  const retry = useCallback(() => {
    if (!stamps) {
      return;
    }
    void runVerify(stamps);
  }, [stamps, runVerify]);

  return { verifyState, retry };
}
