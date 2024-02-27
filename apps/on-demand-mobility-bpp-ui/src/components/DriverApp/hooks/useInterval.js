import React from "react";

export const useInterval = (callback, delay) => {
  const cachedCallback = React.useRef();
  React.useEffect(() => {
    cachedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => cachedCallback?.current?.(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
