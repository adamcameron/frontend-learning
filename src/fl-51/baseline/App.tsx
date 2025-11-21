import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

type Instrument = { id: number; name: string }

const supabase = createClient(
  String(import.meta.env.VITE_SUPABASE_URL),
  String(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)
)

export default function App() {
  const [instruments, setInstruments] = useState<Instrument[]>([])

  async function getInstruments() {
    let { data } = await supabase
      .from('instruments')
      .select()
      .overrideTypes<Array<Instrument>, { merge: false }>()

    if (data === null) {
      data = []
    }

    setInstruments(data)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void getInstruments()
  }, [])

  return (
    <ul>
      {instruments.map((instrument) => (
        <li key={instrument.name}>{instrument.name}</li>
      ))}
    </ul>
  )
}
