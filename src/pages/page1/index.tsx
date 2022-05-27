import Button from '@mui/material/Button';

import Layout from "@/components/Layout";

const page = () => {
  return (
    <Layout>
      <div>page one</div>
      <Button variant="text"></Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
    </Layout>
  )
}

export default page;
