/**
 * This demonstrates use of Promises. It's just intended as notes to myself.
 * Most of the tests are not precisely tests (they don't expect() anything),
 * but just log for demonstration purposes. Making them actually do verification
 * would have required another of indirection with Promises that would confuse
 * the simple cases they are demonstrating.
 *
 * Import notes about Promises:
 *
 * 1) Promises start execution as soon they are instantiated. This is why most
 * are constructed by a method that returns a new instance at the time desired.
 *
 * 2) Exceptions in Promises are only ever detected/handled if someone downstream
 * runs catch() on the Promise. If that never happens, he Exception is never handled,
 * which means that asynchronous "thread" of code is permanently terminated, which
 * may or may not be desired.
 *
 * 3) Every then() call actually takes two methods, resolve and reject, but it seems
 * rare to implement the reject pathway. The way I see it, calling catch() is akin
 * to handling the reject actions of all previous then() calls.
 */
describe('Promises', () => {

    /**
     * One way we can run asynchronous tests is to pass a "testDone" function
     * to the test, and call it when we're done, for instance when a Promise
     * is complete.
     */
    test('Asynchronous test with testDone callback', (testDone) => {
        new Promise((resolve, reject) => {
            console.log("1");
            resolve("A");
        }).then(testDone);
    });

    /**
     * Another way we can run asynchronous tests is to return a Promise
     * and let the test runner handle waiting for the Promise (presumably by
     * calling then() on the returned object). Note that if an argument to
     * the test body is included (like "testDone"), the test runner will fail
     * if you also return a Promise.
     */
    test('Asynchronous test returning a Promise', () => {
        return new Promise((resolve, reject) => {
            console.log("1");
            resolve("A");
        });
    });

    /**
     * While the main Promise body is asynchronous, actions chained with then() are synchronous.
     */
    test('Series of simple then() actions.', () => {
        return new Promise((resolve, reject) => {
            console.log("1");
            resolve("A");
        }).then(arg => {
            console.log("2:" + arg);
            return "B";
        }).then(arg => {
            console.log("3:" + arg);
            return "C";
        });
    });

    /**
     * In order to chain asynchronous actions, we have to create bodies that create additional Promises.
     * Also, because Promised begin execution as soon as they are instantiated, these wrapper functions
     * allow creation of subsequent Promised as earlier ones terminate.
     */
    test('Series of asynchronous actions (Promises)', () => {
        return new Promise((resolve, reject) => {
            console.log("1");
            resolve("A");
        }).then(arg => {
            return new Promise((resolve, reject) => {
                console.log("2:" + arg);
                resolve("B");
            });
        }).then(arg => {
            return new Promise((resolve, reject) => {
                console.log("3:" + arg);
                resolve("C");
            });
        });
    });

    /**
     * Executing parallel async action is as simple as instantiating Promises.
     * Ensuring that they are all complete before continuing is possible by
     * using Promise.all(). According to the documentation, this method
     * will fail as soon as one provided Promise fails.
     */
    test('Parallel asynchronous actions (Promises)', () => {
        return new Promise((resolve, reject) => {
            let p1 = new Promise((resolve, reject) => {
                console.log("1");
                resolve("A");
            });
            let p2 = new Promise((resolve, reject) => {
                console.log("2");
                resolve("B");
            });
            let p3 = new Promise((resolve, reject) => {
                console.log("3");
                resolve("C");
            });
            return Promise.all([p1, p2, p3]).then(() => {
                resolve("OK")
            });
        });
    });

    /**
     * Exceptions in a Promise body are reported to the catch action.
     */
    test('Exception in Promise', () => {
        return new Promise((resolve, reject) => {
            console.log("1");
            throw new Error("Mock Error");
        }).then(arg => {
            console.log("2:" + arg);
            return "B";
        }).then(arg => {
            console.log("3:" + arg);
            return "C";
        }).catch((e) => {
            console.log("Caught: " + e)
        });
    });

    /**
     * Calls to reject() in a Promise body are reported to the catch action.
     */
    test('Reject in Promise', () => {
        return new Promise((resolve, reject) => {
            console.log("1");
            reject(new Error("Mock Error"));
        }).then(arg => {
            console.log("2: " + arg);
            return "B";
        }).then(arg => {
            console.log("3: " + arg);
            return "C";
        }).catch((e) => {
            console.log("Caught: " + e)
        });
    });

    /**
     * Exceptions thrown in then() actions are reported to catch action.
     */
    test('Exception in then()', () => {
        return new Promise((resolve, reject) => {
            console.log("1");
            resolve("A");
        }).then(arg => {
            console.log("2: " + arg);
            throw new Error("Mock Error");
        }).then(arg => {
            console.log("3: " + arg);
            return "C";
        }).catch((e) => {
            console.log("Caught: " + e)
        });
    });

    /**
     * We can resume execution after a catch.
     */
    test('Resume after a catch() action', () => {
        return new Promise((resolve, reject) => {
            console.log("1");
            throw new Error("Mock Error");
            resolve("A");
        }).then(arg => {
            console.log("2:" + arg);
            return "B";
        }).then(arg => {
            console.log("3:" + arg);
            return "C";
        }).catch((e) => {
            console.log("Caught: " + e)
        }).then(arg => {
            console.log("After Catch")
        });
    });

    /**
     * Values pass to the end of the Promise if no exception/rejection occurs.
     */
    test('Value returned by Promise', (testDone) => {
        new Promise((resolve, reject) => {
            console.log("1");
            resolve("A");
        }).then(arg => {
            console.log("2:" + arg);
            return "B";
        }).then(arg => {
            console.log("3:" + arg);
            return "C";
        }).then(result => {
            expect(result).toEqual("C");
            testDone();
        });
    });

    /**
    * Values pass to the end of the Promise if no exception/rejection occurs.
    */
    test('Value returned by Promise', (testDone) => {
        new Promise((resolve, reject) => {
            console.log("1");
            resolve("A");
        }).then(arg => {
            console.log("2:" + arg);
            return "B";
        }).then(arg => {
            console.log("3:" + arg);
            return "C";
        }).then(result => {
            expect(result).toEqual("C");
            testDone();
        });
    });
});

