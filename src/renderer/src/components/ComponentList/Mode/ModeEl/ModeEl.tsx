import type { Id } from '../../../../types'
import styles from './ModeEl.module.css'

interface Props {
  id: Id
  textContent: string
  name: string
  value: string
  isChecked: boolean
  switchMode(id: Id): void
}

export const ModeEl = (props: Props) => {
  const { id, textContent, name, value, isChecked, switchMode } = props

  return (
    <li className={styles.mode}>
      <label>
        <input
          type="radio"
          name={name}
          value={value}
          checked={isChecked}
          onChange={() => switchMode(id)}
        />
        <span>{textContent}</span>
      </label>
    </li>
  )
}
