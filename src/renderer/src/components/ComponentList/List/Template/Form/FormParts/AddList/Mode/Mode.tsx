import type { AddMode, Id } from '../../../../../../../../types'
import styles from './Mode.module.css'

interface Props {
  modes: AddMode[]
  setModes(modes: AddMode[]): void
}

export const Mode = ({ modes, setModes }: Props): React.JSX.Element => {
  const handleModeBtn = (id: Id): void => {
    const newModes = modes.map((mode) => {
      const isCorrectMode = mode.id === id
      return {
        ...mode,
        isChecked: isCorrectMode
      }
    })
    setModes(newModes)
  }
  const modeBtns = modes.map((mode) => {
    return (
      <li key={mode.value} className={styles.modeItem}>
        <label>
          <input
            type="radio"
            name={mode.name}
            value={mode.value}
            checked={mode.isChecked}
            onChange={() => handleModeBtn(mode.id)}
          />
          <span>{mode.textContent}</span>
        </label>
      </li>
    )
  })

  return <ul className={styles.modes}>{modeBtns}</ul>
}
