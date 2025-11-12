import { useState } from 'react'
import React from 'react'
import { StatusCodes } from 'http-status-codes'
import './styles.css'

const StatusMessages = {
  CLIENT_ERROR: 'Unexpected data validation error',
  SERVER_ERROR: 'Unexpected server error',
  NETWORK_ERROR: 'Network error when making request',
}

const FormStatuses = {
  ACTIVE: 'ACTIVE',
  PROCESSING: 'PROCESSING',
}

type FormStatus = (typeof FormStatuses)[keyof typeof FormStatuses]

export default function Form() {
  type unsavedMugshot = { src: string; alt: string }
  const emptyMugshot = {
    src: '',
    alt: '',
  }
  const [mugshot, setMugshot] = useState<unsavedMugshot>(emptyMugshot)
  const [postStatus, setPostStatus] = useState<string>('')
  const [formStatus, setFormStatus] = useState<FormStatus>(FormStatuses.ACTIVE)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const fieldName = e.target.name
    setMugshot({ ...mugshot, [fieldName]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormStatus(FormStatuses.PROCESSING)
    fetch(`${import.meta.env.VITE_API_BASE_URL}/profiles`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(mugshot),
    })
      .then((response) => {
        if (!response.ok) {
          setPostStatus(
            response.status === StatusCodes.BAD_REQUEST
              ? StatusMessages.CLIENT_ERROR
              : StatusMessages.SERVER_ERROR
          )
          setFormStatus(FormStatuses.ACTIVE)
          return
        }
        window.location.href = '/pages/profiles/gallery/'
      })
      .catch((e) => {
        setPostStatus(StatusMessages.NETWORK_ERROR)
        setFormStatus(FormStatuses.ACTIVE)
      })
  }

  function isFormDisabled() {
    return (
      formStatus === FormStatuses.PROCESSING ||
      mugshot.src.length === 0 ||
      mugshot.alt.length === 0
    )
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
      <div className="status-box" data-testid="statusBox">
        {postStatus}
      </div>
      <button disabled={isFormDisabled()} data-testid="submitButton">
        Submit
      </button>
    </form>
  )
}
