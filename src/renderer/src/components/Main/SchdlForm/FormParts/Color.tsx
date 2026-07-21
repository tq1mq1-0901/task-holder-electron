import styles from './Color.module.css'

interface Props {
  trgtColor: string
  setTrgtColor(color: string): void
  colors: string[]
}

export const Color = ({ trgtColor, colors, setTrgtColor }: Props): React.JSX.Element => {
  const colorLis = colors.map((color) => (
    <li key={color} className={styles.item}>
      <label>
        <input
          type="radio"
          name="schdlFormColor"
          checked={trgtColor === color}
          onChange={() => setTrgtColor(color)}
        />
        <div className={color}></div>
      </label>
    </li>
  ))

  return (
    <section className={styles.colorSec}>
      <p className="formTitle requiredAlert">Color</p>
      <ul className={styles.items}>{colorLis}</ul>
    </section>
  )
}
