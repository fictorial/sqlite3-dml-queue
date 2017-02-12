const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(':memory:')
const q = require('.')(db)

const debug = require('debug')('example')

q.dml(function worker1 () {
  debug('worker 1 was called; let\'s get to work')

  return q.exec('create table foo(x integer)')
    .then(() => {
      return q.run('insert into foo(x) values(?)', 42)
    })
    .then(({ changes, lastID }) => {
      debug('insert result: changes =', changes, 'lastID =', lastID)
      return q.all('select * from foo')
    })
    .then((rows) => {
      debug('fetched all rows:', rows)
    })
    .catch(err => {
      debug('something went wrong: %s', err)
    })
})

q.dml(function worker2 () {
  debug('worker 2 was called; let\'s get to work; we just delay for 2s')

  return new Promise(resolve => {
    setTimeout(resolve, 2000)
  })
})

q.dml(function worker3 () {
  debug('worker 3 was called; let\'s get to work')
  return Promise.resolve()
})
