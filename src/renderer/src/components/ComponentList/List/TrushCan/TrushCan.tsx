import type { AddAny } from '../../../../types'
import styles from './TrushCan.module.css'

interface Props {
  MIMEType: string
  lists: AddAny[]
  setter(lists: AddAny[]): void
}

export const TrushCan = (props: Props): React.JSX.Element => {
  const { MIMEType, lists, setter } = props

  const handleDropTrashCan = (e: React.DragEvent<HTMLDivElement>): void => {
    if (!confirm('Delete this item?')) return

    const trgtEl: AddAny = JSON.parse(e.dataTransfer.getData(MIMEType))
    const newLists = lists.filter((el) => el.id !== trgtEl.id)
    setter(newLists)
  }

  return (
    <div
      className={styles.trashCan}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDropTrashCan}
    >
      <div className={styles.shadow}></div>
      🗑️
    </div>
  )
}
