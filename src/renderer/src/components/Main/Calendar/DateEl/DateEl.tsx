import type { DateData } from '../../../../types'
import styles from './DateEl.module.css'

interface Props {
  dateData: DateData
  trgtDate: Date
  setTrgtDate(date: Date): void
  schdlLength: number
  todoLength: number
}

export const DateEl = ({
  dateData,
  trgtDate,
  setTrgtDate,
  schdlLength,
  todoLength
}: Props): React.JSX.Element => {
  const { year, month, date, isToday, isSun, isSat, isThisMonth } = dateData

  const dateObj = new Date(year, month, date)

  const className = [
    styles.container,
    isToday && styles.isToday,
    isSun && styles.isSun,
    isSat && styles.isSat,
    isThisMonth && styles.isThisMonth,
    dateObj.getTime() === trgtDate.getTime() && styles.isTrgtDate
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <li className={className} onClick={() => setTrgtDate(dateObj)}>
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
