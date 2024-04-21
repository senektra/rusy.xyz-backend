const info = (...params) => {
  if (process.env.NODE_ENV === 'production') return
  console.log(...params)
}

const warn = (...params) => {
  console.warn(...params)
}

const error = (...params) => {
  console.error(...params)
}

export default { info, warn, error }