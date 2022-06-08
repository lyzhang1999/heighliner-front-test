import * as React from 'react';


import styles from "./index.module.scss";
import Layout from "@/components/Layout";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{p: 3}}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const applicationList = [
  {
    name: "FrontEnd Application",
    tag: "frontend",
    logo: "/img/applicationDetail/js.webp",
    repo: ['https://github.com/'],
    url: "https://test.com"
  },
  {
    name: "BackEnd Application",
    tag: "backend",
    logo: "/img/applicationDetail/go.webp",
    repo: ['https://github.com/'],
    url: "https://test.com"
  }
]


const pannalsList = [
  {
    name: "Grafana",
    tag: "grafana",
    logo: "/img/applicationDetail/grafana.webp",
    repo: ['user: admin', "password: fdsajfdsakj"],
    url: "https://test.com"
  },
  {
    name: "Argo CD",
    tag: "argo cd",
    logo: "/img/applicationDetail/argo.webp",
    repo: ['user: admin', "password: fdsajfdsakj"],
    url: "https://test.com"
  }
]


const ApplicationDetail = () => {

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Layout pageHeader="Application Detail">

      <div className={styles.pageWrapper}>

        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Item One"/>
            <Tab label="Item Two"/>
            <Tab label="Item Three"/>
          </Tabs>
        </Box>


        {
          value === 0 &&
          <div className={styles.contentWrapper}>
            <div className={styles.itemCard}>
              <div className={styles.itemCardTitle}>Deployment</div>
              <div className={styles.itemCardContent}>https://github.com/cameronmcnz/rock-paper-scissors.git</div>
              <div className={styles.itemButton}>
                <div className={styles.leftButton}>
                  Log
                </div>
                <div className={styles.rightButton}>
                  Resources
                </div>
              </div>
            </div>
          </div>
        }
        {
          value === 1 &&
          <div className={styles.contentWrapper}>
            <div className={styles.itemCard}>
              <div className={styles.itemCardTitle}>Deployment</div>
              <div className={styles.itemCardContent}>https://github.com/cameronmcnz/rock-paper-scissors.git</div>
              <div className={styles.itemButton}>
                <div className={styles.leftButton}>
                  Log
                </div>
                <div className={styles.rightButton}>
                  Resources
                </div>
              </div>
            </div>
          </div>
        }
        {
          value === 2 &&
          <div className={styles.contentWrapper}>
            <div className={styles.itemCard}>
              <div className={styles.itemCardTitle}>Deployment</div>
              <div className={styles.itemCardContent}>https://github.com/cameronmcnz/rock-paper-scissors.git</div>
              <div className={styles.itemButton}>
                <div className={styles.leftButton}>
                  Log
                </div>
                <div className={styles.rightButton}>
                  Resources
                </div>
              </div>
            </div>
          </div>
        }


        {/*<div value={value} index={1}>*/}
        {/*  1*/}
        {/*</div>*/}
        {/*<div value={value} index={2}>*/}
        {/*  2*/}
        {/*</div>*/}
        {/*<TabPanel value={value} index={0}>*/}
        {/*  Item One*/}
        {/*</TabPanel>*/}
        {/*<TabPanel value={value} index={1}>*/}
        {/*  Item Two*/}
        {/*</TabPanel>*/}
        {/*<TabPanel value={value} index={2}>*/}
        {/*  Item Three*/}
        {/*</TabPanel>*/}


        {/*<div className={styles.title}>*/}
        {/*  APPLICATION INFOMATION*/}
        {/*</div>*/}
        {/*/!* card need use a component*!/*/}
        {/*<div className={styles.cardWrapper}>*/}
        {/*  {*/}
        {/*    applicationList.map((item, index) => {*/}
        {/*      let {name, tag, logo, repo, url} = item*/}
        {/*      return (*/}
        {/*        <div className={styles.card} key={index}>*/}
        {/*          <div className={styles.iconAndContent}>*/}
        {/*            <div className={styles.icon}>*/}
        {/*              <img src={logo} alt=""/>*/}
        {/*            </div>*/}
        {/*            <div className={styles.content}>*/}
        {/*              <div className={styles.name}>*/}
        {/*                {name}*/}
        {/*              </div>*/}
        {/*              <div className={styles.tag}>*/}
        {/*                {tag}*/}
        {/*              </div>*/}
        {/*              {*/}
        {/*                repo.map(i => {*/}
        {/*                  return (*/}
        {/*                    <div className={styles.repo} key={i}>*/}
        {/*                      <span className={styles.labelRepo}>· repo: </span>*/}
        {/*                      <span>{i}</span>*/}
        {/*                    </div>*/}
        {/*                  )*/}
        {/*                })*/}
        {/*              }*/}
        {/*            </div>*/}
        {/*          </div>*/}
        {/*          <div className={styles.url}>*/}
        {/*            <span className={styles.urlLabel}>url: </span>*/}
        {/*            {url}*/}
        {/*          </div>*/}
        {/*        </div>*/}
        {/*      )*/}
        {/*    })*/}
        {/*  }*/}
        {/*</div>*/}

        {/*<div className={styles.title}>*/}
        {/*  APPLICATION PANNALS*/}
        {/*</div>*/}

        {/*<div className={styles.cardWrapper}>*/}

        {/*  {*/}
        {/*    pannalsList.map((item, index) => {*/}
        {/*      let {name, tag, logo, repo, url} = item*/}
        {/*      return (*/}
        {/*        <div className={styles.card} key={index}>*/}
        {/*          <div className={styles.iconAndContent}>*/}
        {/*            <div className={styles.icon}>*/}
        {/*              <img src={logo} alt=""/>*/}
        {/*            </div>*/}
        {/*            <div className={styles.content}>*/}
        {/*              <div className={styles.name}>*/}
        {/*                {name}*/}
        {/*              </div>*/}
        {/*              <div className={styles.tag}>*/}
        {/*                {tag}*/}
        {/*              </div>*/}
        {/*              {*/}
        {/*                repo.map(i => {*/}
        {/*                  return (*/}
        {/*                    <div className={styles.repo} key={i}>*/}
        {/*                      <span className={styles.labelRepo}>{i.split(":")[0]}: </span>*/}
        {/*                      <span>{i.split(":")[1]}</span>*/}
        {/*                    </div>*/}
        {/*                  )*/}
        {/*                })*/}
        {/*              }*/}
        {/*            </div>*/}
        {/*          </div>*/}
        {/*          <div className={styles.url}>*/}
        {/*            <span className={styles.urlLabel}>url: </span>*/}
        {/*            {url}*/}
        {/*          </div>*/}
        {/*        </div>*/}
        {/*      )*/}
        {/*    })*/}
        {/*  }*/}
        {/*</div>*/}
      </div>
    </Layout>
  )
};


export default ApplicationDetail;

// http://localhost/2/applications/applicationDetail

