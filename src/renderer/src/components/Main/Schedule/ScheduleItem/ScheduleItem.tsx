import { useState } from 'react'
import type { ConfirmTexts, DspSchdl } from '../../../../types'
import styles from './ScheduleItem.module.css'
import { createPortal } from 'react-dom'
import { ItemDetail } from './ItemDetail/ItemDetail'

interface Props {
  schedule: DspSchdl
  dspSchdls: DspSchdl[]
  setDspSchdls(schdls: DspSchdl[]): void
  confirm(texts: ConfirmTexts): Promise<boolean>
}

export const ScheduleItem = (props: Props): React.JSX.Element => {
  const { schedule, dspSchdls, setDspSchdls, confirm } = props

  const [showDetails, setShowDetails] = useState(false)

  return (
    <li key={schedule.id}>
      <div
        className={`${styles.item} ${schedule.color} ${schedule.color + '-container'}`}
        onClick={() => setShowDetails(true)}
      >
        <p className={styles.time}>
          <span>🕐</span>
          <span>{schedule.startAt}</span>
          <span>~</span>
          <span>{schedule.endAt}</span>
        </p>
        <p className={styles.title}>
          <span>✏️</span>
          <span>{schedule.title}</span>
        </p>
        <p className={styles.note}>
          <span>📝</span>
          <span className={styles.noteContent}>{schedule.note}</span>
        </p>
      </div>
      {showDetails &&
        createPortal(
          <ItemDetail
            trgtSchdl={schedule}
            setShowDetails={setShowDetails}
            dspSchdls={dspSchdls}
            setDspSchdls={setDspSchdls}
            confirm={confirm}
          />,
          document.body
        )}
    </li>
  )
}
