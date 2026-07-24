import React, { useRef, useState } from 'react'
import type { AddTodo, ConfirmTexts } from '../../../../types'
import styles from './Todo.module.css'
import { TrushCan } from '../TrushCan/TrushCan'

interface Props {
  addTodos: AddTodo[]
  setAddTodos(addTodos: AddTodo[]): void
  confirm(texts: ConfirmTexts): Promise<boolean>
}

export const Todo = ({ addTodos, setAddTodos, confirm }: Props): React.JSX.Element => {
  const [inputValue, setInputValue] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)
  const MIMEType = 'add/todo'

  const todoLists = addTodos.map((todo) => (
    <li
      key={todo.id}
      className={`gray gray-container ${styles.todo}`}
      draggable
      onDragStart={(e) => e.dataTransfer.setData(MIMEType, JSON.stringify(todo))}
    >
      {todo.title}
    </li>
  ))

  const resetInput = (): void => {
    setInputValue('')
    inputRef.current!.focus()
  }
  const handleSubmitButton = (e: React.SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault()
    if (inputValue.trim() === '') {
      resetInput()
      return
    }
    setAddTodos([...addTodos, { id: crypto.randomUUID(), title: inputValue }])
    resetInput()
  }

  return (
    <section className={styles.container}>
      <section className={styles.todoSec}>
        <section className={styles.head}>
          <p className={styles.headTitle}>
            <span className={styles.symbol}>✅</span>
            <span className={styles.title}>To-Do</span>
          </p>
          <form className={styles.form} onSubmit={handleSubmitButton}>
            <input
              type="text"
              className={styles.formInp}
              name="todoTitle"
              value={inputValue}
              onChange={(e) => setInputValue(e.currentTarget.value)}
              ref={inputRef}
              maxLength={15}
            />
            <button className={styles.formBtn}>Add</button>
          </form>
        </section>
        <ul className={styles.todoList}>{todoLists}</ul>
      </section>
      <TrushCan MIMEType={MIMEType} lists={addTodos} setter={setAddTodos} confirm={confirm} />
    </section>
  )
}
