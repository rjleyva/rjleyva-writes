export const getTopicDisplayName = (topic: string): string => {
  const topicNames: Record<string, string> = {
    css: 'CSS',
    wezterm: 'WezTerm',
    typescript: 'TypeScript',
    'web-development': 'Web Development'
  }
  return topicNames[topic] ?? topic.charAt(0).toUpperCase() + topic.slice(1)
}
