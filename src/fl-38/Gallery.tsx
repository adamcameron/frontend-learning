import { useEffect, useState } from 'react'
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
  const [profiles, setProfiles] = useState<Mugshot[]>([])
  useEffect(() => {
    let ignore = false
    async function fetchProfiles() {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/profiles`
      )
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }
      const body: Mugshot[] = (await response.json()) as unknown as Mugshot[]
      if (!ignore) {
        setProfiles(body)
      }
    }
    fetchProfiles().catch((e) => {
      console.error(e)
    })
    return () => {
      ignore = true
    }
  }, [])
  return (
    <section data-testid="gallery">
      <h1>Amazing scientists</h1>
      {profiles.map((mugshot: Mugshot) => (
        <Profile {...mugshot} key={mugshot.id} />
      ))}
      <br />
      <a href="/pages/fl-41/profiles/add/">Add new profile</a>
    </section>
  )
}
