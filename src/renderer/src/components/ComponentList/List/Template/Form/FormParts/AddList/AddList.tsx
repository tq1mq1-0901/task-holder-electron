import styles from './AddList.module.css'
import type {
  AddSchedule,
  AddMode,
  AddTask,
  AddTemplate,
  AddTodo
} from '../../../../../../../types'
import { useEffect } from 'react'
import { ListContainer } from './ListContainer/ListContainer'
import { Mode } from './Mode/Mode'
import { calcFormDurationMinStr } from '../../../../../../../util'
import { Time } from './Time/Time'

interface Props {
  modes: AddMode[]
  setModes(modes: AddMode[]): void
  addTodos: AddTodo[]
  addSchedules: AddSchedule[]
  addTasks: AddTask[]
  addTemplates: AddTemplate[]
  startDate: Date
  setStartDate(date: Date | ((old: Date) => Date)): void
  endDate: Date
  setEndDate(date: Date | ((old: Date) => Date)): void
  durationStr: string
  setDurationStr(durStr: string | ((durStr: string) => string)): void
  noteValue: string
  setNoteValue(note: string): void
}

export const AddList = (props: Props): React.JSX.Element => {
  const {
    modes,
    setModes,
    addTodos,
    addSchedules,
    addTasks,
    addTemplates,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    durationStr,
    setDurationStr,
    noteValue,
    setNoteValue
  } = props

  useEffect(() => {
    calcFormDurationMinStr(startDate, endDate, setDurationStr)
  }, [startDate, endDate, setDurationStr])

  return (
    <section className={styles.addList}>
      <Mode modes={modes} setModes={setModes} />
      <ListContainer
        modes={modes}
        addTodos={addTodos}
        addSchedules={addSchedules}
        addTasks={addTasks}
        addTemplates={addTemplates}
      />
      <section className={styles.noteSec}>
        <div className={styles.empty}></div>
        <div className={styles.note}>
          <p>note</p>
          <textarea
            name="temlate-addList-note"
            value={noteValue}
            onChange={(e) => setNoteValue(e.currentTarget.value)}
            maxLength={120}
            spellCheck={false}
          ></textarea>
        </div>
      </section>
      <Time
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        durationStr={durationStr}
      />
    </section>
  )
}
