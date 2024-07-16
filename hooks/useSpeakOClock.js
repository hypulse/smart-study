import { useEffect, useRef } from "../libs/preact.js";
import speak from "../utils/speak.js";

export default function useSpeakOClock() {
  const hourRef = useRef(dayjs().hour());

  useEffect(() => {
    const interval = setInterval(() => {
      const hour = dayjs().hour();
      if (hour !== hourRef.current) {
        hourRef.current = hour;
        speak(`${hour}시 입니다.`);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
}
