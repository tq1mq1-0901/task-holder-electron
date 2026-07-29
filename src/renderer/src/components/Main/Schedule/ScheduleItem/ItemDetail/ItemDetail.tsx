import { useState } from 'react'
import type { ConfirmTexts, DspSchdl } from '../../../../../types'
import styles from './ItemDetail.module.css'

interface Props {
  trgtSchdl: DspSchdl
  setShowDetails(bool: boolean): void
  dspSchdls: DspSchdl[]
  setDspSchdls(dspSchdls: DspSchdl[]): void
  confirm(texts: ConfirmTexts): Promise<boolean>
}

export const ItemDetail = (props: Props): React.JSX.Element => {
  const { trgtSchdl, setShowDetails, dspSchdls, setDspSchdls, confirm } = props

  const [noteValue, setNoteValue] = useState(trgtSchdl.note)

  const handleDelBtn = async (): Promise<void> => {
    if (
      !(await confirm({
        title: '削除',
        sentence: `「${trgtSchdl.title}」を削除しますか？`,
        note: ''
      }))
    )
      return
    const newDspSchdls = dspSchdls.filter((schdl) => schdl.id !== trgtSchdl.id)
    setDspSchdls(newDspSchdls)
    setShowDetails(false)
  }

  const handleSaveBtn = (): void => {
    const newDspSchdls = dspSchdls.map((schdl) => {
      if (schdl.id === trgtSchdl.id) {
        return {
          ...schdl,
          note: noteValue
        }
      }
      return schdl
    })
    setDspSchdls(newDspSchdls)
    setShowDetails(false)
  }

  return (
    <div>
      <div className="mask" onClick={() => setShowDetails(false)}></div>
      <div className={`form ${styles.container}`}>
        <p className={styles.dateTime}>
          <span>📅 {trgtSchdl.date}</span>
          <span>
            🕐 {trgtSchdl.startAt} ~ {trgtSchdl.endAt}
          </span>
        </p>
        <ul className={styles.texts}>
          <li>
            <p className={styles.textsTitle}>Title</p>
            <p className={styles.content}>{trgtSchdl.title}</p>
          </li>
          <li>
            <p className={styles.textsTitle}>Note</p>
            <textarea
              className={`${styles.content} ${styles.textarea}`}
              defaultValue={noteValue}
              onChange={(e) => setNoteValue(e.currentTarget.value)}
              maxLength={120}
              spellCheck={false}
            ></textarea>
          </li>
          <li className={styles.btns}>
            <button className={styles.saveBtn} onClick={handleSaveBtn}>
              Save
            </button>
            <button className={styles.delBtn} onClick={handleDelBtn}>
              🗑️
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}
