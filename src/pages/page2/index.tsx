import Button from '@mui/material/Button';

import Layout from "@/components/Layout";

const page2 = () => {
  return (
    <Layout>
      <div>page two</div>
      <Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
    </Layout>
  )
}

export default page2;
