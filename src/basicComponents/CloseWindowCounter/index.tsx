import { useEffect, useRef, useState } from "react";

interface Props {
  seconds: number;
}

export default function CloseWindowCounter({ seconds }: Props) {
  const [count, setCount] = useState(seconds);
  const refCount = useRef(count);

  useEffect(() => {
    const timeId = setInterval(() => {
      if (refCount.current <= 0) {
        window.close();
      }
      const newCount = refCount.current - 1;
      refCount.current = newCount;
      setCount(newCount);
    }, 1000);
    return () => clearInterval(timeId);
  }, []);

  return <span>{count}</span>;
}
