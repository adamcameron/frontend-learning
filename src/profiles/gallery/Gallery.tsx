import React from 'react'
import { useQuery } from '@tanstack/react-query'
import './gallery.css'

type Mugshot = { id: number; src: string; alt: string }

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
  const { isPending, isError, data, error } = useQuery<Mugshot[]>({
    queryKey: ['ALL_PROFILES'],
    queryFn: fetchProfiles,
  })

  if (isPending) {
    return wrapInGallery('Loading...')
  }
  if (isError) {
    return wrapInGallery(
      <span data-testid="gallery-error">Error: {error.message}</span>
    )
  }

  return wrapInGallery(
    <>
      <h1>Amazing scientists</h1>
      {data.map((mugshot: Mugshot) => (
        <Profile {...mugshot} key={mugshot.id} />
      ))}
    </>
  )
}

function wrapInGallery(children: React.ReactNode) {
  return <section data-testid="gallery">{children}</section>
}

async function fetchProfiles(): Promise<Mugshot[]> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profiles`)
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`)
  }

  // out of scope: proper validation that it's returning a Mugshot[]

  return response.json() as Promise<Mugshot[]>
}
