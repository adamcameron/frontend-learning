// copied from https://react.dev/learn/managing-state#extracting-state-logic-into-a-reducer and TSified
// (poss in violation of Meta's (c), but they're not clear on the licensing: the page does mention "open source")

import { useReducer } from 'react'

import AddTask from './AddTask.tsx'
import TaskList from './TaskList.tsx'

export type task = { id: number; text: string; done: boolean }

export type dispatchAction =
  | { type: 'added'; id: number; text: string }
  | { type: 'changed'; task: task }
  | { type: 'deleted'; id: number }

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks)

  function handleAddTask(text: string) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    })
  }

  function handleChangeTask(task: task) {
    dispatch({
      type: 'changed',
      task: task,
    })
  }

  function handleDeleteTask(taskId: number) {
    dispatch({
      type: 'deleted',
      id: taskId,
    })
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  )
}

function tasksReducer(tasks: task[], action: dispatchAction): task[] {
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
    // not needed with TS as it's unreachable
    /*default: {
      throw Error('Unknown action: ' + action.type)
    }*/
  }
}

let nextId = 3

const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false },
]
