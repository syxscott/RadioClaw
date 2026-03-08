import { describe, expect, it } from "vitest";
import { expandQueryForFts, extractKeywords } from "./query-expansion.js";

describe("extractKeywords", () => {
  it("extracts keywords from English conversational query", () => {
    const keywords = extractKeywords("that thing we discussed about the API");
    expect(keywords).toContain("discussed");
    expect(keywords).toContain("api");
    // Should not include stop words
    expect(keywords).not.toContain("that");
    expect(keywords).not.toContain("thing");
    expect(keywords).not.toContain("we");
    expect(keywords).not.toContain("about");
    expect(keywords).not.toContain("the");
  });

  it("extracts keywords from Chinese conversational query", () => {
    const keywords = extractKeywords("之前讨论的那个方�?);
    expect(keywords).toContain("讨论");
    expect(keywords).toContain("方案");
    // Should not include stop words
    expect(keywords).not.toContain("之前");
    expect(keywords).not.toContain("�?);
    expect(keywords).not.toContain("那个");
  });

  it("extracts keywords from mixed language query", () => {
    const keywords = extractKeywords("昨天讨论�?API design");
    expect(keywords).toContain("讨论");
    expect(keywords).toContain("api");
    expect(keywords).toContain("design");
  });

  it("returns specific technical terms", () => {
    const keywords = extractKeywords("what was the solution for the CFR bug");
    expect(keywords).toContain("solution");
    expect(keywords).toContain("cfr");
    expect(keywords).toContain("bug");
  });

  it("extracts keywords from Korean conversational query", () => {
    const keywords = extractKeywords("어제 논의�?배포 전략");
    expect(keywords).toContain("논의�?);
    expect(keywords).toContain("배포");
    expect(keywords).toContain("전략");
    // Should not include stop words
    expect(keywords).not.toContain("어제");
  });

  it("strips Korean particles to extract stems", () => {
    const keywords = extractKeywords("서버에서 발생�?에러�?확인");
    expect(keywords).toContain("서버");
    expect(keywords).toContain("에러");
    expect(keywords).toContain("확인");
  });

  it("filters Korean stop words including inflected forms", () => {
    const keywords = extractKeywords("나는 그리�?그래�?);
    expect(keywords).not.toContain("�?);
    expect(keywords).not.toContain("나는");
    expect(keywords).not.toContain("그리�?);
    expect(keywords).not.toContain("그래�?);
  });

  it("filters inflected Korean stop words not explicitly listed", () => {
    const keywords = extractKeywords("그녀�?우리�?);
    expect(keywords).not.toContain("그녀�?);
    expect(keywords).not.toContain("우리�?);
    expect(keywords).not.toContain("그녀");
    expect(keywords).not.toContain("우리");
  });

  it("does not produce bogus single-char stems from particle stripping", () => {
    const keywords = extractKeywords("논의");
    expect(keywords).toContain("논의");
    expect(keywords).not.toContain("�?);
  });

  it("strips longest Korean trailing particles first", () => {
    const keywords = extractKeywords("기능으로 설명");
    expect(keywords).toContain("기능");
    expect(keywords).not.toContain("기능�?);
  });

  it("keeps stripped ASCII stems for mixed Korean tokens", () => {
    const keywords = extractKeywords("API�?배포했다");
    expect(keywords).toContain("api");
    expect(keywords).toContain("배포했다");
  });

  it("handles mixed Korean and English query", () => {
    const keywords = extractKeywords("API 배포�?대�?논의");
    expect(keywords).toContain("api");
    expect(keywords).toContain("배포");
    expect(keywords).toContain("논의");
  });

  it("extracts keywords from Japanese conversational query", () => {
    const keywords = extractKeywords("昨日話したデプロイ戦�?);
    expect(keywords).toContain("デプロイ");
    expect(keywords).toContain("戦略");
    expect(keywords).not.toContain("昨日");
  });

  it("handles mixed Japanese and English query", () => {
    const keywords = extractKeywords("昨日話したAPIのバ�?);
    expect(keywords).toContain("api");
    expect(keywords).toContain("バグ");
    expect(keywords).not.toContain("した");
  });

  it("filters Japanese stop words", () => {
    const keywords = extractKeywords("これ それ そし�?どう");
    expect(keywords).not.toContain("これ");
    expect(keywords).not.toContain("それ");
    expect(keywords).not.toContain("そし�?);
    expect(keywords).not.toContain("どう");
  });

  it("extracts keywords from Spanish conversational query", () => {
    const keywords = extractKeywords("ayer hablamos sobre la estrategia de despliegue");
    expect(keywords).toContain("estrategia");
    expect(keywords).toContain("despliegue");
    expect(keywords).not.toContain("ayer");
    expect(keywords).not.toContain("sobre");
  });

  it("extracts keywords from Portuguese conversational query", () => {
    const keywords = extractKeywords("ontem falamos sobre a estratégia de implantação");
    expect(keywords).toContain("estratégia");
    expect(keywords).toContain("implantação");
    expect(keywords).not.toContain("ontem");
    expect(keywords).not.toContain("sobre");
  });

  it("filters Spanish and Portuguese question stop words", () => {
    const keywords = extractKeywords("cómo cuando donde porquê quando onde");
    expect(keywords).not.toContain("cómo");
    expect(keywords).not.toContain("cuando");
    expect(keywords).not.toContain("donde");
    expect(keywords).not.toContain("porquê");
    expect(keywords).not.toContain("quando");
    expect(keywords).not.toContain("onde");
  });

  it("extracts keywords from Arabic conversational query", () => {
    const keywords = extractKeywords("بالأمس ناقشنا استراتيجية النشر");
    expect(keywords).toContain("ناقشنا");
    expect(keywords).toContain("استراتيجية");
    expect(keywords).toContain("النشر");
    expect(keywords).not.toContain("بالأمس");
  });

  it("filters Arabic question stop words", () => {
    const keywords = extractKeywords("كيف متى أين ماذا");
    expect(keywords).not.toContain("كيف");
    expect(keywords).not.toContain("متى");
    expect(keywords).not.toContain("أين");
    expect(keywords).not.toContain("ماذا");
  });

  it("handles empty query", () => {
    expect(extractKeywords("")).toEqual([]);
    expect(extractKeywords("   ")).toEqual([]);
  });

  it("handles query with only stop words", () => {
    const keywords = extractKeywords("the a an is are");
    expect(keywords.length).toBe(0);
  });

  it("removes duplicate keywords", () => {
    const keywords = extractKeywords("test test testing");
    const testCount = keywords.filter((k) => k === "test").length;
    expect(testCount).toBe(1);
  });
});

describe("expandQueryForFts", () => {
  it("returns original query and extracted keywords", () => {
    const result = expandQueryForFts("that API we discussed");
    expect(result.original).toBe("that API we discussed");
    expect(result.keywords).toContain("api");
    expect(result.keywords).toContain("discussed");
  });

  it("builds expanded OR query for FTS", () => {
    const result = expandQueryForFts("the solution for bugs");
    expect(result.expanded).toContain("OR");
    expect(result.expanded).toContain("solution");
    expect(result.expanded).toContain("bugs");
  });

  it("returns original query when no keywords extracted", () => {
    const result = expandQueryForFts("the");
    expect(result.keywords.length).toBe(0);
    expect(result.expanded).toBe("the");
  });
});
