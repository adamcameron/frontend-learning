import { useRef, useState } from 'react'

export default function App() {
  const startValue = 0
  const ref = useRef(startValue)
  const [renderableRef, setRenderableRef] = useState<number>(startValue)

  function handleIncrement() {
    ref.current++
  }

  function handleUpdate() {
    setRenderableRef(ref.current)
  }

  return (
    <>
      <input
        value={String(renderableRef)}
        readOnly={true}
        data-testid="input"
      />
      <button onClick={handleUpdate} data-testid="update">
        Update
      </button>
      <button onClick={handleIncrement} data-testid="increment">
        Increment
      </button>
    </>
  )
}
