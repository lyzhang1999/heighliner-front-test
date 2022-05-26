import {useContext, useEffect} from "react";

import Button from '@mui/material/Button';

import Layout from "@/components/Layout";
import {Context} from "@/utils/store";

const page = () => {
  const { a , dispatch } = useContext(Context);

  function dispatchFun(){
    dispatch({a: '333'})
  }

  return (
    <Layout>
      <div>page one</div>
      <Button variant="text" onClick={dispatchFun}>Text {a}</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
    </Layout>
  )
}

export default page;
