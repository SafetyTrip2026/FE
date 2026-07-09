export type RiskType = '폭염' | '호우' | '태풍'

export type ParsedTrip = {
  region: string
  month: number
  companions: string[]
  intent: 'preventive'
}

export type RiskStat = {
  type: RiskType
  count: number
  ratio: number
}

export type Citation = {
  sourceId: string
  label: string
}

export type SafetyEvent =
  | { type: 'parsed'; payload: ParsedTrip }
  | { type: 'stats'; payload: RiskStat[] }
  | { type: 'token'; payload: string }
  | { type: 'citation'; payload: Citation }
  | { type: 'done'; payload: { status: 'ok' } }

