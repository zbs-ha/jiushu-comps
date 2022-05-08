const chokidar = require('chokidar')
const bodyParser = require('body-parser')
const chalk = require('chalk')
const path = require('path')
const Mock = require('mockjs')

const cwd = process.cwd()

// 加载环境变量 VUE_APP_BASE_API
require('dotenv').config({ path: path.resolve(cwd, '.env.development') })

const mockDir = path.join(cwd, 'mock')

// for mock server
const responseFake = (url, type, respond) => ({
  url: new RegExp(`${process.env.VUE_APP_BASE_API}${url}`),
  type: type || 'get',
  response(req, res) {
    console.log(`request invoke:${req.path}`)
    res.json(Mock.mock(respond instanceof Function ? respond(req, res) : respond))
  },
})

function registerRoutes(app) {
  let mockLastIndex
  const mocks = require('../mocks')
  const mocksForServer = mocks.map((route) => responseFake(route.url, route.type, route.response))
  for (const mock of mocksForServer) {
    app[mock.type](mock.url, mock.response)
    mockLastIndex = app._router.stack.length
  }
  const mockRoutesLength = Object.keys(mocksForServer).length
  return {
    mockRoutesLength,
    mockStartIndex: mockLastIndex - mockRoutesLength,
  }
}

function unregisterRoutes() {
  Object.keys(require.cache)
    .forEach((i) => {
      if (i.includes(mockDir)) {
        delete require.cache[require.resolve(i)]
      }
    })
}

const initMockServer = (app) => {
  // parse app.body
  // https://expressjs.com/en/4x/api.html#req.body
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true,
  }))

  const mockRoutes = registerRoutes(app)
  let { mockRoutesLength } = mockRoutes
  let { mockStartIndex } = mockRoutes

  // watch files, hot reload mock server
  chokidar.watch(mockDir, {
    ignored: /server/,
    ignoreInitial: true,
  })
    .on('all', (event, path) => {
      if (event === 'change' || event === 'add') {
        try {
          // remove mock routes stack
          app._router.stack.splice(mockStartIndex, mockRoutesLength)

          // clear routes cache
          unregisterRoutes()

          const mockRoutes = registerRoutes(app)
          mockRoutesLength = mockRoutes.mockRoutesLength
          mockStartIndex = mockRoutes.mockStartIndex

          console.log(chalk.magentaBright(`\n > Mock Server hot reload success! changed  ${path}`))
        } catch (error) {
          console.log(chalk.redBright(error))
        }
      }
    })
}

// 提供 api 服务
const express = require('express')

const app = express()
initMockServer(app)
app.listen(20001)

console.log('listen on 20001 ...')
