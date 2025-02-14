import { useEffect, useRef } from "react";

/**
 * Calls function repeatedly until unmounted.
 * For reference see {@link https://overreacted.io/making-setinterval-declarative-with-react-hooks/}
 * @param callback the function you want to call repeatedly
 * @param delay delay in milliseconds
 */
export const useInterval = (callback: () => unknown, delay: number) => {
  const savedCallback = useRef<() => unknown>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      savedCallback.current?.();
    };
    const id = setInterval(tick, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]);
};
