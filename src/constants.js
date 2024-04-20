
const hostname = location.hostname
export const IS_DEPLOYED = /lexogram.github.io/.test(hostname) // true //

export const PROTOCOL = IS_DEPLOYED
  ? "https://"
  : "http://"

export const HOSTNAME = IS_DEPLOYED
  ? "nevzorovyh.lexogram.com"
  : hostname

export const PORT = IS_DEPLOYED
  ? ""                  // no colon
  : `:${location.port}` // includes colon

const PATH = IS_DEPLOYED
  ? "/nim"
  : ""

export const BACKEND = `${PROTOCOL}${HOSTNAME}${PORT}${PATH}`
