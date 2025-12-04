export const getTopicDisplayName = (topic: string): string => {
  const topicNames: Record<string, string> = {
    jj: 'Jujutsu',
    react: 'React'
  }
  return topicNames[topic] ?? topic.charAt(0).toUpperCase() + topic.slice(1)
}
