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
  const profiles: Mugshot[] = [
    { src: '/images/happy.png', alt: 'Happy person' },
    { src: '/images/neutral.png', alt: 'Neutral person' },
    { src: '/images/sad.png', alt: 'Sad person' },
  ]
  return (
    <section data-testid="gallery">
      <h1>Amazing scientists</h1>
      {profiles.map((profile: Mugshot, i: number) => (
        <Profile src={profile.src} alt={profile.alt} key={i} />
      ))}
    </section>
  )
}
