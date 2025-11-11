// copied from https://react.dev/learn/managing-state#sharing-state-between-components and TSified
// (poss in violation of Meta's (c), but they're not clear on the licensing: the page does mention "open source")

import { useState } from 'react'
import type { contact } from './App.tsx'

export default function Chat({ contact }: { contact: contact }) {
  const [text, setText] = useState('')
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  )
}
