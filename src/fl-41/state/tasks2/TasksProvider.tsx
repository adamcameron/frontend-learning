// copied from https://react.dev/learn/managing-state#scaling-up-with-reducer-and-context and TSified
// (poss in violation of Meta's (c), but they're not clear on the licensing: the page does mention "open source")
import { useReducer } from 'react'
import React from 'react'
import {
  tasksReducer,
  TasksContext,
  TasksDispatchContext,
} from './tasksContext.tsx'

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks)

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>{children}</TasksDispatchContext>
    </TasksContext>
  )
}

const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false },
]
