import type { Id, AddMode } from '../../../types'
import styles from './Mode.module.css'
import { ModeEl } from './ModeEl/ModeEl'

interface Props {
  modes: AddMode[]
  setModes(modes: AddMode[]): void
}

export const Mode = ({ modes, setModes }: Props) => {
  const switchMode = (id: Id) => {
    const newModes = modes.map((mode) => {
      const isCorrectMode = mode.id === id
      return {
        ...mode,
        isChecked: isCorrectMode
      }
    })

    setModes(newModes)
  }

  const modeElements = modes.map((mode) => (
    <ModeEl
      key={mode.id}
      id={mode.id}
      textContent={mode.textContent}
      name={mode.name}
      value={mode.value}
      isChecked={mode.isChecked}
      switchMode={switchMode}
    />
  ))

  return (
    <section className={styles.section}>
      <ul className={styles.ul}>{modeElements}</ul>
    </section>
  )
}
