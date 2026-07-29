import {
  createPrevMonthDates,
  createThisMonthDates,
  createNextMonthDates,
  createDateFormatStr
} from '../../../util'
import styles from './Calendar.module.css'
import { DateEl } from './DateEl/DateEl'
import type { DspTodo, DspSchdl } from '../../../types'

interface Props {
  trgtMon: Date
  setTrgtMon(date: Date): void
  trgtDate: Date
  setTrgtDate(date: Date): void
  dspTodos: DspTodo[]
  dspSchdls: DspSchdl[]
}

export const Calendar = (props: Props): React.JSX.Element => {
  const { trgtMon, setTrgtMon, trgtDate, setTrgtDate, dspTodos, dspSchdls } = props

  const dateDataArr = [
    ...createPrevMonthDates(trgtMon),
    ...createThisMonthDates(trgtMon),
    ...createNextMonthDates(trgtMon)
  ]

  const yearMonStr = `${trgtMon.getFullYear()}/${String(trgtMon.getMonth() + 1).padStart(2, '0')}`

  const handlePrev = (): void => {
    const newMonth = new Date(trgtMon.getFullYear(), trgtMon.getMonth() - 1)
    setTrgtMon(newMonth)
  }
  const handleNext = (): void => {
    const newMonth = new Date(trgtMon.getFullYear(), trgtMon.getMonth() + 1)
    setTrgtMon(newMonth)
  }

  const dates = dateDataArr.map((dateData) => {
    const trgtDateFormatStr = createDateFormatStr(dateData.year, dateData.month, dateData.date)

    const trgtSchdlLength = dspSchdls.filter((schdl) => schdl.date === trgtDateFormatStr).length
    const trgtTodoLength = dspTodos.filter((todo) => todo.date === trgtDateFormatStr).length

    return (
      <DateEl
        key={`${dateData.year}-${dateData.month}-${dateData.date}`}
        dateData={dateData}
        trgtDate={trgtDate}
        setTrgtDate={setTrgtDate}
        schdlLength={trgtSchdlLength}
        todoLength={trgtTodoLength}
      />
    )
  })

  return (
    <section className={styles.cal}>
      <section className={styles.calHead}>
        <button className={styles.calPrev} onClick={handlePrev}>
          &lt;
        </button>
        <p className={styles.calYearmonth}>{yearMonStr}</p>
        <button className={styles.calNext} onClick={handleNext}>
          &gt;
        </button>
      </section>
      <ul className={styles.calBody}>
        <li className={styles.day}>Sun</li>
        <li className={styles.day}>Mon</li>
        <li className={styles.day}>Tue</li>
        <li className={styles.day}>Wed</li>
        <li className={styles.day}>Thu</li>
        <li className={styles.day}>Fri</li>
        <li className={styles.day}>Sat</li>
        {dates}
      </ul>
    </section>
  )
}
