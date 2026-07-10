import type { StreamEvent } from "../types/chat";

function normalizeBackendEvent(eventName: string, data: any): StreamEvent {
  if (eventName === "token") {
    return {
      type: "token",
      content: data.text ?? data.content ?? "",
    };
  }

  if (eventName === "parsed") {
    return {
      type: "parsed",
      status: "질문에서 지역과 시기를 분석했습니다.",
      data,
    };
  }

  if (eventName === "stats") {
    return {
      type: "stats",
      status: "과거 재난문자 통계를 계산했습니다.",
      data,
    };
  }

  if (eventName === "citation") {
    return {
      type: "citation",
      status: "공식 행동요령 출처를 확인했습니다.",
      data,
    };
  }

  if (eventName === "reask") {
    return {
      type: "reask",
      content: data.message ?? data.text ?? "지역과 시기를 조금 더 구체적으로 입력해주세요.",
      data,
    };
  }

  if (eventName === "escalate") {
    const contactText = data.contact?.agency
      ? `\n\n문의 기관: ${data.contact.agency}${data.contact.phone ? ` (${data.contact.phone})` : ""}`
      : "";

    return {
      type: "escalate",
      content: `${data.message ?? "공식 근거가 부족해 관련 기관 안내로 전환합니다."}${contactText}`,
      status: data.reason ?? "관련 기관 안내",
      data,
    };
  }

  if (eventName === "degraded") {
    const contactText = data.contact?.agency
      ? `\n\n문의 기관: ${data.contact.agency}${data.contact.phone ? ` (${data.contact.phone})` : ""}`
      : "";

    return {
      type: "degraded",
      content: `${data.message ?? data.reason ?? "AI 답변 생성이 어려워 공식 행동요령 중심으로 안내합니다."}${contactText}`,
      status: data.reason,
      data,
    };
  }

  if (eventName === "done") {
    return { type: "done" };
  }

  if (eventName === "error") {
    return {
      type: "error",
      content: data.message ?? data.detail ?? "스트리밍 중 오류가 발생했습니다.",
      data,
    };
  }

  return {
    type: data.type ?? "thinking",
    content: data.content,
    status: data.status ?? eventName,
    data: data.data,
    toolUsed: data.toolUsed ?? data.tool_used,
  } as StreamEvent;
}

export function parseSseChunk(chunk: string): StreamEvent[] {
  return chunk
    .split("\n\n")
    .map((eventText) => eventText.trim())
    .filter(Boolean)
    .map((eventText) => {
      const eventName =
        eventText
          .split("\n")
          .find((line) => line.startsWith("event:"))
          ?.slice(6)
          .trim() ?? "";
      const dataLines = eventText
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trim());

      if (dataLines.length === 0) {
        return null;
      }

      const data = JSON.parse(dataLines.join("\n"));

      if (eventName) {
        return normalizeBackendEvent(eventName, data);
      }

      return data as StreamEvent;
    })
    .filter((event): event is StreamEvent => event !== null);
}
