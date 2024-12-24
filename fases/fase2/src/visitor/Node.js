/**
 * @template T
 * @typedef {import('./Visitor.js').default<T>} Visitor
 */

export default class Node {
    /**
     * @abstract
     * @template T
     * @param {Visitor<T>} visitor
     * @returns {T}
     */
    accept(visitor) {
        throw new Error('Implement in subclass');
    }
}
