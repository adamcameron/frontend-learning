// copied from https://react.dev/learn/managing-state#extracting-state-logic-into-a-reducer and TSified
// (poss in violation of Meta's (c), but they're not clear on the licensing: the page does mention "open source")

import { useState } from 'react'

export default function AddTask({
  onAddTask,
}: {
  onAddTask: (text: string) => void
}) {
  const [text, setText] = useState('')
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
          onAddTask(text)
        }}
      >
        Add
      </button>
    </>
  )
}
