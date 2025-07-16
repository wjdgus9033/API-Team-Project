import { useState, useEffect } from "react";

export default function Time({ ms = 10000 }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      const min = now.getMinutes().toString().padStart(2, "0");
      setTime(hour + ":" + min);
    };

    updateTime(); //

    const interval = setInterval(updateTime, ms);

    return () => clearInterval(interval);
  }, [ms]);

  return <>{time}</>;
}
