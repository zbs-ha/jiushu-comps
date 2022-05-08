module.exports = {
  genRes(data, message = '', code = 10000) {
    return {
      code,
      data,
      msg: message,
    }
  },
}
