import Visitor from '../visitor/Visitor.js';
import { Rango, String } from '../visitor/CST.js';
import { generateCaracteres } from './utils.js';

/**
 * Clase Tokenizer que extiende la funcionalidad de Visitor
 */
export default class Tokenizer extends Visitor {

    /**
     * @override
     * @param {any} node - Nodo de producciones a visitar.
     * @returns {any}
     */
    visitProducciones(node) {

        if (node.alias === undefined){
            node.alias = ''
        } else {
            node.expr.alias = node.alias;
        }

        return node.expr.accept(this,node.alias);
    }

    /**
     * @override
     * @param {any} node - Nodo de opciones a visitar.
     * @returns {string}
     */
    visitOpciones(node) {

        for (let child of node.exprs){
            child.alias = node.alias;
        }

        return node.exprs
            .map((expr) => expr.accept(this))
            .filter((str) => str)
            .join('\n');
    }

    /**
     * @override
     * @param {any} node - Nodo de uniones a visitar.
     * @returns {string}
     */
    visitUnion(node) {

        for (let child of node.exprs){
            child.alias = node.alias;
        }
        return node.exprs
            .map((expr) => expr.accept(this))
            .filter((str) => str)
            .join('\n');
    }

    /**
     * @override
     * @param {any} node - Nodo de expresiones a visitar.
     * @returns {any}
     */
    visitExpresion(node) {

        node.expr.alias = node.alias;

            node.expr.qty = node.qty

        return node.expr.accept(this);


    }

    /**
     * @override
     * @param {any} node - Nodo de tipo string a visitar.
     * @returns {string}
     */
    visitString(node) {
        console.log(node.alias);
        const aliaString = this.leerAlias(node.alias);
        const comparison = node.isCase ?
          `lower(input(cursor:cursor + ${node.val.length - 1})) == lower("${node.val}")` :
          `"${node.val}" == input(cursor:cursor + ${node.val.length - 1})`;
        const base = `
    if (${comparison}) then
        
        `
        if (node.qty === '*'){
            return `
    start_pos = cursor
    do while (.true.)
        temp_cursor = cursor
        !allocate(character(len=${node.val.length}) :: stringLexeme)
        ${base}
        !stringLexeme = input(cursor:cursor + ${node.val.length - 1})
        cursor = cursor + ${node.val.length}
        endif
        if (temp_cursor == cursor) exit
    end do
    if (cursor > start_pos) then
        lexeme = input(start_pos:cursor-1) ${ aliaString ? `// " - ${aliaString}"` : ''}  
        return
    end if
        `
        } else if (node.qty === '+'){
        return `
    start_pos = cursor
    found_one = .false.
    do while (.true.)
        temp_cursor = cursor
        !allocate(character(len=${node.val.length}) :: stringLexeme)
        ${base}
        !stringLexeme = input(cursor:cursor + ${node.val.length - 1})
        cursor = cursor + ${node.val.length}
        end if
        if (temp_cursor == cursor) exit
        found_one = .true.
    end do
    if (found_one) then
        lexeme = input(start_pos:cursor-1) ${ aliaString ? `// " - ${aliaString}"` : ''}  
        return
    end if
        `
        } else {
            return `
            ${base}
            allocate(character(len=${node.val.length}) :: lexeme)
        lexeme = input(cursor:cursor + ${node.val.length - 1}) ${ aliaString ? `// " - ${aliaString}"` : ''}  
        cursor = cursor + ${node.val.length}
            return
            endif
            `
        }
    }

    /**
     * @override
     * @param {any} node - Nodo de clases a visitar.
     * @returns {string}
     */
    visitClase(node) {
        return `
    i = cursor
    ${generateCaracteres(node.chars.filter((node) => typeof node === 'string'))}
    ${node.chars
        .filter((node) => node instanceof Rango)
        .map((range) => range.accept(this))
        .join('\n')}
        `;
    }

    /**
     * @override
     * @param {any} node - Nodo de rangos a visitar.
     * @returns {string}
     */
    visitRango(node) {
        const base = `
    if (input(i:i) >= "${node.bottom}" .and. input(i:i) <= "${node.top}") then
        lexeme = input(cursor:i)
        cursor = i + 1
        `;
        if (node.qty === '*'){
            return`
    start_pos = cursor
    do while (.true.)
        temp_cursor = cursor
        ${base}
        endif
        if (temp_cursor == cursor) exit
    end do
    if (cursor > start_pos) then
        lexeme = input(start_pos:cursor-1)
        return
    end if
        `
        } else if (node.qty === '+'){
            return `
    start_pos = cursor
    found_one = .false.
    do while (.true.)
        temp_cursor = cursor
        ${base}
        end if
        if (temp_cursor == cursor) exit
        found_one = .true.
    end do
    if (found_one) then
        lexeme = input(start_pos:cursor-1)
        return
    end if
        `
        } else {
            return `
            ${base}
            return
            endif
            `
        }
    }

    /**
     * @override
     * @param {any} node - Nodo de identificadores a visitar.
     * @returns {string}
     */
    visitIdentificador(node) {
        return '';
    }

    /**
     * @override
     * @param {any} node - Nodo de puntos a visitar.
     * @returns {string}
     */
    visitPunto(node) {
        return '';
    }

    /**
     * @override
     * @param {any} node - Nodo de fin a visitar.
     * @returns {string}
     */
    visitFin(node) {
        return '';
    }

    leerAlias(aliasArray){
        let alias = "";
        if (!aliasArray){
            return null;
        }

        for (let i = 0; i < aliasArray.length; i++) {
            alias += aliasArray[i][1].toString();
        }
        console.log(alias)
        return alias;
    }

     /**
     * Genera código para el cuantificador * (cero o más ocurrencias)
     * @param {string} baseExpr - Expresión base a cuantificar
     * @returns {string}
     */
     generateZeroOrMore(baseExpr) {
        return `
    start_pos = cursor
    do while (.true.)
        temp_cursor = cursor
        ${baseExpr}
        endif
        if (temp_cursor == cursor) exit
    end do
    if (cursor > start_pos) then
        lexeme = input(start_pos:cursor-1)
        return
    end if
        `;
    }

    /**
     * Genera código para el cuantificador + (una o más ocurrencias)
     * @param {string} baseExpr - Expresión base a cuantificar
     * @returns {string}
     */
    generateOneOrMore(baseExpr) {
        return `
    start_pos = cursor
    found_one = .false.
    do while (.true.)
        temp_cursor = cursor
        ${baseExpr}
        end if
        if (temp_cursor == cursor) exit
        found_one = .true.
    end do
    if (found_one) then
        lexeme = input(start_pos:cursor-1)
        return
    end if
        `;
    }

    generateOneorNone(baseExpr) {
        return `       
         ${baseExpr}
        return
        end if`
    }
}
