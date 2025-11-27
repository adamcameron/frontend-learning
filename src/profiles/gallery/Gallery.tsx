import { type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import './gallery.css'
import { type Mugshot } from '../mugshot.tsx'
import { supabaseClient } from '../../lib/supabase.ts'
import { StatusCodes } from 'http-status-codes'

function Profile({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      width="150px"
      className="small-h-gap"
      data-testid="profile"
    />
  )
}

export default function Gallery() {
  const isAuthenticated = useQuery<boolean>({
    queryKey: ['AUTHENTICATED_USER'],
    queryFn: checkAuthentication,
  })

  const mugshots = useQuery<Mugshot[]>({
    queryKey: ['ALL_PROFILES'],
    queryFn: fetchProfiles,
    enabled: isAuthenticated.data === true,
  })

  if (isAuthenticated.isPending === true) {
    return <span data-testid="gallery-status">Authenticating...</span>
  }

  if (isAuthenticated.data !== true) {
    return <span data-testid="gallery-error">Ain't logged-in, pal</span>
  }

  if (mugshots.isPending) {
    return wrapInGallery('Loading...')
  }

  if (mugshots.isError) {
    return wrapInGallery(
      <span data-testid="gallery-error">Error: {mugshots.error.message}</span>
    )
  }

  return wrapInGallery(
    <>
      <h1>Amazing scientists</h1>
      {mugshots.data.map((mugshot: Mugshot) => (
        <Profile {...mugshot} key={mugshot.id} />
      ))}
    </>
  )
}

function wrapInGallery(children: ReactNode) {
  return <section data-testid="gallery">{children}</section>
}

async function fetchProfiles(): Promise<Mugshot[]> {
  const { data, status }: { data: Mugshot[] | null; status: number } =
    await supabaseClient
      .from('profiles')
      .select()
      .overrideTypes<Array<Mugshot>, { merge: false }>()

  if (status !== Number(StatusCodes.OK)) {
    throw new Error(`Response status: ${status}`)
  }

  if (data === null) {
    throw new Error('Unexpected logic exception')
  }

  // out of scope: proper validation that it's returning a Mugshot[]

  return data
}

async function checkAuthentication(): Promise<boolean> {
  const userAuthStatus = await supabaseClient.auth.getUser()
  return userAuthStatus.error === null
}
