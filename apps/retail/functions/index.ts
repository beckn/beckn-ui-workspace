import functions from 'firebase-functions'
import next from 'next'

const app = next({
  dev: false,
  conf: { distDir: './.next' }
})

const handle = app.getRequestHandler()

exports.nextApp = functions.https.onRequest((req, res) => {
  return app.prepare().then(() => handle(req, res))
})
