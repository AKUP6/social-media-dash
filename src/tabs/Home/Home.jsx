import { accountName } from '../../shared/config.js'
import ViewsCard from './components/ViewsCard.jsx'
import FollowerCard from './components/FollowerCard.jsx'
import ChartPlaceholder from './components/ChartPlaceholder.jsx'
import TopReelsBox from './components/topreels/TopReelsBox.jsx'
import GenerateIdeasButton from './components/GenerateIdeasButton.jsx'

export default function Home({ metrics, onNavigate }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div
        className="fade-in-up"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          opacity: 0,
          animationDelay: '0ms',
          animationFillMode: 'both',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          Hi, {accountName}
        </h1>
        <GenerateIdeasButton onClick={() => onNavigate('ai-chat')} />
      </div>

      <div style={{ height: 1, background: 'var(--line)' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <span
          className="fade-in-up"
          style={{
            display: 'inline-block',
            fontSize: 36,
            fontWeight: 700,
            color: 'var(--primary-deep)',
            opacity: 0,
            animationDelay: '75ms',
            animationFillMode: 'both',
          }}
        >
          Dashboard
        </span>
        <div
          className="fade-in-up"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-5)',
            opacity: 0,
            animationDelay: '150ms',
            animationFillMode: 'both',
          }}
        >
          <ViewsCard monthViews={metrics.monthViews} />
          <FollowerCard followerIncrease={metrics.followerIncrease} />
          <ChartPlaceholder label="Views trend" values={metrics.topReels.map((reel) => reel.views)} />
          <ChartPlaceholder label="Analytics" />
        </div>
        <div
          className="fade-in-up"
          style={{ opacity: 0, animationDelay: '300ms', animationFillMode: 'both' }}
        >
          <TopReelsBox metrics={metrics} onNavigateToReelInput={() => onNavigate('reel-input')} />
        </div>
      </div>
    </div>
  )
}
