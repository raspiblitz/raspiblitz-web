import { useEffect, useState } from "react";

function useClipboard(text: string): [() => void, boolean] {
  const [clipped, setClipped] = useState(false);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(
    null
  );
  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  const copy = () => {
    navigator.clipboard.writeText(text);
    setClipped(true);
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setTimer(setTimeout(() => setClipped(false), 3000));
  };

  return [copy, clipped];
}

export default useClipboard;
