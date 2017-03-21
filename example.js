const sqlite3 = require('sqlite3').verbose()
const dbh = new sqlite3.Database(':memory:')
const dbp = require('sqlite3-promises')(dbh)
const tx = require('.')(dbh)

tx(async () => {
  await dbp.exec('create table foo(x integer)')
  console.log(await dbp.run('insert into foo(x) values(?)', 42))
  console.log(await dbp.all('select * from foo'))
})
