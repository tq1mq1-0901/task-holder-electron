import type { AddAny, ConfirmTexts } from '../../../../types'
import styles from './TrushCan.module.css'

interface Props {
  MIMEType: string
  lists: AddAny[]
  setter(lists: AddAny[]): void
  confirm(texts: ConfirmTexts): Promise<boolean>
}

export const TrushCan = (props: Props): React.JSX.Element => {
  const { MIMEType, lists, setter, confirm } = props

  const handleDropTrashCan = async (e: React.DragEvent<HTMLDivElement>): Promise<void> => {
    const trgtEl: AddAny = JSON.parse(e.dataTransfer.getData(MIMEType))

    if (
      !(await confirm({
        title: '削除',
        sentence: `「${trgtEl.title}」を削除しますか？`,
        note: ''
      }))
    )
      return

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
