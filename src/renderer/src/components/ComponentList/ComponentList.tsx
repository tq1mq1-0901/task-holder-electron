import styles from './ComponentList.module.css'
import { Mode } from './Mode/Mode'
import { List } from './List/List'
import { useState } from 'react'
import { AddSchedule, AddTask, AddTemplate, AddTodo, ConfirmTexts, modeValue } from '../../types'
import { useLocalStorage } from '@renderer/hooks'

interface Props {
  colors: string[]
  confirm(texts: ConfirmTexts): Promise<boolean>
}

export const ComponentList = ({ colors, confirm }: Props): React.JSX.Element => {
  const [addTodos, setAddTodos] = useLocalStorage<AddTodo[]>('addTodos', [])
  const [addSchedules, setAddSchedules] = useLocalStorage<AddSchedule[]>('addSchedules', [])
  const [addTasks, setAddTasks] = useLocalStorage<AddTask[]>('addTasks', [])
  const [addTemplates, setAddTemplates] = useLocalStorage<AddTemplate[]>('addTemplates', [])
  const [modes, setModes] = useState(() => [
    {
      id: crypto.randomUUID(),
      name: 'mode-btn',
      textContent: '✅To-Do',
      value: modeValue.todo,
      isChecked: true
    },
    {
      id: crypto.randomUUID(),
      name: 'mode-btn',
      textContent: '🔔Schedule',
      value: modeValue.schedule,
      isChecked: false
    },
    {
      id: crypto.randomUUID(),
      name: 'mode-btn',
      textContent: '🗂️Task',
      value: modeValue.task,
      isChecked: false
    },
    {
      id: crypto.randomUUID(),
      name: 'mode-btn',
      textContent: '📋Template',
      value: modeValue.template,
      isChecked: false
    }
  ])

  return (
    <section className={styles.section}>
      <Mode
        modes={modes}
        setModes={setModes}
        todoCount={addTodos.length}
        scheduleCount={addSchedules.length}
        taskCount={addTasks.length}
        templateCount={addTemplates.length}
      />
      <List
        modes={modes}
        colors={colors}
        confirm={confirm}
        addTodos={addTodos}
        setAddTodos={setAddTodos}
        addSchedules={addSchedules}
        setAddSchedules={setAddSchedules}
        addTasks={addTasks}
        setAddTasks={setAddTasks}
        addTemplates={addTemplates}
        setAddTemplates={setAddTemplates}
      />
    </section>
  )
}
