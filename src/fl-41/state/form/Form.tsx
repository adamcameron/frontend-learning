//  copied from https://react.dev/learn/managing-state#reacting-to-input-with-state & TSified
// (poss in violation of Meta's (c), but they're not clear on the licensing: the page does mention "open source")

import { useState, type ChangeEvent, type FormEvent } from 'react'

const STATUS = {
  IDLE: 'idle',
  SUBMITTED: 'submitted',
  SUCCESS: 'success',
}

type status = (typeof STATUS)[keyof typeof STATUS]

export default function Form() {
  const [answer, setAnswer] = useState<string>('')
  const [error, setError] = useState<Error | null>(null)
  const [status, setStatus] = useState<status>(STATUS.IDLE)

  function handleTextareaChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setAnswer(e.target.value)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus(STATUS.SUBMITTED)
    try {
      await submitForm(answer)
      setStatus(STATUS.SUCCESS)
    } catch (err) {
      setStatus(STATUS.IDLE)
      setError(err instanceof Error ? err : new Error(String(err)))
    }
  }

  if (status === STATUS.SUCCESS) {
    return <h1>That's right!</h1>
  }
  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form onSubmit={(e) => void handleSubmit(e)}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === STATUS.SUBMITTED}
        />
        <br />
        <button disabled={answer.length === 0 || status === STATUS.SUBMITTED}>
          Submit
        </button>
        {error !== null && <p className="Error">{error.message}</p>}
      </form>
    </>
  )
}

function submitForm(answer: string) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldError = answer.trim().toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'))
        return
      }
      resolve(null)
    }, 1500)
  })
}
