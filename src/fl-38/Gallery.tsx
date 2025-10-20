import { useEffect, useState } from 'react'

type Mugshot = { src: string; alt: string }

function Profile({ src, alt }: Mugshot) {
  return (
    <>
      <img
        src={src}
        alt={alt}
        width="150px"
        className="small-h-gap"
        data-testid="profile"
      />
      &nbsp;
    </>
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
      {profiles.map((profile: Mugshot, i: number) => (
        <Profile src={profile.src} alt={profile.alt} key={i} />
      ))}
    </section>
  )
}
