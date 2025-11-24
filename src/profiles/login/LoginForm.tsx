import { type ChangeEvent, type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { supabaseClient } from '../lib/supabase.ts'
import { loginCredentials } from '../lib/testCredentials.ts'

type User = { email: string; password: string }
export default function LoginForm() {
  const [user, setUser] = useState<User>({ email: '', password: '' })
  const [loginStatus, setLoginStatus] = useState('')
  const navigate = useNavigate()

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const fieldName = e.target.name
    setLoginStatus('')
    setUser({ ...user, [fieldName]: e.target.value })
  }

  function isFormDisabled() {
    return user.email.length === 0 || user.password.length === 0
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    mutation.mutate(user)
  }

  const mutation = useMutation({
    mutationFn: authenticate,
    onSuccess: () => {
      void navigate('/profiles/gallery/')
    },
    onError: () => {
      setLoginStatus('Login failed')
    },
  })

  function handleCheat() {
    setUser(loginCredentials)
  }

  return (
    <form onSubmit={handleSubmit} data-testid="form">
      Email:
      <input
        name="email"
        value={user.email}
        placeholder="your.name@example.com"
        onChange={handleChange}
        required={true}
        data-testid="input-email"
      />
      <br />
      Password:
      <input
        name="password"
        value={user.password}
        onChange={handleChange}
        required={true}
        data-testid="input-password"
      />
      <br />
      <button onClick={handleCheat} type="button">
        Cheat
      </button>
      &nbsp;
      <button disabled={isFormDisabled()} data-testid="submitButton">
        Login
      </button>
      <div className="status-box" data-testid="statusBox">
        {loginStatus}
      </div>
    </form>
  )
}

async function authenticate(user: User) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: user.email,
    password: user.password,
  })
  if (error === null) {
    return Promise.resolve(data)
  }
  void (await supabaseClient.auth.signOut())
  return Promise.reject(error)
}
