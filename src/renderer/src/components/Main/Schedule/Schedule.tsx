import React, { useState } from 'react'
import type {
  AddSchedule,
  AddTask,
  DspSchdl,
  DspTodo,
  AddTemplateTodo,
  AddTemplateSchdl
} from '../../../types'
import {
  checkTimeConflict,
  convertTimeStrIntoDurationMin,
  createDateFormatStr
} from '../../../util'
import styles from './Schedule.module.css'
import { SchdlForm } from '../SchdlForm/SchdlForm'
import { ScheduleItem } from './ScheduleItem/ScheduleItem'

interface Props {
  trgtDate: Date
  trgtSchdls: DspSchdl[]
  dspTodos: DspTodo[]
  setDspTodos(dspTodos: DspTodo[]): void
  dspSchdls: DspSchdl[]
  setDspSchdls(schdls: DspSchdl[]): void
  colors: string[]
}

export const Schedule = (props: Props): React.JSX.Element => {
  const { trgtDate, trgtSchdls, dspTodos, setDspTodos, dspSchdls, setDspSchdls, colors } = props

  const [isSchdlAddable, setIsSchdlAddable] = useState(false)
  const [dropedData, setDropedData] = useState<AddSchedule | AddTask | null>(null)
  const [todoError, setTodoError] = useState(false)
  const [conflictError, setConflictError] = useState(false)

  const dateStr = `${trgtDate.getMonth() + 1}/${trgtDate.getDate()}`

  const handleClickAllDel = (): void => {
    if (!confirm('Would you like to delete all schedules for this date?')) return

    const newDspSchdls = dspSchdls.filter((schdl) => schdl.date !== createDateFormatStr(trgtDate))
    setDspSchdls(newDspSchdls)
  }

  const sortTrgtSchdls = [...trgtSchdls].sort((a, b) => {
    return convertTimeStrIntoDurationMin(a.startAt) - convertTimeStrIntoDurationMin(b.startAt)
  })
  const scheduleItems = sortTrgtSchdls.map((schedule) => {
    return (
      <ScheduleItem
        key={schedule.id}
        schedule={schedule}
        dspSchdls={dspSchdls}
        setDspSchdls={setDspSchdls}
      />
    )
  })

  const handleDropSchdl = (e: React.DragEvent<HTMLElement>): void => {
    setTodoError(false)
    setConflictError(false)
    const types = Array.from(e.dataTransfer.types)
    const addType = types.find((type) => type.startsWith('add/'))
    if (!addType) return

    const kind = addType.slice(4)
    if (kind === 'todo') return
    const data = JSON.parse(e.dataTransfer.getData(addType))

    if (kind === 'task') {
      const trgtTodos = dspTodos.filter((todo) => todo.date === createDateFormatStr(trgtDate))
      if (trgtTodos.length >= 10) {
        setTodoError(true)
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
    if (['schedule', 'task'].includes(kind)) {
      setDropedData(data)
      setIsSchdlAddable(true)
    }
    if (kind === 'template') {
      const dspTodosFromTemplate = data.todo.map((el: AddTemplateTodo) => ({
        ...el,
        id: crypto.randomUUID(),
        date: createDateFormatStr(trgtDate),
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
      const newDspSchdls = [...dspSchdlsExceptTrgtDate, ...dspSchdlsFromTemplate]

      const straddleSchdl = trgtSchdls.find((schdl) => schdl.isStraddle === true)
      const conflict = straddleSchdl
        ? checkTimeConflict(straddleSchdl, dspSchdlsFromTemplate, [])
        : false

      if (conflict) {
        setConflictError(true)
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

  return (
    <section
      className={styles.schedule}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDropSchdl}
    >
      <section className={styles.header}>
        <div className={styles.errors}>
          {todoError && <p className="error">To-Do limit reached.</p>}
          {conflictError && <p className="error">Conflict with other schedule.</p>}
        </div>
        <span className={styles.date}>{dateStr}</span>
        <button onClick={handleClickAllDel} className={styles.allDelBtn}>
          X
        </button>
      </section>
      <ul className={`${styles.ul} ${styles.items}`}>{scheduleItems}</ul>
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
