function caniuse(property, value, noPrefixes = false) {
  const prop = property + ':'
  const el = document.createElement('test')
  const mStyle = el.style

  if (!noPrefixes) {
    mStyle.cssText =
      prop + ['-webkit-', '-moz-', '-ms-', '-o-', ''].join(value + ';' + prop) + value + ';'
  } else {
    mStyle.cssText = prop + value
  }

  return mStyle[property].indexOf(value) !== -1
}

export { caniuse }
