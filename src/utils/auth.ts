export function setAuthToken(token: string) {
  console.log('setAuthToken', token)
  uni.setStorageSync('token', token)
  console.log('try getAuthToken', getAuthToken())
}

export function getAuthToken(): string {
  return uni.getStorageSync('token') // || 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoidXNlciIsImlzcyI6IkRpbmdUYWktTGFiIiwic3ViIjoiNSIsImF1ZCI6WyJEaW5nVGFpLUxhYiJdLCJleHAiOjE3NTEzNzEwNjksImlhdCI6MTc0NzUwNzA2OX0.qteLtcM67Cw2rpT4h3YA2KpAiPZZcXQ8oSVQ2Ox834LXNoAOrrFeuRrcjF_zsr5ISroNU-u9ZFAim1LfgLtVvg'
}

export function delAuthToken() {
  setAuthToken('')
}
