import { useEffect, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  Calendar,
  CheckCircle2,
  CloudRain,
  MapPin,
  Play,
  Shield,
  Thermometer,
  Users,
  Wind,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CITATIONS,
  DEFAULT_QUESTION,
  FULL_ANSWER,
  PARSED_CARDS,
  RISK_DATA,
  TRACE_EVENTS,
} from "../mocks/safetyTripMock";

const iconMap = {
  calendar: Calendar,
  heat: Thermometer,
  map: MapPin,
  rain: CloudRain,
  users: Users,
  wind: Wind,
};

function RiskTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-white/70 bg-white/90 px-3 py-2 text-sm text-[#1a2940] shadow-sm backdrop-blur">
      <span className="font-semibold">{payload[0].payload.name}</span>
      <span className="ml-2" style={{ color: payload[0].color }}>
        {payload[0].value}점
      </span>
    </div>
  );
}

export default function App() {
  const [question, setQuestion] = useState(DEFAULT_QUESTION);
  const [ran, setRan] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [displayedAnswer, setDisplayedAnswer] = useState("");
  const [showTrace, setShowTrace] = useState(false);
  const streamRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleRun = () => {
    if (streaming) return;

    setRan(false);
    setDisplayedAnswer("");
    setShowTrace(false);

    window.setTimeout(() => {
      setRan(true);
      setStreaming(true);
      let index = 0;

      streamRef.current = window.setInterval(() => {
        index += 7;
        setDisplayedAnswer(FULL_ANSWER.slice(0, index));

        if (index >= FULL_ANSWER.length && streamRef.current) {
          window.clearInterval(streamRef.current);
          setDisplayedAnswer(FULL_ANSWER);
          setStreaming(false);
          setShowTrace(true);
        }
      }, 16);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) window.clearInterval(streamRef.current);
    };
  }, []);

  const renderAnswer = (text: string) =>
    text.split("\n").map((line, index) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <p key={index} className="mb-1 mt-4 text-sm font-semibold text-[#1a2940]">
            {line.replace(/\*\*/g, "")}
          </p>
        );
      }

      if (line.startsWith("-")) {
        return (
          <p key={index} className="mb-1 pl-3 text-sm leading-relaxed text-[#2c4a6b]">
            {line}
          </p>
        );
      }

      if (line.trim() === "") return <div key={index} className="h-1" />;

      return (
        <p key={index} className="text-sm leading-relaxed text-[#2c4a6b]">
          {line}
        </p>
      );
    });

  return (
    <div
      className="min-h-screen w-full text-[#1a2940]"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(125, 211, 252, 0.28), transparent 30%), radial-gradient(circle at bottom right, rgba(45, 212, 191, 0.18), transparent 32%), linear-gradient(180deg, #f7fbff 0%, #eef7ff 100%)",
        fontFamily: "'Noto Sans KR', system-ui, sans-serif",
      }}
    >
      <nav className="sticky top-0 z-30 flex items-center justify-between border-b border-white/60 bg-white/35 px-6 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#1d6fb8] to-[#2c8fd4]">
            <Shield size={18} color="#fff" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-[#1a2940]">
              SafetyTrip
            </span>
            <span className="ml-2 text-xs text-[#5a7394]">여행 안전 리포트</span>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-green-300/70 bg-green-100/50 px-3 py-1.5 text-xs font-medium text-green-800">
          <CheckCircle2 size={13} />
          Mock scenario passed
        </div>
      </nav>

      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6">
        <div className="grid gap-5 lg:grid-cols-[5fr_7fr]">
          <section className="flex flex-col gap-4">
            <div className="rounded-xl border border-white/70 bg-white/60 p-4 shadow-[0_4px_24px_rgba(100,160,220,0.12)] backdrop-blur-xl">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#5a7394]">
                여행 안전 질문
              </label>
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                rows={3}
                className="w-full resize-none rounded-lg border border-black/10 bg-white/45 px-3 py-2.5 text-sm leading-relaxed text-[#1a2940] outline-none transition focus:border-[#2c8fd4] focus:ring-4 focus:ring-sky-100"
              />
              <button
                type="button"
                onClick={handleRun}
                disabled={streaming}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1d6fb8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#155d9c] disabled:cursor-wait disabled:bg-slate-400"
              >
                <Play size={16} />
                {streaming ? "분석 중" : "데모 실행"}
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {PARSED_CARDS.map((item) => {
                const Icon = iconMap[item.icon];
                return (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/70 bg-white/55 p-4 shadow-[0_3px_18px_rgba(100,160,220,0.10)] backdrop-blur-xl"
                  >
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#5a7394]">
                      <Icon size={14} />
                      {item.label}
                    </div>
                    <div className="text-base font-semibold text-[#1a2940]">
                      {ran ? item.value : "-"}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl border border-white/70 bg-white/50 p-4 backdrop-blur-xl">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1a2940]">
                <Activity size={16} />
                Event Trace
              </div>
              <div className="space-y-2">
                {TRACE_EVENTS.map((event) => (
                  <div
                    key={event.label}
                    className="flex items-center justify-between rounded-lg border border-white/60 bg-white/45 px-3 py-2"
                  >
                    <span className="font-mono text-xs text-[#1d6fb8]">{event.label}</span>
                    <span className="text-right text-xs text-[#5a7394]">
                      {showTrace ? event.value : "대기 중"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-white/75 bg-white/60 p-5 shadow-[0_6px_32px_rgba(80,140,200,0.13)] backdrop-blur-xl">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#5a7394]">
                  <AlertTriangle size={14} />
                  Risk Summary
                </div>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#1a2940]">
                  해운대 8월 여행 안전 분석
                </h1>
              </div>
              <div className="rounded-full border border-orange-200 bg-orange-100/70 px-3 py-1.5 text-xs font-semibold text-orange-700">
                상위 위험: 폭염
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
              <div className="rounded-xl border border-white/70 bg-white/45 p-4">
                <div className="mb-3 text-sm font-semibold text-[#1a2940]">
                  위험도 점수
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={RISK_DATA} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(90,115,148,0.18)" />
                      <XAxis dataKey="name" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip content={<RiskTooltip />} />
                      <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                        {RISK_DATA.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {RISK_DATA.map((item) => {
                    const Icon = iconMap[item.icon];
                    return (
                      <div key={item.name} className="rounded-lg bg-white/55 px-2 py-2 text-center">
                        <div className="mb-1 flex justify-center" style={{ color: item.color }}>
                          <Icon size={15} />
                        </div>
                        <div className="text-xs font-semibold text-[#1a2940]">{item.name}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-white/70 bg-white/45 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1a2940]">
                  <BookOpen size={16} />
                  안전 리포트
                </div>
                <div className="min-h-[310px] rounded-lg border border-white/60 bg-white/45 p-4">
                  {displayedAnswer ? (
                    renderAnswer(displayedAnswer)
                  ) : (
                    <p className="text-sm text-[#5a7394]">
                      데모 실행을 누르면 mock 응답이 스트리밍됩니다.
                    </p>
                  )}
                  {streaming && <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-[#1d6fb8]" />}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {CITATIONS.map((citation) => (
                <span
                  key={citation}
                  className="rounded-full border border-sky-200 bg-sky-100/70 px-3 py-1.5 text-xs font-semibold text-sky-800"
                >
                  {citation}
                </span>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
