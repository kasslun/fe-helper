import { setDelay, clearDelay, isPromise } from './lib';
/**
 * Documentation https://kasslun.github.io/req-helper.doc/#deResend
 *
 * The deResend() can be used to prevent repeated requests from ajax/fetch, such as repeated submission of forms, frequent state switching, etc.
 * It needs a function fn that returns Promise object as a parameter, it return a proxy function. This proxy function
 * can control the call frequency of fn. fn is disabled(cannot call), until Promise object returned by fn() is fulfilled (or rejected).
 *
 * import { deResend } from 'req-helper';
 * const proxyFn = deResend((arg) => {
 *   return fetch(url).then(response => {
 *     // do something
 *   })
 * });
 * // call the proxy function of fn
 * proxyFn(arg)
 *
 * @param fn. Function, called function. need to return a promise object.
 *
 * @param statusChange. Function, optional, fn disable status change callback. We can use this callback function to
 * control the disabled attribute of the button or add loading to the page.
 *
 * @param gap. Number, optional, disable gap(ms) after promise fulfilled(or rejected). Expected to be a non-negative integer,
 * The default(undefined) permanently disabled; value of 0 means that you disable to the next macro task.
 *
 * @return deResend(fn) returns a proxy function proxyFn of the fn, the proxy receives any parameters and finally passes in fn
 */
export default (fn, statusChange, gap = 0) => {
    if (typeof fn !== 'function') {
        throw new TypeError('Failed to execute \'deResend\': parameter 1 is not of type \'Function\'.');
    }
    if (statusChange !== undefined && typeof statusChange !== 'function') {
        throw new TypeError('Failed to execute \'deResend\': optional parameter 2 is not of type \'Function\'.');
    }
    if (gap !== undefined && (!Number.isInteger(gap) || gap < 0)) {
        throw new TypeError('Failed to execute \'deResend\': parameter 3 is not undefined or a non-negative integer.');
    }
    let thisArg;
    let disabled = false;
    let delayId;
    const setDisable = statusChange ? (flag) => {
        if (disabled !== flag) {
            disabled = flag;
            statusChange.call(thisArg, disabled);
        }
    } : (flag) => {
        disabled = flag;
    };
    const proxy = function (...arg) {
        thisArg = thisArg || this;
        if (disabled) {
            return Promise.reject(new Error('deResendRet'));
        }
        setDisable(true);
        const pms = fn.call(this, ...arg);
        if (!isPromise(pms)) {
            throw new TypeError('Failed to execute \'proxy\' in \'deResend\' : the return value of the parameter 1 of \'cache\' call is not of type \'Promise\'.');
        }
        if (gap !== undefined) {
            pms.then(() => {
                if (disabled) {
                    delayId = setDelay(() => {
                        setDisable(false);
                    }, gap);
                }
            });
            pms.catch(() => { setDisable(false); });
        }
        return pms;
    };
    proxy.enable = () => {
        if (disabled) {
            setDisable(false);
            clearDelay(delayId);
        }
    };
    return proxy;
};
