export function scoreObjectiveAnswer(answer: unknown, answerKey: unknown, points: number): number {
  if (points <= 0 || answer == null || answer === '') return 0;
  if (Array.isArray(answerKey)) {
    if (!Array.isArray(answer) || answer.length !== answerKey.length) return 0;
    return answerKey.every(item => answer.includes(item)) ? points : 0;
  }
  return answer === answerKey ? points : 0;
}
