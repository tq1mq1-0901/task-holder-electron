import { createPortal } from 'react-dom'
import type { AddTemplate } from '../../../../../types'
import styles from './ListItem.module.css'
import { useState } from 'react'
import { ItemDetail } from './ItemDetail/ItemDetail'

interface Props {
  MIMEType: string
  template: AddTemplate
  setModifiedTemplate(addTemplateOrNull: AddTemplate | null): void
  setIsTemplateAddable(bool: boolean): void
}

export const ListItem = (props: Props): React.JSX.Element => {
  const { MIMEType, template, setModifiedTemplate, setIsTemplateAddable } = props

  const [canShowDetails, setCanShowDetails] = useState(false)

  return (
    <li>
      <div
        className={`gray gray-container ${styles.template}`}
        draggable
        onDragStart={(e) => e.dataTransfer.setData(MIMEType, JSON.stringify(template))}
        onClick={() => setCanShowDetails(true)}
      >
        {template.title}
      </div>
      {canShowDetails &&
        createPortal(
          <ItemDetail
            template={template}
            setCanShowDetails={setCanShowDetails}
            setModifiedTemplate={setModifiedTemplate}
            setIsTemplateAddable={setIsTemplateAddable}
          />,
          document.body
        )}
    </li>
  )
}
