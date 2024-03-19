import { KeyboardEvent, useState } from "react";

const useCapsLock = () => {
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.getModifierState("CapsLock")) {
      setIsCapsLockOn(true);
    }
  };

  const onKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (isCapsLockOn) {
      if (!event.getModifierState("CapsLock")) {
        setIsCapsLockOn(false);
      }
    }
  };

  return {
    isCapsLockOn,
    keyHandlers: {
      onKeyDown,
      onKeyUp,
    },
  };
};

export default useCapsLock;
