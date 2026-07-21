import styles from './ComponentList.module.css'
import { Mode } from './Mode/Mode'
import { List } from './List/List'
import { useState } from 'react'
import { modeValue } from '../../types'

interface Props {
  colors: string[]
}

export const ComponentList = ({ colors }: Props): React.JSX.Element => {
  // lazy initializer
  const [modes, setModes] = useState(() => [
    {
      id: crypto.randomUUID(),
      name: 'mode-btn',
      textContent: 'To-Do',
      value: modeValue.todo,
      isChecked: true
    },
    {
      id: crypto.randomUUID(),
      name: 'mode-btn',
      textContent: 'Schedule',
      value: modeValue.schedule,
      isChecked: false
    },
    {
      id: crypto.randomUUID(),
      name: 'mode-btn',
      textContent: 'Task',
      value: modeValue.task,
      isChecked: false
    },
    {
      id: crypto.randomUUID(),
      name: 'mode-btn',
      textContent: 'Template',
      value: modeValue.template,
      isChecked: false
    }
  ])

  return (
    <section className={styles.section}>
      <Mode modes={modes} setModes={setModes} />
      <List modes={modes} colors={colors} />
    </section>
  )
}
