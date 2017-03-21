# A DML serialization queue for node-sqlite3

Why does this exist?  It is a solution to the problem wherein a transaction is
started with node-sqlite3 and while active, an async handler of some kind is
run which also tries to start a transaction.

This leads to the SQLite error "cannot start a transaction while in a
transaction". Thus, here anything that modifies the database is put into a
queue of work functions.

The work functions are wrapped in transactions which rollback if any error
is thrown; else the work is committed and the next work enqueued work function
is run.

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
