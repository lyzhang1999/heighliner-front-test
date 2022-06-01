import Button from '@mui/material/Button';

import Layout from "@/components/Layout";
import { NoticeRef } from "@/components/Notice/index";


const page = () => {
  function click(){
    NoticeRef.current?.open({
      message: "test",
      type: "error",
    });
  }
  return (
    <Layout>
      <div onClick={click}>page one</div>
      <Button variant="text"></Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
    </Layout>
  )
}

export default page;
