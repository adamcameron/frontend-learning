// copied from https://react.dev/learn/reusing-logic-with-custom-hooks and TSified
// (poss in violation of Meta's (c), but they're not clear on the licensing: the page does mention "open source")

import useOnlineStatus from '../useOnlineStatus.tsx'

export default function SaveButton() {
  const isOnline = useOnlineStatus()

  function handleSaveClick() {
    console.log('✅ Progress saved')
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting…'}
    </button>
  )
}
