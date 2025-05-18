
// 毫秒级别时间戳
export type TimeMilli = number;

export function displayDate(date: Date): string {
  return Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
}
