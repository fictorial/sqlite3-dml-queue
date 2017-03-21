module.exports = function (db) {
  const queue = []

  function next () {
    if (queue.length === 0) return
    db.serialize(async () => {
      db.exec('BEGIN')
      try {
        const result = await queue[0]()
        db.exec('COMMIT')
        queue.shift()
        process.nextTick(next)
        return result
      } catch (error) {
        db.exec('ROLLBACK')
        throw error
      }
    })
  }

  return async work => {
    queue.push(work)
    if (queue.length === 1) return await next()
  }
}
