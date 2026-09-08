import { useEffect, useState } from 'react'
import { useReels } from './shared/useReels.js'
import Home from './tabs/Home/Home.jsx'
import ReelInput from './tabs/ReelInput/ReelInput.jsx'
import AIChat from './tabs/AIChat/AIChat.jsx'

const TAB_COMPONENTS = {
  home: Home,
  'reel-input': ReelInput,
  'ai-chat': AIChat,
}

const PATH_TO_TAB = {
  '/': 'home',
  '/reel-input': 'reel-input',
  '/ai-chat': 'ai-chat',
}

const TAB_TO_PATH = {
  home: '/',
  'reel-input': '/reel-input',
  'ai-chat': '/ai-chat',
}

function tabFromPath(pathname) {
  return PATH_TO_TAB[pathname] || 'home'
}

export default function App() {
  const [activeTab, setActiveTab] = useState(() => tabFromPath(window.location.pathname))
  const { reels, metrics, addReel, updateReel, deleteReel } = useReels()
  const ActiveTabComponent = TAB_COMPONENTS[activeTab]

  useEffect(() => {
    const onPopState = () => setActiveTab(tabFromPath(window.location.pathname))
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  function navigate(tab) {
    const path = TAB_TO_PATH[tab] ?? '/'
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path)
    }
    setActiveTab(tab)
  }

  return (
    <div style={{ minHeight: '100%' }}>
      <main style={{ maxWidth: 1080, margin: '0 auto', padding: 'var(--space-8) var(--space-6)', position: 'relative' }}>
        <ActiveTabComponent
          reels={reels}
          metrics={metrics}
          addReel={addReel}
          updateReel={updateReel}
          deleteReel={deleteReel}
          onNavigate={navigate}
        />
      </main>
    </div>
  )
}
