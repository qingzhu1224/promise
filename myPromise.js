const PENDING = Symbol();

const FUFILLED = Symbol();

const REJECTED = Symbol();


function MyPromise(fn) {
    if(typeof fn !== 'function') {
        throw new Error('fn must be a function');
    }

    let state = PENDING;

    let value = null;

    function fulfill(result) {
        state = FUFILLED;
        value = result;
    }

    function resolve(result) {
        try{
            fulfill(result)
        } catch(err) {
            reject(err)
        }
    }

    function reject(error) {
        state = REJECTED;
        value = error;
    }

    this.then = function(onFulfill, onReject) {
        switch(state) {
            case FUFILLED:
                onFulfill(value);
                break;
            case REJECTED:
                onReject(value);
                break;
        }
    }

    fn(resolve, reject);
}

let p = new Prometheus((resolve, reject) => {
    resolve('hello')
})

p.then(val => {
    console.log(val)
})




const p = new Promise((resolve, reject) => {
    console.log('hello1')
    setTimeout(() => {
        resolve('hello2')
    }, 0);
    console.log('hello3')
})

p.then(val => {
    console.log(val + '4')
})



const p = new Promise((resolve, reject) => {
   reject('23444')
})

p.then(val => {
    console.log(val + '4')
}, val2 => {
    console.log(val2+'34')
})




const PENDING = Symbol();
const FULFILLED = Symbol();
const REJECTED = Symbol();
function MyPromise(fn){
    if(typeof fn !== 'function') throw new Error('fn must be a function');
    let state = PENDING;
    let value = null;
    function fulfill(result) {
        state = FULFILLED;
        fn(result);
    }
    function reject(result) {
        state = REJECTED;
        fn(result);
    }

    function resolve(result) {
        try{
            fulfill(result)
        } catch(err) {
            reject(err)
        }
    }
    fn(resolve, reject);
}

// 实现.then

const PENDING = Symbol();
const FULFILLED = Symbol();
const REJECTED = Symbol();
function MyPromise(fn){
    if(typeof fn !== 'function') throw new Error('fn must be a function');
    let state = PENDING;
    let value = null;
    let handler = {};
    function fulfill(result) {
        state = FULFILLED;
        value = result;
        next(handler)
    }

    function reject(error) {
        state = REJECTED;
        value = error;
        next(handler)
    }

    function resolve(result) {
        try{
            fulfill(result)
        } catch(err) {
            reject(err)
        }
    }

    function next({onFulfill, onReject}) {
        switch(state) {
            case FULFILLED:
                onFulfill&&onFulfill(value);
                break;
            case REJECTED:
                onReject&&onReject(value);
                break;
            case PENDING:
                handler = { onFulfill, onReject };
        }
    }

    this.then = function(onFulfill, onReject) {
        // then的链式调用
        return new MyPromise((resolve, reject) => {
            next({
                onFulfill: val => {
                    resolve(onFulfill(value))
                },
                onReject: err => {
                    reject(onReject(err))
                }
            })
        })
    }
    fn(resolve, reject);
}



