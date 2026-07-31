import type { Id, AddMode } from '../../../types'
import styles from './Mode.module.css'
import { ModeEl } from './ModeEl/ModeEl'

interface Props {
  modes: AddMode[]
  setModes(modes: AddMode[]): void
  todoCount: number
  scheduleCount: number
  taskCount: number
  templateCount: number
}

export const Mode = (props: Props): React.JSX.Element => {
  const { modes, setModes, todoCount, scheduleCount, taskCount, templateCount } = props
  const switchMode = (id: Id): void => {
    const newModes = modes.map((mode) => {
      const isCorrectMode = mode.id === id
      return {
        ...mode,
        isChecked: isCorrectMode
      }
    })

    setModes(newModes)
  }

  const modeElements = modes.map((mode) => {
    let count = 0
    switch (mode.value) {
      case 'todo':
        count = todoCount
        break
      case 'schedule':
        count = scheduleCount
        break
      case 'task':
        count = taskCount
        break
      case 'template':
        count = templateCount
        break
    }
    return <ModeEl key={mode.id} modeData={mode} switchMode={switchMode} count={count} />
  })

  return (
    <section className={styles.section}>
      <ul className={styles.ul}>{modeElements}</ul>
    </section>
  )
}
