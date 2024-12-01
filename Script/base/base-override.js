/**
 * @template T1
 * @template T2
 * @param {T1} [obj1={}]
 * @param {T2} [obj2={}]
 * @returns {T1 & T2}
 */
const defineObject = (obj1 = {}, obj2 = {}) => {
    return {
        ...obj1,
        ...obj2,
    };
};
