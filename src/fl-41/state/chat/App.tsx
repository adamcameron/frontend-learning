// copied from https://react.dev/learn/managing-state#sharing-state-between-components and TSified
// (poss in violaton of Meta's (c), but they're not clear on the licensing: the page does mention "open source")

import { useState } from 'react'
import Chat from './Chat.tsx'
import ContactList from './ContactList.tsx'

export default function Messenger() {
  const [to, setTo] = useState(contacts[0])
  return (
    <div>
      <ContactList
        contacts={contacts}
        onSelect={(contact: contact) => setTo(contact)}
      />
      <Chat key={to.email} contact={to} />
    </div>
  )
}

export type contact = { name: string; email: string }
const contacts = [
  { name: 'Taylor', email: 'taylor@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' },
]
