/**
 * Robust JSON extraction from AI responses.
 * Handles markdown fences, unescaped characters, and provides retry callback.
 */
export function extractJSON(response: string): string {
  let jsonStr = response.trim();

  // Strip markdown code fences
  const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) jsonStr = fenceMatch[1].trim();

  // Find outermost { or [
  const braceStart = jsonStr.indexOf('{');
  const bracketStart = jsonStr.indexOf('[');
  let start: number;
  let end: number;

  if (bracketStart >= 0 && (bracketStart < braceStart || braceStart < 0)) {
    start = bracketStart;
    end = jsonStr.lastIndexOf(']');
  } else if (braceStart >= 0) {
    start = braceStart;
    end = jsonStr.lastIndexOf('}');
  } else {
    throw new Error('No JSON object or array found in response');
  }

  return jsonStr.slice(start, end + 1);
}

/**
 * Try to parse JSON, with automatic retry via AI fix on failure.
 */
export async function parseWithRetry(
  response: string,
  retryFn: (errorMsg: string, originalResponse: string) => Promise<string>
): Promise<unknown> {
  try {
    return JSON.parse(extractJSON(response));
  } catch (parseErr) {
    console.warn('JSON parse failed, requesting AI fix...');
    const fixedResponse = await retryFn(
      (parseErr as Error).message,
      response.slice(0, 2000)
    );
    try {
      return JSON.parse(extractJSON(fixedResponse));
    } catch (secondErr) {
      throw new Error(
        `JSON parse failed twice. Original: ${(parseErr as Error).message}. Retry: ${(secondErr as Error).message}`
      );
    }
  }
}
