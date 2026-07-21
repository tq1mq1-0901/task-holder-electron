import styles from './List.module.css'
import { Todo } from './Todo/Todo'
import { Schedule } from './Schedule/Schedule'
import { Task } from './Task/Task'
import { Template } from './Template/Template'
import type { AddTemplate, AddSchedule, AddMode, AddTask, AddTodo } from '../../../types'
import { useLocalStorage } from '../../../hooks'

interface Props {
  modes: AddMode[]
  colors: string[]
}

export const List = ({ modes, colors }: Props): React.JSX.Element => {
  const [addTodos, setAddTodos] = useLocalStorage<AddTodo[]>('addTodos', [])
  const [addSchedules, setAddSchedules] = useLocalStorage<AddSchedule[]>('addSchedules', [])
  const [addTasks, setAddTasks] = useLocalStorage<AddTask[]>('addTasks', [])
  const [addTemplates, setAddTemplates] = useLocalStorage<AddTemplate[]>('addTemplates', [])

  return (
    <section className={styles.lists}>
      {modes.find((e) => e.value === 'todo')?.isChecked && (
        <Todo addTodos={addTodos} setAddTodos={setAddTodos} />
      )}
      {modes.find((e) => e.value === 'schedule')?.isChecked && (
        <Schedule addSchedules={addSchedules} setAddSchedules={setAddSchedules} colors={colors} />
      )}
      {modes.find((e) => e.value === 'task')?.isChecked && (
        <Task addTasks={addTasks} setAddTasks={setAddTasks} colors={colors} />
      )}
      {modes.find((e) => e.value === 'template')?.isChecked && (
        <Template
          addTemplates={addTemplates}
          setAddTemplates={setAddTemplates}
          colors={colors}
          addTodos={addTodos}
          addSchedules={addSchedules}
          addTasks={addTasks}
        />
      )}
    </section>
  )
}
