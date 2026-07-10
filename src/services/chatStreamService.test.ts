import { describe, expect, it } from "vitest";

import { buildApiUrl } from "./apiClient";
import { parseSseChunk } from "./sseParser";

describe("apiClient", () => {
  it("builds API paths with a leading slash", () => {
    expect(buildApiUrl("chat/stream")).toMatch(/\/chat\/stream$/);
  });
});

describe("parseSseChunk", () => {
  it("parses legacy data-only SSE events", () => {
    const events = parseSseChunk(
      [
        'data: {"type":"thinking","status":"stats"}',
        "",
        'data: {"type":"token","content":"hello"}',
        "",
      ].join("\n"),
    );

    expect(events).toEqual([
      { type: "thinking", status: "stats" },
      { type: "token", content: "hello" },
    ]);
  });

  it("parses named backend SSE events into frontend stream events", () => {
    const events = parseSseChunk(
      [
        "event: parsed",
        'data: {"region":"부산광역시 해운대구","month":"8월","intent":"prevention"}',
        "",
        "event: stats",
        'data: {"top_risk":"폭염","risk_scores":[{"disaster_type":"폭염","risk_score":80,"count":56}]}',
        "",
        "event: citation",
        'data: {"ids":["GUIDE-HEAT-GENERAL-001"]}',
        "",
        "event: token",
        'data: {"text":"해운"}',
        "",
        "event: reask",
        'data: {"message":"지역과 시기를 조금 더 구체적으로 말씀해 주세요."}',
        "",
      ].join("\n"),
    );

    expect(events).toEqual([
      {
        type: "parsed",
        status: "질문에서 지역과 시기를 분석했습니다.",
        data: {
          region: "부산광역시 해운대구",
          month: "8월",
          intent: "prevention",
        },
      },
      {
        type: "stats",
        status: "과거 재난문자 통계를 계산했습니다.",
        data: {
          top_risk: "폭염",
          risk_scores: [{ disaster_type: "폭염", risk_score: 80, count: 56 }],
        },
      },
      {
        type: "citation",
        status: "공식 행동요령 출처를 확인했습니다.",
        data: { ids: ["GUIDE-HEAT-GENERAL-001"] },
      },
      { type: "token", content: "해운" },
      {
        type: "reask",
        content: "지역과 시기를 조금 더 구체적으로 말씀해 주세요.",
        data: { message: "지역과 시기를 조금 더 구체적으로 말씀해 주세요." },
      },
    ]);
  });
});
