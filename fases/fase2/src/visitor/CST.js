
// Auto-generated

/**
 * @template T
 * @typedef {import('./Visitor.js').default<T>} Visitor
 */
/**
 * @typedef {import('./Node.js').default} Node
 */


/**
 * @implements {Node}
 */
export class Producciones {
    /**
     *
     * @param {string} id
	 * @param {Opciones} expr
	 * @param {string=} alias
     */
    constructor(id, expr, alias) {
        this.id = id;
		this.expr = expr;
		this.alias = alias;
    }

    /**
     * @template T
     * @param {Visitor<T>} visitor
     * @returns {T}
     */
    accept(visitor) {
        return visitor.visitProducciones(this);
    }
}
    

/**
 * @implements {Node}
 */
export class Opciones {
    /**
     *
     * @param {Union[]} exprs
     * @param {string=} alias
     */
    constructor(exprs, alias) {
        this.exprs = exprs;
        this.alias = alias;
    }

    /**
     * @template T
     * @param {Visitor<T>} visitor
     * @returns {T}
     */
    accept(visitor) {
return visitor.visitOpciones(this);    }
}
    

/**
 * @implements {Node}
 */
export class Union {
    /**
     *
     * @param {Expresion[]} exprs
     * @param {string=} alias
     */
    constructor(exprs,alias) {
        this.exprs = exprs;
        this.alias = alias;
    }

    /**
     * @template T
     * @param {Visitor<T>} visitor
     * @returns {T}
     */
    accept(visitor) {
        return visitor.visitUnion(this);
    }
}
    

/**
 * @implements {Node}
 */
export class Expresion {
    /**
     *
     * @param {Node} expr
	 * @param {string=} label
	 * @param {string=} qty
     * @param {string=} alias
     */
    constructor(expr, label, qty,alias) {
        this.expr = expr;
		this.label = label;
		this.qty = qty;
        this.alias = alias;
    }

    /**
     * @template T
     * @param {Visitor<T>} visitor
     * @returns {T}
     */
    accept(visitor) {
        return visitor.visitExpresion(this);
    }
}
    

/**
 * @implements {Node}
 */
export class String {
    /**
     *
     * @param {string} val
	 * @param {boolean=} isCase
     * @param {string=} qty
     * @param {string=} alias
     *
     */
    constructor(val, isCase,qty, alias) {
        this.val = val;
		this.isCase = isCase;
        this.qty = qty;
        this.alias = alias;
    }

    /**
     * @template T
     * @param {Visitor<T>} visitor
     * @param {string=} alias
     * @returns {T}
     */
    accept(visitor, alias) {
        return visitor.visitString(this);
    }
}
    

/**
 * @implements {Node}
 */
export class Clase {
    /**
     *
     * @param {(string|Rango)[]} chars
	 * @param {boolean=} isCase
     */
    constructor(chars, isCase) {
        this.chars = chars;
		this.isCase = isCase;
    }

    /**
     * @template T
     * @param {Visitor<T>} visitor
     * @returns {T}
     */
    accept(visitor) {
        return visitor.visitClase(this);
    }
}
    

/**
 * @implements {Node}
 */
export class Rango {
    /**
     *
     * @param {string} bottom
	 * @param {string} top
     */
    constructor(bottom, top) {
        this.bottom = bottom;
		this.top = top;
        this.isUnique = '';
    }

    /**
     * @template T
     * @param {Visitor<T>} visitor
     * @returns {T}
     */
    accept(visitor) {
        return visitor.visitRango(this);
    }
}
    

/**
 * @implements {Node}
 */
export class Identificador {
    /**
     *
     * @param {string} id
     */
    constructor(id) {
        this.id = id;
    }

    /**
     * @template T
     * @param {Visitor<T>} visitor
     * @returns {T}
     */
    accept(visitor) {
        return visitor.visitIdentificador(this);
    }
}
    

/**
 * @implements {Node}
 */
export class Punto {
    /**
     *
    
     */
    constructor() {
        
    }

    /**
     * @template T
     * @param {Visitor<T>} visitor
     * @returns {T}
     */
    accept(visitor) {
        return visitor.visitPunto(this);
    }
}
    

/**
 * @implements {Node}
 */
export class Fin {
    /**
     *
    
     */
    constructor() {
        
    }

    /**
     * @template T
     * @param {Visitor<T>} visitor
     * @returns {T}
     */
    accept(visitor) {
        return visitor.visitFin(this);
    }
}
    
