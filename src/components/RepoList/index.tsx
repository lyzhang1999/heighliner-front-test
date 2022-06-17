import styles from './index.module.scss';

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
  return (
    <div className={styles.repoListWrapper}>
      {
        list.map((item, index) => {
          return (
            <div className={styles.repoItem} key={index}>
              <div className={styles.header}>
                <span className={styles.name}>
                  {item.repoName}
                </span>
                <img src="/img/application/panel/goRepo.svg" alt="" className={styles.icon}/>
              </div>
              <div className={styles.tags}>
                <img src="/img/gitprovider/github.webp" alt="github" className={styles.github}/>
                <span className={styles.line}>|</span>
                <span className={styles.tag}>tags</span>
                {
                  item.tags.map(i => {
                    return (
                      <span>
                          <span className={styles.line}>|</span>
                          <span className={styles.tag}>{i}</span>
                      </span>
                    )
                  })
                }
              </div>
              <div className={styles.lineCenter}></div>

              <div className={styles.prs}>
                <div className={styles.left}>
                  PRS:
                </div>
                <div className={styles.right}>
                  {item.prs.map((i, index) => {
                    return (<div className={styles.prsItem} key={index}>{i}</div>)
                  })}
                </div>
              </div>
              <div className={styles.prs}>
                <div className={styles.left}>
                  Commits:
                </div>
                <div className={styles.right}>
                  {item.commits.map((i, index) => {
                    return (
                      <div className={styles.prsItem} key={index}>
                        <span>{i.commitID}</span> <span className={styles.commitMessage}>({i.commitMessage})</span>
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
