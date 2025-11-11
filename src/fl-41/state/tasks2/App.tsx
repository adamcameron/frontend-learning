// copied from https://react.dev/learn/managing-state#scaling-up-with-reducer-and-context and TSified
// (poss in violaton of Meta's (c), but they're not clear on the licensing: the page does mention "open source")

import AddTask from './AddTask.tsx'
import TaskList from './TaskList.tsx'
import { TasksProvider } from './TasksProvider.tsx'

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Day off in Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  )
}
