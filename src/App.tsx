import ChangeSettings from '~/components/change-settings/change-settings'
import Stats from '~/components/stats/stats'

import StartStopBot from './components/start-stop-bot/start-stop-bot'

export default function App() {
  return (
    <main className="mx-auto max-w-xl space-y-4 p-4">
      <Stats />

      <StartStopBot />

      <ChangeSettings />

    </main>
  )
}
