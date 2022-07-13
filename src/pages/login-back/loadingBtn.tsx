import {useEffect, useState} from "react";

let arr = ['.', '..', '...']

export default function LoadingPoint() {
  const [number, setNumber] = useState<number>(0);

  useEffect(() => {
    let timer = setInterval(() => {
      setNumber((value) => (value + 1))
    }, 300)
    return () => {
      clearInterval(timer)
    }
  }, [])

  return <span>{arr[number % 3]}</span>
}
