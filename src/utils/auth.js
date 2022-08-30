
const TokenKey = 'token'

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}

const timekey = 'token-invalid-time'
export function setTokenInvalid(time) {
  return localStorage.setItem(timekey, time)
}
export function getTokenInvalid() {
  return localStorage.getItem(timekey)
}
export function isOvertime(timeOut) {
  return ((Date.now() - getTokenInvalid()) / 1000 > timeOut)
}