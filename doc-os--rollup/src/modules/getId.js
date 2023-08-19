/**
 * get unique id
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
 */
const getId = () => {
    let array = new Uint32Array(1)
    window.crypto.getRandomValues(array)
    let str = ''
    for (let i = 0; i < array.length; i++) {
        str += (i < 2 || i > 5 ? '' : '-') + array[i].toString(16).slice(-4)
    }
    return str
}

export default getId