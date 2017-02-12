const isPromise = require('is-promise')
const debug = require('debug')('simpler-sqlite3')

module.exports = function (db) {
  function exec (statement) {
    debug('EXEC: %s', statement)
    return new Promise(function (resolve, reject) {
      db.run(statement, function (error) {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  function run (statement, ...args) {
    debug('RUN: %s', statement, ...args)
    return new Promise(function (resolve, reject) {
      db.run(statement, ...args, function (error) {
        if (error) {
          reject(error)
        } else {
          const changes = this.changes
          const lastID = this.lastID
          resolve({changes, lastID})
        }
      })
    })
  }

  function fetch (call, statement, ...args) {
    debug('%s: %s', call.toUpperCase(), statement, ...args)
    return new Promise(function (resolve, reject) {
      db[call](statement, ...args, function (error, result) {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
  }

  // Serialize all DML so at most one work fn function
  // is active at any time; others wait in a queue for the
  // current work fn to finish.

  var queue = []

  function enqueueWork (work) {
    queue.push(work)
    debug('enqueued DML work fn %s; length=%d', work.name, queue.length)
    if (queue.length === 1) nextWork()
  }

  function nextWork () {
    if (queue.length === 0) {
      debug('work queue is empty; done for now.')
      return
    }

    const work = queue[0]

    if (typeof work !== 'function') {
      throw new Error('expected work fn')
    }

    debug('calling work fn %s', work.name)

    const promise = work()

    if (!isPromise(promise)) {
      throw new Error(`expected work fn ${work.name} to return a promise`)
    }

    db.serialize(() => {
      db.exec('BEGIN')

      promise.then((...args) => {
        db.exec('COMMIT')
        queue.shift()
        debug('work fn %s done OK; COMMIT; queue length = %d', work.name, queue.length)
        nextWork()
        return args
      }).catch(error => {
        db.exec('ROLLBACK')
        queue.shift()
        debug('work fn %s failed; ROLLBACK; queue length = %d', work.name, queue.length)
        nextWork()
        throw error
      })
    })

    return promise
  }

  return {
    exec,
    run,
    all: fetch.bind(null, 'all'),
    get: fetch.bind(null, 'get'),
    dml: enqueueWork
  }
}
