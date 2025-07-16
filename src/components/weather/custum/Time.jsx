import { useState, useEffect } from "react";

export default function Time({ ms = 10000, hour = "00" }) {
  const [minute, setMinute] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const min = now.getMinutes().toString().padStart(2, "0");
      setMinute(min);
    };

    updateTime(); //

    const interval = setInterval(updateTime, ms);

    return () => clearInterval(interval);
  }, [ms]);

  return <>{hour}:{minute}</>;
}
