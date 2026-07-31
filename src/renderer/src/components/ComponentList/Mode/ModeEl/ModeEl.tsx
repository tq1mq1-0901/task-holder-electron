import type { AddMode, Id } from '../../../../types'
import styles from './ModeEl.module.css'

interface Props {
  modeData: AddMode
  switchMode(id: Id): void
  count: number
}

export const ModeEl = ({ modeData, switchMode, count }: Props): React.JSX.Element => {
  const { id, name, textContent, value, isChecked } = modeData

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
        <span className={styles.textContent}>{textContent}</span>
        <span className={styles.counter}>{count}</span>
      </label>
    </li>
  )
}
