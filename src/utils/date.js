import distanceInWordsToNow from 'date-fns/formatDistanceToNow'

export function convertTimeAgo(timestamp) {
  return distanceInWordsToNow(timestamp, {
    includeSeconds: true,
    addSuffix: true,
  })
}

export function convertTimestamp(timestamp) {
  return `${new Date(timestamp).toLocaleDateString()} ${new Date(timestamp).toLocaleTimeString()}`
}
