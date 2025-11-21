import { type ChangeEvent, type FormEvent, useState } from 'react'
import { StatusCodes } from 'http-status-codes'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type Mugshot, type UnsavedMugshot } from '../mugshot.tsx'
import { supabaseClient } from '../lib/supabase.ts'

import './styles.css'

const StatusMessages = {
  CLIENT_ERROR: 'Unexpected data validation error',
  SERVER_ERROR: 'Unexpected server error',
  NETWORK_ERROR: 'Network error when making request',
}

export default function Form() {
  const mutation = useMutation({
    mutationFn: addProfile,
    onMutate: () => {
      setPostStatus('') // Clear any previous error
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ALL_PROFILES'] })
      void navigate('/profiles/gallery/')
    },
    onError: (e) => {
      if (e instanceof UnsuccessfulRequestError) {
        setPostStatus(
          e.message === String(StatusCodes.BAD_REQUEST)
            ? StatusMessages.CLIENT_ERROR
            : StatusMessages.SERVER_ERROR
        )
        return
      }
      setPostStatus(StatusMessages.NETWORK_ERROR)
    },
  })
  const queryClient = useQueryClient()

  const [mugshot, setMugshot] = useState<UnsavedMugshot>({ src: '', alt: '' })
  const [postStatus, setPostStatus] = useState<string>('')
  const navigate = useNavigate()

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const fieldName = e.target.name
    setMugshot({ ...mugshot, [fieldName]: e.target.value })
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    mutation.mutate(mugshot)
  }

  function isFormDisabled() {
    return (
      mutation.isPending || mugshot.src.length === 0 || mugshot.alt.length === 0
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

async function addProfile(mugshot: UnsavedMugshot): Promise<Mugshot> {
  const {
    data,
    status,
  }: { data: Mugshot[] | null; error: unknown; status: number } =
    await supabaseClient.from('profiles').insert(mugshot).select()

  if (status !== Number(StatusCodes.CREATED)) {
    throw new UnsuccessfulRequestError(String(status))
  }
  if (data === null || data.length !== 1) {
    throw new UnsuccessfulRequestError(
      String(StatusCodes.INTERNAL_SERVER_ERROR)
    )
  }

  return Promise.resolve(data[0])
}

class UnsuccessfulRequestError extends Error {}
