import { useState } from 'react'
import type { DspSchdl } from '../../../../../types'
import styles from './ItemDetail.module.css'

interface Props {
  trgtSchdl: DspSchdl
  setShowDetails(bool: boolean): void
  dspSchdls: DspSchdl[]
  setDspSchdls(dspSchdls: DspSchdl[]): void
}

export const ItemDetail = (props: Props): React.JSX.Element => {
  const { trgtSchdl, setShowDetails, dspSchdls, setDspSchdls } = props

  const [noteValue, setNoteValue] = useState(trgtSchdl.note)

  const handleDelBtn = (): void => {
    if (!confirm('Delete this Schedule?')) return
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
