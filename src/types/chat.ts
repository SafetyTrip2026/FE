export type StreamEventType =
  | "thinking"
  | "parsed"
  | "stats"
  | "citation"
  | "reask"
  | "escalate"
  | "degraded"
  | "token"
  | "response"
  | "done"
  | "error";

export interface ChatStreamRequest {
  message: string;
  threadId?: string;
}

export interface ChatStreamResponse {
  answer: string;
  citations: readonly string[];
  toolUsed?: string;
}

export interface ParsedStreamData {
  region?: string;
  month?: string;
  companions?: string;
  intent?: string;
  disaster_type?: string | null;
}

export interface RiskScore {
  disaster_type: string;
  risk_score: number;
  count: number;
}

export interface StatsStreamData {
  scope_used?: string;
  total_count?: number;
  risk_scores?: RiskScore[];
  top_risk?: string;
  fallback_notice?: string | null;
}

export interface CitationStreamData {
  ids: string[];
}

export interface EscalateStreamData {
  reason?: string;
  message?: string;
  contact?: {
    agency?: string;
    phone?: string;
  };
}

export interface StreamEvent {
  type: StreamEventType;
  content?: string;
  status?: string;
  data?: ChatStreamResponse | ParsedStreamData | StatsStreamData | CitationStreamData | EscalateStreamData;
  toolUsed?: string;
}
