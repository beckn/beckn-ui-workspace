import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import next from 'next'

// Initialize Firebase Admin
admin.initializeApp()

const app = next({
  dev: false,
  conf: { distDir: './.next' }
})

const handle = app.getRequestHandler()

exports.retailApp = functions.https.onRequest((req, res) => {
  return app.prepare().then(() => handle(req, res))
})
