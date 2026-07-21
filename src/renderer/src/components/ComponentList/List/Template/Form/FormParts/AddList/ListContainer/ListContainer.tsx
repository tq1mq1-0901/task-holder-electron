import type {
  AddSchedule,
  AddMode,
  AddTask,
  AddTemplate,
  AddTodo
} from '../../../../../../../../types'
import styles from './ListContainer.module.css'

interface Props {
  modes: AddMode[]
  addTodos: AddTodo[]
  addSchedules: AddSchedule[]
  addTasks: AddTask[]
  addTemplates: AddTemplate[]
}

export const ListContainer = (props: Props): React.JSX.Element => {
  const { modes, addTodos, addSchedules, addTasks, addTemplates } = props

  const addTodoLis = addTodos.map((todo) => (
    <li
      key={todo.id}
      className={`gray gray-container ${styles.item}`}
      draggable
      onDragStart={(e) => e.dataTransfer.setData('add-template/todo', JSON.stringify(todo))}
    >
      <span>{todo.title}</span>
    </li>
  ))

  const addScheduleLis = addSchedules.map((schedule) => (
    <li
      key={schedule.id}
      className={`${styles.item} ${schedule.color} ${schedule.color + '-container'}`}
      draggable
      onDragStart={(e) => e.dataTransfer.setData('add-template/schedule', JSON.stringify(schedule))}
    >
      <span>{schedule.title}</span>
    </li>
  ))

  const addTaskLis = addTasks.map((task) => (
    <li
      key={task.id}
      className={`${styles.item} ${task.color} ${task.color + '-container'}`}
      draggable
      onDragStart={(e) => e.dataTransfer.setData('add-template/task', JSON.stringify(task))}
    >
      <span>{task.title}</span>
    </li>
  ))

  const addTemplateLis = addTemplates.map((template) => (
    <li
      key={template.id}
      className={`gray gray-container ${styles.item}`}
      draggable
      onDragStart={(e) => e.dataTransfer.setData('add-template/template', JSON.stringify(template))}
    >
      <span>{template.title}</span>
    </li>
  ))

  return (
    <>
      {modes.find((mode) => mode.value === 'todo')?.isChecked && (
        <section className={styles.listContainer}>
          <ul className={styles.items}>{addTodoLis}</ul>
        </section>
      )}
      {modes.find((mode) => mode.value === 'schedule')?.isChecked && (
        <section className={styles.listContainer}>
          <ul className={styles.items}>{addScheduleLis}</ul>
        </section>
      )}
      {modes.find((mode) => mode.value === 'task')?.isChecked && (
        <section className={styles.listContainer}>
          <ul className={styles.items}>{addTaskLis}</ul>
        </section>
      )}
      {modes.find((mode) => mode.value === 'template')?.isChecked && (
        <section className={styles.listContainer}>
          <ul className={styles.items}>{addTemplateLis}</ul>
        </section>
      )}
    </>
  )
}
