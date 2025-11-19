import { useState } from 'react'

export default function ErrorProneComponent() {
  const [isItSafe, setIsItSafe] = useState(true)
  function handleClick() {
    setIsItSafe(false)
  }

  if (isItSafe) {
    return (
      <button onClick={handleClick} data-testid="button">
        Break things
      </button>
    )
  }
  throw Error('Oopsy')
}
