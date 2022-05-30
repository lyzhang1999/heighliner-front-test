import type {NextPage} from "next";

import styles from "@/styles/Home.module.css";
import {useEffect} from "react";
import {useRouter} from 'next/router';


const Login: NextPage = () => {
  const router = useRouter()
  useEffect(() => {
    router.push('/login');
  }, [])
  return (
    <div className={styles.container}>

    </div>
  );
};

export default Login;
