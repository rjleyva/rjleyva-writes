export const getTopicDisplayName = (topic: string): string => {
  const topicNames: Record<string, string> = {
    css: 'CSS',
    wezterm: 'WezTerm'
  }
  return topicNames[topic] ?? topic.charAt(0).toUpperCase() + topic.slice(1)
}
