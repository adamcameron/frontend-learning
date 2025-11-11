// copied from https://react.dev/learn/managing-state#extracting-state-logic-into-a-reducer and TSified
// (poss in violation of Meta's (c), but they're not clear on the licensing: the page does mention "open source")

import { useState } from 'react'
import type { task } from './App.tsx'

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask,
}: {
  tasks: task[]
  onChangeTask: (task: task) => void
  onDeleteTask: (taskId: number) => void
}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  )
}

function Task({
  task,
  onChange,
  onDelete,
}: {
  task: task
  onChange: (task: task) => void
  onDelete: (taskId: number) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  let taskContent
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            })
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    )
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    )
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          })
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  )
}
