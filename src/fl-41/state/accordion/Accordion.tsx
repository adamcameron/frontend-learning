// copied from https://react.dev/learn/managing-state#sharing-state-between-components and TSified
// (poss in violation of Meta's (c), but they're not clear on the licensing: the page does mention "open source")

import type { ReactNode } from 'react'
import { useState } from 'react'

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState<number>(0)

  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        With a population of about 2 million, Almaty is Kazakhstan's largest
        city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for
        "apple" and is often translated as "full of apples". In fact, the region
        surrounding Almaty is thought to be the ancestral home of the apple, and
        the wild <i lang="la">Malus sieversii</i> is considered a likely
        candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  )
}

type panelParams = {
  title: string
  children: ReactNode
  isActive: boolean
  onShow: () => void
}

function Panel({ title, children, isActive, onShow }: panelParams) {
  return (
    <section
      className="panel"
      style={{
        border: '1px solid black',
      }}
    >
      <h3>{title}</h3>
      {isActive ? <p>{children}</p> : <button onClick={onShow}>Show</button>}
    </section>
  )
}
