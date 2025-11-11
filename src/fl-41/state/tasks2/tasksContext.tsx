import { createContext, useContext } from 'react'

export type task = { id: number; text: string; done: boolean }

type dispatchAction =
  | { type: 'added'; id: number; text: string }
  | { type: 'changed'; task: task }
  | { type: 'deleted'; id: number }

export const TasksContext = createContext<task[]>([])

export const TasksDispatchContext = createContext<
  (action: dispatchAction) => void
>(() => {
  throw new Error('TasksDispatch must be used within TasksProvider')
})

export function useTasks() {
  return useContext(TasksContext)
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext)
}

export function tasksReducer(tasks: task[], action: dispatchAction) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ]
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task
        } else {
          return t
        }
      })
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id)
    }
    // unreachable with TS
    /*default: {
      throw Error('Unknown action: ' + action.type)
    }*/
  }
}
