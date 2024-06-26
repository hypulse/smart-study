import { useEffect, useRef } from "../libs/preact.js";

const useMinuteChangeEffect = (callbacks) => {
  const timer = useRef(null);
  const lastMinute = useRef(dayjs().minute());

  useEffect(() => {
    const checkMinuteChange = () => {
      const currentMinute = dayjs().minute();
      if (lastMinute.current !== currentMinute) {
        lastMinute.current = currentMinute;
        callbacks.forEach((callback) => {
          callback();
        });
      }
    };

    timer.current = setInterval(checkMinuteChange, 1000);

    return () => clearInterval(timer.current);
  }, [callbacks]);
};

export default useMinuteChangeEffect;
