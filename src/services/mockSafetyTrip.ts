import type { SafetyEvent } from '../types'

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

export const defaultQuestion =
  '8월 초에 부모님 모시고 부산 해운대 가는데 주의할 게 있을까?'

const mockEvents: SafetyEvent[] = [
  {
    type: 'parsed',
    payload: {
      region: '부산 해운대구',
      month: 8,
      companions: ['고령자'],
      intent: 'preventive',
    },
  },
  {
    type: 'stats',
    payload: [
      { type: '폭염', count: 12, ratio: 54 },
      { type: '호우', count: 7, ratio: 32 },
      { type: '태풍', count: 3, ratio: 14 },
    ],
  },
  {
    type: 'token',
    payload:
      '8월 해운대구는 폭염과 호우 관련 재난문자 발령 이력이 반복된 지역입니다. ',
  },
  {
    type: 'token',
    payload:
      '부모님과 동행한다면 정오부터 15시 사이 백사장 활동을 줄이고, 실내 냉방 공간과 이동 동선을 먼저 확보하세요. ',
  },
  {
    type: 'token',
    payload:
      '호우 예보가 있으면 하천변, 지하차도, 해안 저지대 접근을 피하고 숙소 주변 대피 경로를 확인하세요.',
  },
  {
    type: 'citation',
    payload: {
      sourceId: 'GUIDE-HEAT-ELDERLY-001',
      label: '고령자 폭염 행동요령',
    },
  },
  {
    type: 'citation',
    payload: {
      sourceId: 'GUIDE-RAIN-FLOOD-002',
      label: '호우·침수 행동요령',
    },
  },
  { type: 'done', payload: { status: 'ok' } },
]

export async function runMockSafetyScenario(
  _message: string,
  onEvent: (event: SafetyEvent) => void,
) {
  for (const event of mockEvents) {
    await wait(event.type === 'token' ? 340 : 220)
    onEvent(event)
  }
}

