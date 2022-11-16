import React, { useEffect, useRef } from "react";

/**
 * Provides a stateful wrapper around setInterval
 * @param {Function} intervalFunction
 * @param {number} intervalMs
 */
function useInterval(intervalFunction: Function, intervalMs: number) {
  const savedCallback = useRef<any>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = intervalFunction;
  }, [intervalFunction]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (intervalMs !== null) {
      let id = setInterval(tick, intervalMs);
      return () => clearInterval(id);
    }
  }, [intervalMs]);
}

export default useInterval;
