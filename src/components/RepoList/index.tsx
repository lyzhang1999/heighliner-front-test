import styles from './index.module.scss';

const list = [
  {
    repoName: 'my-shop-backend',
    tags: ['v0.1.2', 'v0.1.0'],
    PRS: ['h#269 refactor: push code to github', '#270 refactor: use base image'],
    Commits: [{
      commitID: 'fdasdf',
      commitMessage: 'fix: fix ... '
    }]
  },
  {
    repoName: 'my-shop-backend',
    tags: ['v0.1.2', 'v0.1.0'],
    PRS: ['h#269 refactor: push code to github', '#270 refactor: use base image'],
    Commits: [{
      commitID: 'fdasdf',
      commitMessage: 'fix: fix ... '
    }]
  },
  {
    repoName: 'my-shop-backend',
    tags: ['v0.1.2', 'v0.1.0'],
    PRS: ['h#269 refactor: push code to github', '#270 refactor: use base image'],
    Commits: [{
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
                <img src="" alt="" className={styles.icon}/>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}
