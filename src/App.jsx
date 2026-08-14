import { useState } from 'react'
import TabNav from './shared/TabNav.jsx'
import { useReels } from './shared/useReels.js'
import Home from './tabs/Home/Home.jsx'
import ReelInput from './tabs/ReelInput/ReelInput.jsx'
import AIChat from './tabs/AIChat/AIChat.jsx'

const TAB_COMPONENTS = {
  home: Home,
  'reel-input': ReelInput,
  'ai-chat': AIChat,
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const { reels, metrics, addReel } = useReels()
  const ActiveTabComponent = TAB_COMPONENTS[activeTab]

  return (
    <div style={{ minHeight: '100%' }}>
      <TabNav activeTab={activeTab} onChange={setActiveTab} />
      <main style={{ padding: 24 }}>
        <ActiveTabComponent reels={reels} metrics={metrics} addReel={addReel} />
      </main>
    </div>
  )
}
