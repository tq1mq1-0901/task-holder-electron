import type { AddTask, ConfirmTexts } from '../../../../types'
import styles from './Task.module.css'
import { Form } from './Form/Form'
import { TrushCan } from '../TrushCan/TrushCan'

interface Props {
  addTasks: AddTask[]
  setAddTasks(addTasks: AddTask[]): void
  colors: string[]
  confirm(texts: ConfirmTexts): Promise<boolean>
}

export const Task = ({ addTasks, setAddTasks, colors, confirm }: Props): React.JSX.Element => {
  const MIMEType = 'add/task'

  const taskLists = addTasks.map((task) => (
    <li
      key={task.id}
      className={`${task.color} ${task.color + '-container'} ${styles.task}`}
      draggable
      onDragStart={(e) => e.dataTransfer.setData(MIMEType, JSON.stringify(task))}
    >
      {task.title}
    </li>
  ))

  return (
    <section className={styles.container}>
      <section className={styles.taskSec}>
        <section className={styles.head}>
          <p className={styles.headTitle}>
            <span className={styles.symbol}>🗂️</span>
            <span className={styles.title}>Task</span>
          </p>
          <Form addTasks={addTasks} setAddTasks={setAddTasks} colors={colors} />
        </section>
        <ul className={styles.tasks}>{taskLists}</ul>
      </section>
      <TrushCan MIMEType={MIMEType} lists={addTasks} setter={setAddTasks} confirm={confirm} />
    </section>
  )
}
