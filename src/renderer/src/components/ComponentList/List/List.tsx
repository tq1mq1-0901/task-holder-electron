import styles from './List.module.css'
import { Todo } from './Todo/Todo'
import { Schedule } from './Schedule/Schedule'
import { Task } from './Task/Task'
import { Template } from './Template/Template'
import type {
  AddTemplate,
  AddSchedule,
  AddMode,
  AddTask,
  AddTodo,
  ConfirmTexts
} from '../../../types'

interface Props {
  modes: AddMode[]
  colors: string[]
  confirm(texts: ConfirmTexts): Promise<boolean>
  addTodos: AddTodo[]
  setAddTodos(todos: AddTodo[]): void
  addSchedules: AddSchedule[]
  setAddSchedules(schedules: AddSchedule[]): void
  addTasks: AddTask[]
  setAddTasks(tasks: AddTask[]): void
  addTemplates: AddTemplate[]
  setAddTemplates(templates: AddTemplate[]): void
}

export const List = (props: Props): React.JSX.Element => {
  const {
    modes,
    colors,
    confirm,
    addTodos,
    setAddTodos,
    addSchedules,
    setAddSchedules,
    addTasks,
    setAddTasks,
    addTemplates,
    setAddTemplates
  } = props

  return (
    <section className={styles.lists}>
      {modes.find((e) => e.value === 'todo')?.isChecked && (
        <Todo addTodos={addTodos} setAddTodos={setAddTodos} confirm={confirm} />
      )}
      {modes.find((e) => e.value === 'schedule')?.isChecked && (
        <Schedule
          addSchedules={addSchedules}
          setAddSchedules={setAddSchedules}
          colors={colors}
          confirm={confirm}
        />
      )}
      {modes.find((e) => e.value === 'task')?.isChecked && (
        <Task addTasks={addTasks} setAddTasks={setAddTasks} colors={colors} confirm={confirm} />
      )}
      {modes.find((e) => e.value === 'template')?.isChecked && (
        <Template
          addTemplates={addTemplates}
          setAddTemplates={setAddTemplates}
          colors={colors}
          addTodos={addTodos}
          addSchedules={addSchedules}
          addTasks={addTasks}
          confirm={confirm}
        />
      )}
    </section>
  )
}
