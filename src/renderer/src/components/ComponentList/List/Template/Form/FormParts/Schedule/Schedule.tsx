import type { AddTemplateTodo, AddTemplateSchdl, AddTemplate } from '../../../../../../../types'
import {
  checkTimeConflict,
  convertTimeStrIntoDurationMin,
  createDisplayTimeStr
} from '../../../../../../../util'
import styles from './Schedule.module.css'
import { ScheduleItem } from './ScheduleItem/ScheduleItem'

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
  setTimeStraddleError(bool: boolean): void
  resetAllErrorMessage(): void
  setTodosLimitError(bool: boolean): void
}

export const Schedule = (props: Props): React.JSX.Element => {
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
    setTimeStraddleError,
    resetAllErrorMessage,
    setTodosLimitError
  } = props

  const sortTrgtSchdls = [...addTemplateSchdls].sort((a, b) => {
    return convertTimeStrIntoDurationMin(a.startAt) - convertTimeStrIntoDurationMin(b.startAt)
  })
  const schdlItems = sortTrgtSchdls.map((schdl) => (
    <ScheduleItem
      key={schdl.id}
      schdl={schdl}
      addTemplateSchdls={addTemplateSchdls}
      setAddTemplateSchdls={setAddTemplateSchdls}
    />
  ))

  const handleDropSchdl = (e: React.DragEvent<HTMLElement>): void => {
    const types = Array.from(e.dataTransfer.types)
    const addTemplateFullType = types.find((type) => type.startsWith('add-template/'))
    const durationHasError = !Number(durationStr)

    if (!addTemplateFullType) return
    const addTemplateType = addTemplateFullType.slice(13)
    if (addTemplateType === 'todo') return

    if (addTemplateType !== 'template') {
      if (durationHasError) {
        setDurationError(durationHasError)
        return
      }
      const data = JSON.parse(e.dataTransfer.getData(`add-template/${addTemplateType}`))
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

      if (addTemplateType === 'task') {
        if (addTemplateTodos.length >= 10) {
          setTodosLimitError(true)
          return
        }
        setAddTemplateTodos([...addTemplateTodos, { id: crypto.randomUUID(), title: data.title }])
      }

      setAddTemplateSchdls([...addTemplateSchdls, newAddTemplateSchdl])
      resetAllErrorMessage()
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
      className={styles.schdl}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDropSchdl}
    >
      <p className={styles.title}>
        <span>🔔</span>
        <span>Schedule</span>
      </p>
      <ul className={styles.items}>{schdlItems}</ul>
    </section>
  )
}
