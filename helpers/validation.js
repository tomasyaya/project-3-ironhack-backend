exports.checkEqual = (one, two) => {
  if(one.toString() === two.toString()) {
    return true
  } else {
    return false
  }
}

exports.checkIfEmpty = (one) => {
  if(one.length === 0) {
    return true
  } else {
    return false
  }
}

exports.checkEmptyFields = (...args) => {
  let foundEmpty = false
  args.forEach((arg,index) => {
    if(arg.length === 0 ){
      foundEmpty = true
    }
  })
  return foundEmpty
}