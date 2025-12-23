export const getTopicDisplayName = (topic: string): string => {
  const topicNames: Record<string, string> = {
    css: 'CSS',
    wezterm: 'WezTerm',
    typescript: 'TypeScript'
  }
  return topicNames[topic] ?? topic.charAt(0).toUpperCase() + topic.slice(1)
}
