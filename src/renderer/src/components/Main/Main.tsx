import styles from './Main.module.css'
import { Schedule } from './Schedule/Schedule'
import { Calendar } from './Calendar/Calendar'
import {
  leftMainStates,
  type LeftMainState,
  type DspSchdl,
  type DspTodo,
  type Memo
} from '../../types'
import { Todo } from './Todo/Todo'
import { createDateFormatStr, createDisplaySchedules } from '../../util'
import { MemoArea } from './MemoArea/MemoArea'

interface Props {
  trgtMon: Date
  setTrgtMon(date: Date): void
  trgtDate: Date
  setTrgtDate(date: Date): void
  today: Date
  leftMainState: LeftMainState
  dspTodos: DspTodo[]
  setDspTodos(todos: DspTodo[]): void
  dspSchdls: DspSchdl[]
  setDspSchdls(schedules: DspSchdl[]): void
  isAddOpen: boolean
  colors: string[]
  memos: Memo[]
  setMemos(memos: Memo[]): void
}

export const Main = (props: Props): React.JSX.Element => {
  const {
    trgtMon,
    setTrgtMon,
    trgtDate,
    setTrgtDate,
    leftMainState,
    dspTodos,
    setDspTodos,
    dspSchdls,
    setDspSchdls,
    isAddOpen,
    colors,
    memos,
    setMemos
  } = props

  const prcDate = new Date(trgtDate.getFullYear(), trgtDate.getMonth(), trgtDate.getDate() - 1)
  const nxtDate = new Date(trgtDate.getFullYear(), trgtDate.getMonth(), trgtDate.getDate() + 1)

  const prcDspSchdls = createDisplaySchedules(dspSchdls, prcDate)
  const trgtDspSchdls = createDisplaySchedules(dspSchdls, trgtDate)
  const nxtDspSchdls = createDisplaySchedules(dspSchdls, nxtDate)

  const trgtDspTodos = dspTodos.filter((todo) => todo.date === createDateFormatStr(trgtDate))

  return (
    <main className={`${styles.main} ${isAddOpen ? styles.mainShort : styles.mainTall}`}>
      <section className={styles.left}>
        {leftMainState === leftMainStates.schedule && (
          <section className={styles.schedule}>
            <Schedule
              key={prcDate.toDateString()}
              trgtDate={prcDate}
              dspTodos={dspTodos}
              trgtSchdls={prcDspSchdls}
              setDspTodos={setDspTodos}
              dspSchdls={dspSchdls}
              setDspSchdls={setDspSchdls}
              colors={colors}
            />
            <Schedule
              key={trgtDate.toDateString()}
              trgtDate={trgtDate}
              trgtSchdls={trgtDspSchdls}
              dspTodos={dspTodos}
              setDspTodos={setDspTodos}
              dspSchdls={dspSchdls}
              setDspSchdls={setDspSchdls}
              colors={colors}
            />
            <Schedule
              key={nxtDate.toDateString()}
              trgtDate={nxtDate}
              dspTodos={dspTodos}
              trgtSchdls={nxtDspSchdls}
              setDspTodos={setDspTodos}
              dspSchdls={dspSchdls}
              setDspSchdls={setDspSchdls}
              colors={colors}
            />
          </section>
        )}
        {leftMainState === leftMainStates.todo && (
          <section className={styles.todo}>
            <Todo
              key={trgtDate.toDateString()}
              trgtDate={trgtDate}
              trgtDspTodos={trgtDspTodos}
              dspTodos={dspTodos}
              setDspTodos={setDspTodos}
              colors={colors}
              dspSchdls={dspSchdls}
              setDspSchdls={setDspSchdls}
            />
          </section>
        )}
        {leftMainState === leftMainStates.memo && (
          <section className={styles.memo}>
            <MemoArea
              key={trgtDate.toDateString()}
              trgtDate={trgtDate}
              memos={memos}
              setMemos={setMemos}
            />
          </section>
        )}
      </section>
      <section className={styles.right}>
        <Calendar
          trgtMon={trgtMon}
          setTrgtMon={setTrgtMon}
          setTrgtDate={setTrgtDate}
          dspTodos={dspTodos}
          dspSchdls={dspSchdls}
        />
      </section>
    </main>
  )
}
