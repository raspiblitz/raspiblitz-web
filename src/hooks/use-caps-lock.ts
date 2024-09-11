import { KeyboardEvent, useState } from "react";

const useCapsLock = () => {
  const [isCapsLockEnabled, setIsCapsLockEnabled] = useState(false);

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.getModifierState("CapsLock")) {
      setIsCapsLockEnabled(true);
    }
  };

  const onKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (isCapsLockEnabled) {
      if (!event.getModifierState("CapsLock")) {
        setIsCapsLockEnabled(false);
      }
    }
  };

  return {
    isCapsLockEnabled,
    keyHandlers: {
      onKeyDown,
      onKeyUp,
    },
  };
};

export default useCapsLock;
