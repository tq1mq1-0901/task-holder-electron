import { useState } from 'react'
import type {
  Id,
  DspTodo,
  AddSchedule,
  AddTask,
  DspSchdl,
  AddTemplateTodo,
  AddTemplateSchdl
} from '../../../types'
import { checkTimeConflict, createDateFormatStr, createDisplaySchedules } from '../../../util'
import styles from './Todo.module.css'
import { SchdlForm } from '../SchdlForm/SchdlForm'

interface Props {
  trgtDate: Date
  trgtDspTodos: DspTodo[]
  dspTodos: DspTodo[]
  setDspTodos(todos: DspTodo[]): void
  colors: string[]
  dspSchdls: DspSchdl[]
  setDspSchdls(schdls: DspSchdl[]): void
}

export const Todo = (props: Props): React.JSX.Element => {
  const { trgtDate, trgtDspTodos, dspTodos, setDspTodos, colors, dspSchdls, setDspSchdls } = props

  const [isSchdlAddable, setIsSchdlAddable] = useState<boolean>(false)
  const [dropedData, setDropedData] = useState<AddSchedule | AddTask | null>(null)
  const [todosLimitError, setTodosLimitError] = useState(false)
  const [straddleSchdlConflictError, setStraddleSchdlConflictError] = useState(false)

  const dateStr = `${trgtDate.getMonth() + 1}/${trgtDate.getDate()}`

  const switchIsComplete = (id: Id): void => {
    const newTodosForDisplay = dspTodos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          isComplete: !todo.isComplete
        }
      } else {
        return todo
      }
    })

    setDspTodos(newTodosForDisplay)
  }

  const handleCheckedDelBtn = (): void => {
    if (!confirm('Delete all completed To-Do?')) return
    const newTodos = dspTodos.filter(
      (todo) => todo.date !== createDateFormatStr(trgtDate) || todo.isComplete !== true
    )
    setDspTodos(newTodos)
    setTodosLimitError(false)
  }

  const handleAllDelBtn = (): void => {
    if (!confirm('Delete all To-Do?')) return
    const newTodos = dspTodos.filter((todo) => todo.date !== createDateFormatStr(trgtDate))
    setDspTodos(newTodos)
    setTodosLimitError(false)
  }

  const handleDropTodo = (e: React.DragEvent<HTMLUListElement>): void => {
    setTodosLimitError(false)
    setStraddleSchdlConflictError(false)

    const types = Array.from(e.dataTransfer.types)
    const addType = types.find((type) => type.startsWith('add/'))
    if (!addType) return

    const kind = addType.slice(4)
    if (kind === 'schedule') return
    const data = JSON.parse(e.dataTransfer.getData(addType))

    if (['todo', 'task'].includes(kind)) {
      const trgtTodos = dspTodos.filter((todo) => todo.date === createDateFormatStr(trgtDate))
      if (trgtTodos.length >= 10) {
        setTodosLimitError(true)
        return
      }

      setDspTodos([
        ...dspTodos,
        {
          id: crypto.randomUUID(),
          date: createDateFormatStr(trgtDate),
          title: data.title,
          isComplete: false
        }
      ])
    }
    if (kind === 'task') {
      setDropedData(data)
      setIsSchdlAddable(true)
    }
    if (kind === 'template') {
      const dspTodosFromTemplate = data.todo.map((el: AddTemplateTodo) => ({
        id: crypto.randomUUID(),
        date: createDateFormatStr(trgtDate),
        title: el.title,
        isComplete: false
      }))
      const dspSchdlsFromTemplate = data.schdl.map((el: AddTemplateSchdl) => ({
        ...el,
        id: crypto.randomUUID(),
        date: createDateFormatStr(trgtDate),
        isStraddle: false
      }))

      const dspTodosExceptTrgtDate = dspTodos.filter(
        (el: DspTodo) => el.date !== createDateFormatStr(trgtDate)
      )
      const dspSchdlsExceptTrgtDate = dspSchdls.filter(
        (el: DspSchdl) => el.date !== createDateFormatStr(trgtDate)
      )

      const newDspTodos = [...dspTodosFromTemplate, ...dspTodosExceptTrgtDate]
      const newDspSchdls = [...dspSchdlsFromTemplate, ...dspSchdlsExceptTrgtDate]

      const trgtSchdls = createDisplaySchedules(dspSchdls, trgtDate)
      const straddleSchdl = trgtSchdls.find((schdl) => schdl.isStraddle === true)
      const conflict = straddleSchdl
        ? checkTimeConflict(straddleSchdl, dspSchdlsFromTemplate, [])
        : false

      if (conflict) {
        setStraddleSchdlConflictError(true)
        return
      } else if (data.isTodoTemplate) {
        if (!confirm(`Overwrite To-Do of this date?`)) return
        setDspTodos(newDspTodos)
        return
      } else if (data.isSchdlTemplate) {
        if (!confirm(`Overwrite Schedule of this date?`)) return
        setDspSchdls(newDspSchdls)
        return
      } else {
        if (!confirm(`Overwrite this date?\n(This include Schedule and To-Do)`)) return
        setDspTodos(newDspTodos)
        setDspSchdls(newDspSchdls)
      }
    }
  }

  const todoItems = trgtDspTodos.map((todo) => {
    const handleDelBtn = (): void => {
      if (!confirm('Delete this item?')) return
      setDspTodos(dspTodos.filter((el) => el.id !== todo.id))
      setTodosLimitError(false)
    }

    return (
      <li key={todo.id} className={styles.todo}>
        <label>
          <input
            type="checkbox"
            className={styles.todoCheckbox}
            checked={todo.isComplete}
            onChange={() => switchIsComplete(todo.id)}
          />
          <span className={styles.todoTitle}>{todo.title}</span>
          <button className={styles.todoDelBtn} onClick={handleDelBtn}>
            x
          </button>
        </label>
      </li>
    )
  })

  return (
    <section className={styles.container}>
      <p className={styles.date}>{dateStr}</p>
      <ul className={styles.todos} onDrop={handleDropTodo} onDragOver={(e) => e.preventDefault()}>
        {todoItems}
      </ul>
      <section className={styles.options}>
        <section>
          {todosLimitError && <p className="error">Limit of 10 items reached.</p>}
          {straddleSchdlConflictError && (
            <p className="error">Conflict with previous day&#x27;s Schedule</p>
          )}
        </section>
        <section className={styles.btns}>
          <button className={styles.checkedDelBtn} onClick={handleCheckedDelBtn}>
            ✓
          </button>
          <button className={styles.allDelBtn} onClick={handleAllDelBtn}>
            🗑️
          </button>
        </section>
      </section>
      {isSchdlAddable && (
        <SchdlForm
          trgtDate={trgtDate}
          setIsSchdlAddable={setIsSchdlAddable}
          dropedData={dropedData}
          colors={colors}
          dspSchdls={dspSchdls}
          setDspSchdls={setDspSchdls}
        />
      )}
    </section>
  )
}
