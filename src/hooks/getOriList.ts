import http from "@/utils/axios";
import {useRouter} from "next/router";
import * as React from 'react';

function useGetOriList(dispatch: React.Dispatch<object>) {
  const router = useRouter();

  function getOriList() {
    http.get("/orgs").then((res: any[]) => {
      dispatch({organizationList: res})
      if (res.length) {
        if (['/', '/login'].includes(router.asPath)) {
          let oriName = res[0].name;
          router.push(`${decodeURIComponent(oriName)}/applications`)
        }
      }
    })
  }

  return {getOriList};
}

export default useGetOriList;
