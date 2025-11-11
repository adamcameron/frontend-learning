// copied from https://react.dev/learn/managing-state#scaling-up-with-reducer-and-context and TSified
// (poss in violaton of Meta's (c), but they're not clear on the licensing: the page does mention "open source")

import { useState } from 'react'
import { useTasksDispatch } from './tasksContext.tsx'

export default function AddTask() {
  const [text, setText] = useState('')
  const dispatch = useTasksDispatch()
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('')
          dispatch({
            type: 'added',
            id: nextId++,
            text: text,
          })
        }}
      >
        Add
      </button>
    </>
  )
}

let nextId = 3
