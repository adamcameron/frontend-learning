// copied from https://react.dev/learn/managing-state#passing-data-deeply-with-context and TSified
// (poss in violaton of Meta's (c), but they're not clear on the licensing: the page does mention "open source")

import Heading from './Heading.tsx'
import Section from './Section.tsx'

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Section>
              <Heading>H5</Heading>
              <Heading>H5</Heading>
              <Heading>H5</Heading>
              <Section>
                <Heading>H6</Heading>
                <Heading>H6</Heading>
                <Heading>H6</Heading>
              </Section>
            </Section>
          </Section>
        </Section>
      </Section>
    </Section>
  )
}
