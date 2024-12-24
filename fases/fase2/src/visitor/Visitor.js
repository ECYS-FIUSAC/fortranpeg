
// Auto-generated

/** @typedef {import('./Node.js').default} Node*/

/** @template T */
export default class Visitor {
    
        /**
         * @abstract
         * @param {Node} node
         * @returns {T}
         */
        visitProducciones(node){
            throw new Error('Implement in subclass');
        }
	
        /**
         * @abstract
         * @param {Node} node
         * @returns {T}
         */
        visitOpciones(node){
            throw new Error('Implement in subclass');
        }
	
        /**
         * @abstract
         * @param {Node} node
         * @returns {T}
         */
        visitUnion(node){
            throw new Error('Implement in subclass');
        }
	
        /**
         * @abstract
         * @param {Node} node
         * @returns {T}
         */
        visitExpresion(node){
            throw new Error('Implement in subclass');
        }
	
        /**
         * @abstract
         * @param {Node} node
         * @returns {T}
         */
        visitString(node){
            throw new Error('Implement in subclass');
        }
	
        /**
         * @abstract
         * @param {Node} node
         * @returns {T}
         */
        visitClase(node){
            throw new Error('Implement in subclass');
        }
	
        /**
         * @abstract
         * @param {Node} node
         * @returns {T}
         */
        visitRango(node){
            throw new Error('Implement in subclass');
        }
	
        /**
         * @abstract
         * @param {Node} node
         * @returns {T}
         */
        visitIdentificador(node){
            throw new Error('Implement in subclass');
        }
	
        /**
         * @abstract
         * @param {Node} node
         * @returns {T}
         */
        visitPunto(node){
            throw new Error('Implement in subclass');
        }
	
        /**
         * @abstract
         * @param {Node} node
         * @returns {T}
         */
        visitFin(node){
            throw new Error('Implement in subclass');
        }
}
