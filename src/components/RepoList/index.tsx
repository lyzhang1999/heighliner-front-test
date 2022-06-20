import styles from './index.module.scss';
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {getRepoList, GetRepoListRes} from "@/utils/api/application";

const list = [
  {
    repoName: 'my-shop-backend',
    tags: ['v0.1.2', 'v0.1.0'],
    prs: ['h#269 refactor: push code to github', '#270 refactor: use base image'],
    commits: [{
      commitID: 'fdasdf',
      commitMessage: 'fix: fix ... '
    },{
        commitID: 'fdafdsasdf',
        commitMessage: 'fix: .fewqwfq.. '
      }]
  },
  {
    repoName: 'my-shop-backend',
    tags: ['v0.1.2', 'v0.1.0'],
    prs: ['h#269 refactor: push code to github', '#270 refactor: use base image'],
    commits: [{
      commitID: 'fdasdf',
      commitMessage: 'fix: fix ... '
    }]
  },
  {
    repoName: 'my-shop-backend',
    tags: ['v0.1.2', 'v0.1.0'],
    prs: ['h#269 refactor: push code to github', '#270 refactor: use base image'],
    commits: [{
      commitID: 'fdasdf',
      commitMessage: 'fix: fix ... '
    }]
  }
]

export default function RepoList() {
  const [repoList, setRepoList] = useState<GetRepoListRes>([]);
  const router = useRouter();

  useEffect(() => {
    const appId = (router.query.app_id as string);
    getRepoList(appId).then(res => {
      console.warn(res);
      setRepoList(res);
    })
  }, [])

  return (
    <div className={styles.repoListWrapper}>
      {
        repoList.map((item, index) => {
          return (
            <div className={styles.repoItem} key={index}>
              <div className={styles.header}>
                <span className={styles.name}>
                  {item.repo_name}
                </span>
                <img src="/img/application/panel/goRepo.svg" alt="" className={styles.icon} onClick={() => window.open(item.repo_url)}/>
              </div>
              <div className={styles.tags}>
                <img src="/img/gitprovider/github.webp" alt="github" className={styles.github}/>
                <span className={styles.line}>|</span>
                {/*<span className={styles.tag}>tags</span>*/}
                {
                  [item.git_organization].map((i, index) => {
                    return (
                      <span key={index}>
                          {/*<span className={styles.line}>|</span>*/}
                          <span className={styles.tag}>{i}</span>
                      </span>
                    )
                  })
                }
              </div>
              <div className={styles.lineCenter}></div>

              <div className={styles.prs}>
                <div className={styles.left}>
                  Provider:
                </div>
                <div className={styles.right}>
                  {[item.provider].map((i, index) => {
                    return (<div className={styles.prsItem} key={index}>{i}</div>)
                  })}
                </div>
              </div>
              <div className={styles.prs}>
                <div className={styles.left}>
                  RepoType:
                </div>
                <div className={styles.right}>
                  {[item.repo_type].map((i, index) => {
                    return (
                      <div className={styles.prsItem} key={index}>
                        <span>{i}</span>
                        {/*<span>{i.commitID}</span> <span className={styles.commitMessage}>({i.commitMessage})</span>*/}
                      </div>)
                  })}
                </div>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}
