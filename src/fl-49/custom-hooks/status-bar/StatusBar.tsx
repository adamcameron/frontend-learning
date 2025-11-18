// copied from https://react.dev/learn/reusing-logic-with-custom-hooks and TSified
// (poss in violation of Meta's (c), but they're not clear on the licensing: the page does mention "open source")

import useOnlineStatus from '../useOnlineStatus.tsx'

export default function StatusBar() {
  const isOnline = useOnlineStatus()

  return (
    <h1 data-testid="status-bar">
      {isOnline ? '✅ Online' : '❌ Disconnected'}
    </h1>
  )
}
