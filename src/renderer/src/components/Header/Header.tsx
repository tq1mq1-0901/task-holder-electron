import styles from './Header.module.css'
import { leftMainStates, type LeftMainState } from '../../types'

interface Props {
  setTrgtMon(date: Date): void
  trgtDate: Date
  setTrgtDate(date: Date): void
  today: Date
  leftMainState: LeftMainState
  setLeftMainState(state: LeftMainState): void
  isAddOpen: boolean
  setIsAddOpen(bool: boolean): void
}

export const Header = (props: Props): React.JSX.Element => {
  const {
    setTrgtMon,
    trgtDate,
    setTrgtDate,
    today,
    leftMainState,
    setLeftMainState,
    isAddOpen,
    setIsAddOpen
  } = props

  const handlePrevDateBtn = (): void => {
    const newTrgtDate = new Date(
      trgtDate.getFullYear(),
      trgtDate.getMonth(),
      trgtDate.getDate() - 1
    )
    setTrgtDate(newTrgtDate)
    setTrgtMon(newTrgtDate)
  }

  const handleTodayBtn = (): void => {
    setTrgtMon(new Date(today.getFullYear(), today.getMonth(), 1))
    setTrgtDate(today)
  }

  const handleNextDateBtn = (): void => {
    const newTrgtDate = new Date(
      trgtDate.getFullYear(),
      trgtDate.getMonth(),
      trgtDate.getDate() + 1
    )
    setTrgtDate(newTrgtDate)
    setTrgtMon(newTrgtDate)
  }

  return (
    <header className={styles.header}>
      <p className={styles.year}>{trgtDate.getFullYear()}</p>
      <section className={styles.btnContainers}>
        <section className={styles.btnContainer}>
          <p className={styles.containerTitle}>Task View</p>
          <button
            className={`${styles.squareBtn} ${leftMainState === leftMainStates.schedule ? styles.activeBtn : ''}`}
            onClick={() => setLeftMainState(leftMainStates.schedule)}
          >
            🔔
          </button>
          <button
            className={`${styles.squareBtn} ${leftMainState === leftMainStates.todo ? styles.activeBtn : ''}`}
            onClick={() => setLeftMainState(leftMainStates.todo)}
          >
            ✅
          </button>
          <button
            className={`${styles.squareBtn} ${leftMainState === leftMainStates.memo ? styles.activeBtn : ''}`}
            onClick={() => setLeftMainState(leftMainStates.memo)}
          >
            ✍️
          </button>
        </section>
        <section className={styles.btnContainer}>
          <p className={styles.containerTitle}>Component List</p>
          <button
            className={`${styles.squareBtn} ${isAddOpen ? styles.activeBtn : ''}`}
            onClick={() => setIsAddOpen(true)}
          >
            Open
          </button>
          <button
            className={`${styles.squareBtn} ${!isAddOpen ? styles.activeBtn : ''}`}
            onClick={() => setIsAddOpen(false)}
          >
            Close
          </button>
        </section>
        <section className={styles.btnContainer}>
          <p className={styles.containerTitle}>Date</p>
          <button className={styles.circleBtn} onClick={handlePrevDateBtn}>
            &lt;
          </button>
          <button className={styles.squareBtn} onClick={handleTodayBtn}>
            Today
          </button>
          <button className={styles.circleBtn} onClick={handleNextDateBtn}>
            &gt;
          </button>
        </section>
      </section>
    </header>
  )
}
