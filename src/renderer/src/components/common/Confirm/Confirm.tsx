import styles from './Confirm.module.css'

interface Props {
  title: string
  sentence: string
  note?: string
  onOk(): void
  onCancel(): void
}

export function Confirm(props: Props): React.JSX.Element {
  const { title, sentence, note, onOk, onCancel } = props

  return (
    <>
      <div className={`mask ${styles.mask}`}></div>
      <div className={`form ${styles.container}`}>
        <section className={styles.sentences}>
          <p className={styles.title}>{title}</p>
          <p>{sentence}</p>
          <p className={styles.note}>{note}</p>
        </section>
        <section className={styles.btns}>
          <button className={styles.ok} onClick={onOk}>
            OK
          </button>
          <button className={styles.cancel} onClick={onCancel}>
            Cancel
          </button>
        </section>
      </div>
    </>
  )
}
