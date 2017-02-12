# Utils for node-sqlite3

- a promises interface to `Database.{exec, run, all, get}`
  - I haven't done this for `Statement`
- a serial transaction queue
  - send all DML through the queue and you won't hit the
    SQLite error "cannot start a transaction while in a transaction"

# Example

    sqlite3-utils(master) $ DEBUG=* node example.js

    simpler-sqlite3 enqueued DML work fn worker1; length=1 +0ms
    simpler-sqlite3 calling work fn worker1 +1ms
    example worker 1 was called; let's get to work +1ms
    simpler-sqlite3 EXEC: create table foo(x integer) +1ms
    simpler-sqlite3 enqueued DML work fn worker2; length=2 +2ms
    simpler-sqlite3 enqueued DML work fn worker3; length=3 +0ms
    simpler-sqlite3 RUN: insert into foo(x) values(?) 42 +2ms
    example insert result: changes = 1 lastID = 1 +1ms
    simpler-sqlite3 ALL: select * from foo +0ms
    example fetched all rows: [ { x: 42 } ] +1ms
    simpler-sqlite3 work fn worker1 done OK; COMMIT; queue length = 2 +1ms
    simpler-sqlite3 calling work fn worker2 +0ms
    example worker 2 was called; let's get to work; we just delay for 2s +0ms
    simpler-sqlite3 work fn worker2 done OK; COMMIT; queue length = 1 +2s
    simpler-sqlite3 calling work fn worker3 +0ms
    example worker 3 was called; let's get to work +0ms
    simpler-sqlite3 work fn worker3 done OK; COMMIT; queue length = 0 +0ms
    simpler-sqlite3 work queue is empty; done for now. +0ms

# Author

Brian Hammond <brian@fictorial.com>

# LICENSE

Copyright (c) 2017 Fictorial LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
