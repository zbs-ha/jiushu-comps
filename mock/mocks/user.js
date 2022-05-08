/**
 * req 对象可用属性：method, query, body
 *
 * response
 *    template：将生成的数据，作为"响应主体"
 *    function：将返回的数据，作为"响应主体"
 */

const { genRes } = require('./utils')

module.exports = [
  {
    url: '/token/login',
    type: 'post',
    response: (req) => {
      const { username, password } = req.body
      return genRes({
        username,
        password,
        token: 'user-token123',
        roles: ['admin', 'create'],
      })
    },
  },

  {
    url: '/version',
    type: 'get',
    response: () => genRes({ version: '0.0.8' }),
  },
]
