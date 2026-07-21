import type { AddTemplate, AddTemplateSchdl, AddTemplateTodo } from '../../../../../../../types'
import {
  checkTimeConflict,
  convertTimeStrIntoDurationMin,
  createDisplayTimeStr
} from '../../../../../../../util'
import styles from './Todo.module.css'

interface Props {
  addTemplateTodos: AddTemplateTodo[]
  setAddTemplateTodos(todos: AddTemplateTodo[]): void
  addTemplateSchdls: AddTemplateSchdl[]
  setAddTemplateSchdls(schdls: AddTemplateSchdl[]): void
  noteValue: string
  startDate: Date
  endDate: Date
  durationStr: string
  setDurationError(bool: boolean): void
  setTimeConflictError(bool: boolean): void
  setTodosLimitError(bool: boolean): void
  setTimeStraddleError(bool: boolean): void
  resetAllErrorMessage(): void
}

export const Todo = (props: Props): React.JSX.Element => {
  const {
    addTemplateTodos,
    setAddTemplateTodos,
    addTemplateSchdls,
    setAddTemplateSchdls,
    noteValue,
    startDate,
    endDate,
    durationStr,
    setDurationError,
    setTimeConflictError,
    setTodosLimitError,
    setTimeStraddleError,
    resetAllErrorMessage
  } = props

  const todos = addTemplateTodos.map((todo) => {
    const handleTodoDelBtn = (): void => {
      if (!confirm('Delete this item?')) return

      const newAddTemplateTodos = addTemplateTodos.filter(
        (el: AddTemplateTodo) => el.id !== todo.id
      )
      setAddTemplateTodos(newAddTemplateTodos)
      setTodosLimitError(false)
    }

    return (
      <li key={todo.id} className={styles.todo}>
        <span className={styles.todoTitle}>{todo.title}</span>
        <button type="button" className={styles.todoDelBtn} onClick={handleTodoDelBtn}>
          x
        </button>
      </li>
    )
  })

  const handleDropTodolist = (e: React.DragEvent<HTMLElement>): void => {
    const types = Array.from(e.dataTransfer.types)
    const addTemplateFullType = types.find((type) => type.startsWith('add-template/'))
    const durationHasError = !Number(durationStr)

    if (!addTemplateFullType) return
    const addTemplateType = addTemplateFullType.slice(13)
    if (addTemplateType === 'schedule') return
    if (addTemplateType === 'task' && durationHasError) {
      setDurationError(durationHasError)
      return
    }

    if (addTemplateType !== 'template') {
      const data = JSON.parse(e.dataTransfer.getData(`add-template/${addTemplateType}`))

      if (addTemplateTodos.length >= 10) {
        setTodosLimitError(true)
        return
      }

      if (addTemplateType === 'task') {
        const newAddTemplateSchdl = {
          id: crypto.randomUUID(),
          title: data.title,
          note: noteValue,
          color: data.color,
          startAt: createDisplayTimeStr(startDate),
          endAt: createDisplayTimeStr(endDate),
          durationMin: Number(durationStr)
        }

        const startAtTotalMin = convertTimeStrIntoDurationMin(newAddTemplateSchdl.startAt)
        const endAtTotalMin = convertTimeStrIntoDurationMin(newAddTemplateSchdl.endAt)
        const timeHasStraddleError = startAtTotalMin > endAtTotalMin
        if (timeHasStraddleError) {
          setTimeStraddleError(timeHasStraddleError)
          return
        }
        const timeHasConflictError = checkTimeConflict(newAddTemplateSchdl, addTemplateSchdls, [])
        if (timeHasConflictError) {
          setTimeConflictError(timeHasConflictError)
          return
        }

        setAddTemplateSchdls([...addTemplateSchdls, newAddTemplateSchdl])

        setAddTemplateTodos([
          ...addTemplateTodos,
          {
            id: crypto.randomUUID(),
            title: data.title
          }
        ])
        resetAllErrorMessage()
      } else if (addTemplateType === 'todo') {
        setAddTemplateTodos([
          ...addTemplateTodos,
          {
            id: crypto.randomUUID(),
            title: data.title
          }
        ])
        resetAllErrorMessage()
      }
    }

    if (addTemplateType === 'template') {
      const data = JSON.parse(
        e.dataTransfer.getData(`add-template/${addTemplateType}`)
      ) as AddTemplate

      const newAddTemplateSchdls: AddTemplateSchdl[] = []
      const newAddTemplateTodos: AddTemplateTodo[] = []

      const setSchdls = (schdls: AddTemplateSchdl[]): void => {
        schdls.forEach((schdl) => {
          newAddTemplateSchdls.push({ ...schdl, id: crypto.randomUUID() })
        })
        setAddTemplateSchdls(newAddTemplateSchdls)
      }

      const setTodos = (todos: AddTemplateTodo[]): void => {
        todos.forEach((todo) => {
          newAddTemplateTodos.push({ ...todo, id: crypto.randomUUID() })
        })
        setAddTemplateTodos(newAddTemplateTodos)
      }

      resetAllErrorMessage()
      if (data.isSchdlTemplate) {
        if (!confirm('Overwrite only Schedule of this date?')) return
        setSchdls(data.schdl)
      } else if (data.isTodoTemplate) {
        if (!confirm('Overwrite only To-Do of this date?')) return
        setTodos(data.todo)
      } else {
        if (!confirm('Overwrite Schedule and To-Do?')) return
        setSchdls(data.schdl)
        setTodos(data.todo)
      }
    }
  }

  return (
    <section
      className={styles.todoSec}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDropTodolist}
    >
      <p className={styles.title}>
        <span>✅</span>
        <span>To-Do</span>
      </p>
      <ul className={styles.todos}>{todos}</ul>
    </section>
  )
}
