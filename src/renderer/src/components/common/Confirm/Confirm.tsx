import styles from './Confirm.module.css'

interface Props {
  title: string
  sentence: string
  note?: string
}

export function Confirm({ title, sentence, note }: Props): React.JSX.Element {
  return (
    <>
      <div className="mask"></div>
      <div className={`form ${styles.container}`}>
        <section className={styles.sentences}>
          <p className={styles.title}>{title}</p>
          <p>{sentence}</p>
          <p className={styles.note}>{note}</p>
        </section>
        <section className={styles.btns}>
          <button className={styles.ok}>OK</button>
          <button className={styles.cancel}>Cancel</button>
        </section>
      </div>
    </>
  )
}
