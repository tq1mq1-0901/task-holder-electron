import styles from './Text.module.css'

interface Props {
  text: string
  textSetter(str: string): void
  children: string
  isRequired: boolean
  isText: boolean
}

export const Text = (props: Props): React.JSX.Element => {
  const { text, textSetter, children, isRequired, isText } = props

  return (
    <label className={styles.label}>
      <p className={`formTitle ${isRequired ? 'requiredAlert' : ''}`}>{children}</p>
      {isText && (
        <input
          type="text"
          name="schdlFormText"
          value={text}
          onChange={(e) => textSetter(e.currentTarget.value)}
        />
      )}
      {!isText && (
        <textarea
          name="SchdlFormTextarea"
          value={text}
          onChange={(e) => textSetter(e.currentTarget.value)}
          maxLength={120}
        ></textarea>
      )}
    </label>
  )
}
