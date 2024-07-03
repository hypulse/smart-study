import { useEffect, useRef } from "../libs/preact.js";

const useDateChangeEffect = (callbacks) => {
  const timer = useRef(null);
  const lastDate = useRef(dayjs().date());

  useEffect(() => {
    const checkDateChange = () => {
      const currentDate = dayjs().date();
      if (lastDate.current !== currentDate) {
        lastDate.current = currentDate;
        callbacks.forEach((callback) => {
          callback();
        });
      }
    };

    timer.current = setInterval(checkDateChange, 1000);

    return () => clearInterval(timer.current);
  }, [callbacks]);
};

export default useDateChangeEffect;
