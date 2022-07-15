import { useEffect, useState } from "react";

import { getStacks, Stacks } from "@/api/stack";

export default function useStacks():[
  Stacks,
  () => void
] {
  const [stackList, setStackList] = useState<Stacks>([]);

  function getStackList() {
    getStacks().then((res) => {
      setStackList(res);
    });
  }

  useEffect(() => {
    getStackList();
  }, []);

  return [stackList, getStackList];
}
