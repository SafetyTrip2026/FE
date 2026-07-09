import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Play,
  ShieldCheck,
  ThermometerSun,
  Waves,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import './App.css'
import { defaultQuestion, runMockSafetyScenario } from './services/mockSafetyTrip'
import type { Citation, ParsedTrip, RiskStat, SafetyEvent } from './types'

const chartColors = {
  폭염: '#dc2626',
  호우: '#2563eb',
  태풍: '#0f766e',
}

function App() {
  const [question, setQuestion] = useState(defaultQuestion)
  const [parsed, setParsed] = useState<ParsedTrip | null>(null)
  const [stats, setStats] = useState<RiskStat[]>([])
  const [answer, setAnswer] = useState('')
  const [citations, setCitations] = useState<Citation[]>([])
  const [events, setEvents] = useState<SafetyEvent[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [done, setDone] = useState(false)

  const topRisk = useMemo(() => stats[0], [stats])

  const handleEvent = (event: SafetyEvent) => {
    setEvents((current) => [...current, event])

    if (event.type === 'parsed') setParsed(event.payload)
    if (event.type === 'stats') setStats(event.payload)
    if (event.type === 'token') setAnswer((current) => current + event.payload)
    if (event.type === 'citation') {
      setCitations((current) => [...current, event.payload])
    }
    if (event.type === 'done') setDone(true)
  }

  const runScenario = async () => {
    setParsed(null)
    setStats([])
    setAnswer('')
    setCitations([])
    setEvents([])
    setDone(false)
    setIsRunning(true)

    try {
      await runMockSafetyScenario(question, handleEvent)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <ShieldCheck aria-hidden="true" />
          <span>SafetyTrip</span>
        </div>
        <div className={done ? 'status done' : 'status'}>
          {done ? <CheckCircle2 aria-hidden="true" /> : <AlertTriangle aria-hidden="true" />}
          <span>{done ? 'Mock scenario passed' : 'Day 2 MVP'}</span>
        </div>
      </header>

      <section className="workspace">
        <div className="query-panel">
          <div className="panel-heading">
            <MapPin aria-hidden="true" />
            <h1>여행 안전 리포트</h1>
          </div>

          <label htmlFor="question">질문</label>
          <textarea
            id="question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            rows={4}
          />

          <button type="button" onClick={runScenario} disabled={isRunning}>
            <Play aria-hidden="true" />
            <span>{isRunning ? '분석 중' : '데모 실행'}</span>
          </button>

          <div className="parsed-grid" aria-label="parsed trip">
            <div>
              <span>지역</span>
              <strong>{parsed?.region ?? '-'}</strong>
            </div>
            <div>
              <span>시기</span>
              <strong>{parsed ? `${parsed.month}월` : '-'}</strong>
            </div>
            <div>
              <span>동반자</span>
              <strong>{parsed?.companions.join(', ') ?? '-'}</strong>
            </div>
          </div>
        </div>

        <div className="result-panel">
          <div className="risk-summary">
            <div>
              <span>상위 위험</span>
              <strong>{topRisk?.type ?? '-'}</strong>
            </div>
            <ThermometerSun aria-hidden="true" />
          </div>

          <div className="chart-box">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stats} margin={{ top: 16, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="type" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(15, 23, 42, 0.06)' }}
                  formatter={(value, _name, item) => [
                    `${value}건 (${item.payload.ratio}%)`,
                    '발령 이력',
                  ]}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {stats.map((item) => (
                    <Cell key={item.type} fill={chartColors[item.type]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <section className="answer-box" aria-label="answer">
            <div className="answer-heading">
              <Waves aria-hidden="true" />
              <h2>응답</h2>
            </div>
            <p>{answer || '데모를 실행하면 mock 응답이 스트리밍됩니다.'}</p>
          </section>

          <div className="citation-list">
            {citations.map((citation) => (
              <span key={citation.sourceId}>
                {citation.label} · {citation.sourceId}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="event-strip" aria-label="event trace">
        {events.map((event, index) => (
          <span key={`${event.type}-${index}`}>{event.type}</span>
        ))}
      </section>
    </main>
  )
}

export default App

