// Badge and highlight color palette
export const BADGE_COLORS = [
  '#b94a48', // red
  '#2196f3', // blue
  '#f4d35e', // yellow
  '#6fcf97', // green
  '#f2994a', // orange
  '#9b51e0', // purple
  '#7b8a8b', // gray
];

export function getBadgeColor(index: number) {
  return BADGE_COLORS[index % BADGE_COLORS.length];
}

export function getInitials(label: string) {
  const words = label.split(' ');
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

// For highlights, you can use the same palette or a subset
export const HIGHLIGHT_COLORS = [
  '#6fcf97', // green
  '#2196f3', // blue
  '#f4d35e', // yellow
  '#b94a48', // red
  '#9b51e0', // purple
  '#f2994a', // orange
];

export function getHighlightColor(index: number) {
  return HIGHLIGHT_COLORS[index % HIGHLIGHT_COLORS.length];
} 