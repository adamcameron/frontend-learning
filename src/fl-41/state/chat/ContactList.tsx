// copied from https://react.dev/learn/managing-state#sharing-state-between-components and TSified
// (poss in violation of Meta's (c), but they're not clear on the licensing: the page does mention "open source")

import type { contact } from './App.tsx'

export default function ContactList({
  contacts,
  onSelect,
}: {
  contacts: contact[]
  onSelect: (contact: contact) => void
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact: contact) => (
          <li key={contact.email}>
            <button
              onClick={() => {
                onSelect(contact)
              }}
            >
              {contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
