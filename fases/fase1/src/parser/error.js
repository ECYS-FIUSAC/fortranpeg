export class ErrorReglas extends Error {
    /**
     * @param {string} message
     */
    constructor(message, location) {
        super(message);
    }
}