import styles from "./index.module.scss";
import Layout from "@/components/Layout";

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
  return (
    <Layout pageHeader="Application Detail">
      <div className={styles.pageWrapper}>
        <div className={styles.title}>
          APPLICATION INFOMATION
        </div>
        {/* card need use a component*/}
        <div className={styles.cardWrapper}>
          {
            applicationList.map((item, index) => {
              let {name, tag, logo, repo, url} = item
              return (
                <div className={styles.card} key={index}>
                  <div className={styles.iconAndContent}>
                    <div className={styles.icon}>
                      <img src={logo} alt=""/>
                    </div>
                    <div className={styles.content}>
                      <div className={styles.name}>
                        {name}
                      </div>
                      <div className={styles.tag}>
                        {tag}
                      </div>
                      {
                        repo.map(i => {
                          return (
                            <div className={styles.repo} key={i}>
                              <span className={styles.labelRepo}>· repo: </span>
                              <span>{i}</span>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                  <div className={styles.url}>
                    <span className={styles.urlLabel}>url: </span>
                    {url}
                  </div>
                </div>
              )
            })
          }
        </div>

        <div className={styles.title}>
          APPLICATION PANNALS
        </div>

        <div className={styles.cardWrapper}>

          {
            pannalsList.map((item, index) => {
              let {name, tag, logo, repo, url} = item
              return (
                <div className={styles.card} key={index}>
                  <div className={styles.iconAndContent}>
                    <div className={styles.icon}>
                      <img src={logo} alt=""/>
                    </div>
                    <div className={styles.content}>
                      <div className={styles.name}>
                        {name}
                      </div>
                      <div className={styles.tag}>
                        {tag}
                      </div>
                      {
                        repo.map(i => {
                          return (
                            <div className={styles.repo} key={i}>
                              <span className={styles.labelRepo}>{i.split(":")[0]}: </span>
                              <span>{i.split(":")[1]}</span>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                  <div className={styles.url}>
                    <span className={styles.urlLabel}>url: </span>
                    {url}
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </Layout>
  )
};


export default ApplicationDetail;

// http://localhost/2/applications/applicationDetail

