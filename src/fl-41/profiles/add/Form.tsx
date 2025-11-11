import { useState } from 'react'
import React from 'react'

export default function Form() {
  type unsavedMugshot = { src: string; alt: string }
  const emptyMugshot = {
    src: '',
    alt: '',
  }
  const [mugshot, setMugshot] = useState<unsavedMugshot>(emptyMugshot)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const fieldName = e.target.name
    setMugshot({ ...mugshot, [fieldName]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log(mugshot)
    setMugshot(emptyMugshot)
  }

  function isFormDisabled() {
    return mugshot.src.length === 0 || mugshot.alt.length === 0
  }

  return (
    <form onSubmit={handleSubmit} data-testid="form">
      Image URL:
      <input
        name="src"
        value={mugshot.src}
        placeholder="eg: /images/shocked.png"
        onChange={handleChange}
        required={true}
        data-testid="input-src"
      />
      <br />
      <samp>alt</samp> text:
      <input
        name="alt"
        value={mugshot.alt}
        onChange={handleChange}
        required={true}
        data-testid="input-alt"
      />
      <br />
      <button disabled={isFormDisabled()} data-testid="submitButton">
        Submit
      </button>
    </form>
  )
}
