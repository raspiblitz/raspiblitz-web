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
    // on HTTPS or localhost, navigator.clipboard works
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    } else {
      // https://stackoverflow.com/a/65996386
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }
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
