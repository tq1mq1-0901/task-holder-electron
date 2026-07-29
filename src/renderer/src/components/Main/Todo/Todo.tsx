import { useState } from 'react'
import type {
  Id,
  DspTodo,
  AddSchedule,
  AddTask,
  DspSchdl,
  AddTemplateTodo,
  AddTemplateSchdl,
  ConfirmTexts
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
  confirm(texts: ConfirmTexts): Promise<boolean>
}

export const Todo = (props: Props): React.JSX.Element => {
  const {
    trgtDate,
    trgtDspTodos,
    dspTodos,
    setDspTodos,
    colors,
    dspSchdls,
    setDspSchdls,
    confirm
  } = props

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

  const handleCheckedDelBtn = async (): Promise<void> => {
    if (
      !(await confirm({
        title: '完了',
        sentence: 'すべてのTo-Doを完了済みにしますか？',
        note: ''
      }))
    )
      return
    const newTodos = dspTodos.map((todo) => {
      return todo.date === createDateFormatStr(trgtDate) ? { ...todo, isComplete: true } : todo
    })
    setDspTodos(newTodos)
    setTodosLimitError(false)
  }

  const handleAllDelBtn = async (): Promise<void> => {
    if (
      !(await confirm({
        title: '削除',
        sentence: `すべてのTo${'-'}Doを削除しますか？`,
        note: ''
      }))
    )
      return
    const newTodos = dspTodos.filter((todo) => todo.date !== createDateFormatStr(trgtDate))
    setDspTodos(newTodos)
    setTodosLimitError(false)
  }

  const handleDropTodo = async (e: React.DragEvent<HTMLUListElement>): Promise<void> => {
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
        if (
          !(await confirm({
            title: '上書き',
            sentence: `${createDateFormatStr(trgtDate)}のTo${'-'}Doリストを上書きしますか？`,
            note: '(スケジュールは上書きされません。)'
          }))
        )
          return
        setDspTodos(newDspTodos)
        return
      } else if (data.isSchdlTemplate) {
        if (
          !(await confirm({
            title: '上書き',
            sentence: `${createDateFormatStr(trgtDate)}のスケジュールを上書きしますか？`,
            note: '(To-Doは上書きされません。)'
          }))
        )
          return
        setDspSchdls(newDspSchdls)
        return
      } else {
        if (
          !(await confirm({
            title: '上書き',
            sentence: `${createDateFormatStr(trgtDate)}のすべてのタスクを上書きしますか？`,
            note: ''
          }))
        )
          return
        setDspTodos(newDspTodos)
        setDspSchdls(newDspSchdls)
      }
    }
  }

  const todoItems = trgtDspTodos.map((todo) => {
    const handleDelBtn = async (): Promise<void> => {
      if (
        !(await confirm({
          title: '削除',
          sentence: `「${todo.title}」を削除しますか？`,
          note: ''
        }))
      )
        return
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
