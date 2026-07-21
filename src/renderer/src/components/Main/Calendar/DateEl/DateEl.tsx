import type { DateData } from '../../../../types'
import styles from './DateEl.module.css'

interface Props {
  dateData: DateData
  setTrgtDate(date: Date): void
  schdlLength: number
  todoLength: number
}

export const DateEl = ({
  dateData,
  setTrgtDate,
  schdlLength,
  todoLength
}: Props): React.JSX.Element => {
  const { year, month, date, isToday, isSun, isSat, isThisMonth } = dateData

  const className = [
    styles.container,
    isToday && styles.isToday,
    isSun && styles.isSun,
    isSat && styles.isSat,
    isThisMonth && styles.isThisMonth
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <li className={className} onClick={() => setTrgtDate(new Date(year, month, date))}>
      <section className={styles.content}>
        <p className={styles.date}>{date}</p>
        <section className={styles.counters}>
          {todoLength > 0 && (
            <p>
              <span>✅</span>
              <span>{todoLength}</span>
            </p>
          )}
          {schdlLength > 0 && (
            <p>
              <span>🔔</span>
              <span>{schdlLength}</span>
            </p>
          )}
        </section>
      </section>
    </li>
  )
}
