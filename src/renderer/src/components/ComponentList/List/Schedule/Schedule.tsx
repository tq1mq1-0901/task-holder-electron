import type { AddSchedule, ConfirmTexts } from '../../../../types'
import styles from './Schedule.module.css'
import { Form } from './Form/Form'
import { TrushCan } from '../TrushCan/TrushCan'

interface Props {
  addSchedules: AddSchedule[]
  setAddSchedules(addSchedules: AddSchedule[]): void
  colors: string[]
  confirm(texts: ConfirmTexts): Promise<boolean>
}

export const Schedule = (props: Props): React.JSX.Element => {
  const { addSchedules, setAddSchedules, colors, confirm } = props

  const MIMEType = 'add/schedule'

  const scheduleLists = addSchedules.map((schedule) => (
    <li
      key={schedule.id}
      className={`${schedule.color} ${schedule.color + '-container'} ${styles.schedule}`}
      draggable
      onDragStart={(e) => e.dataTransfer.setData(MIMEType, JSON.stringify(schedule))}
    >
      {schedule.title}
    </li>
  ))

  return (
    <section className={styles.container}>
      <section className={styles.scheduleSec}>
        <section className={styles.head}>
          <p className={styles.headTitle}>
            <span className={styles.symbol}>🔔</span>
            <span className={styles.title}>Schedule</span>
          </p>
          <Form addSchedules={addSchedules} setAddSchedules={setAddSchedules} colors={colors} />
        </section>
        <ul className={styles.schedules}>{scheduleLists}</ul>
      </section>
      <TrushCan
        MIMEType={MIMEType}
        lists={addSchedules}
        setter={setAddSchedules}
        confirm={confirm}
      />
    </section>
  )
}
