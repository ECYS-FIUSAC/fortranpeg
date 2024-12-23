import Visitor from './Visitor.js';
import * as n from './CST.js';

export default class Tokenizer extends Visitor {
    constructor() {
        super();
        this.calledRules = [];
        this.pendingRules = [];
        this.isFisrtRule = true;
        this.nameProduction = '';
    }
    generateTokenizer(grammar) {
        return `
module parser
implicit none

contains

subroutine parse(input)
    character(len=:), intent(inout), allocatable :: input
    character(len=:), allocatable :: lexeme
    integer :: cursor
    cursor = 1
    do while (lexeme /= "EOF" )
        if(lexeme == "ERROR") THEN 
            cursor = cursor + 1
            lexeme = nextSym(input, cursor)
        else 
            lexeme = nextSym(input, cursor)
            
        end if
        print *, lexeme
    end do
end subroutine parse

function tolower(str) result(lower_str)
        character(len=*), intent(in) :: str
        character(len=len(str)) :: lower_str
        integer :: i

        lower_str = str 
        do i = 1, len(str)
            if (iachar(str(i:i)) >= iachar('A') .and. iachar(str(i:i)) <= iachar('Z')) then
                lower_str(i:i) = achar(iachar(str(i:i)) + 32)
            end if
        end do
end function tolower

function replace_special_characters(input_string) result(output_string)
    implicit none
    character(len=:), allocatable, intent(in) :: input_string
    character(len=:), allocatable :: temp_string
    character(len=:), allocatable :: output_string
    integer :: i, length

    temp_string = ""
    length = len(input_string)

    do i = 1, length
        select case (ichar(input_string(i:i)))
        case (10) ! Nueva línea
            temp_string = temp_string // '\\n'
        case (9)  ! Tabulación
            temp_string = temp_string // '\\t'
        case (13) ! Retorno de carro
            temp_string = temp_string // '\\r'
        case (32) ! Espacio
            if (input_string(i:i) == " ") then
                temp_string = temp_string // "_"
            else
                temp_string = temp_string // input_string(i:i)
            end if
        case default
            temp_string = temp_string // input_string(i:i)
        end select
    end do
    allocate(character(len=len(temp_string)) :: output_string)
    output_string = temp_string
end function

function nextSym(input, cursor) result(lexeme)
    character(len=*), intent(in) :: input
    integer, intent(inout) :: cursor
    character(len=:), allocatable :: lexeme
    character(len=:), allocatable :: buffer 
    logical :: concat_failed
    integer :: initialCursor

    if (cursor > len(input)) then
        allocate( character(len=3) :: lexeme )
        lexeme = "EOF"
        return
    end if

    ${(() => {
        let result = '';
        do {
            
            result += grammar.map((produccion) => produccion.accept(this)).join('\n');
        } while (this.pendingRules.length > 0);

        return result;  
    })()}

    print *, "error lexico en col ", cursor, ', "'//input(cursor:cursor)//'"'
    lexeme = "ERROR"
end function nextSym
end module parser 
        `;
    }

    visitProducciones(node) {
        if (this.isFisrtRule) {
            this.isFisrtRule = false;  
            let index = this.pendingRules.indexOf(node.id);

            if (index !== -1) {
                this.pendingRules.splice(index, 1);
            }

            this.nameProduction = node.alias? node.alias : '"'+node.id+'"';
            console.log("nameProduction: " + this.nameProduction);
            return node.expr.accept(this);
        }


        if (this.calledRules.includes(node.id) && this.pendingRules.includes(node.id)) {

            let index = this.pendingRules.indexOf(node.id);

            if (index !== -1) {
                this.pendingRules.splice(index, 1);
            }

            this.nameProduction = node.alias? node.alias : '"'+node.id+'"';
            //console.log("nameProduction: " + this.nameProduction);
            return node.expr.accept(this);
             
        }

        //console.log("llamadas");
        //console.log(this.calledRules);
        //console.log("pendientes");
        //console.log(this.pendingRules);
        return '';
    }
    visitOpciones(node) {
        return node.exprs.map((expr) => expr.accept(this)).join('\n');
    }
    
    visitUnion(node) {
        const grupos = [];
        let grupoActual = [];
        let resultadoFinal = '';
        let resultadotmp = '';
        for (let i = 0; i < node.exprs.length; i++) {
            const expr = node.exprs[i];
            if (expr.expr instanceof n.String || expr.expr instanceof n.Corchetes || expr.expr instanceof n.Any) { // Si es instancia de String, Corchete o Any, se agrega al grupo
                grupoActual.push(expr);
            } else { // Si no, cerramos el grupo y comenzamos uno nuevo
                if (grupoActual.length > 0) {
                    grupos.push(grupoActual);
                    grupoActual = [];
                }
                resultadotmp += expr.accept(this) + "\n" // igual recorrer 
            }
        }
        if (grupoActual.length > 0) {
            grupos.push(grupoActual);
        }

        for (let grupo of grupos) {
            const resultadoGrupo = grupo.map((expr) => expr.accept(this)).join('\n');
            resultadoFinal += `
    concat_failed = .false.
    buffer = ""
    ${resultadoGrupo}
    if (.not. concat_failed .and. len(buffer) > 0) then
        allocate( character(len=len(buffer)) :: lexeme)
        lexeme = buffer
        lexeme = lexeme // " -" // ${this.nameProduction}
        return
    end if
        `
        }
        return resultadoFinal + resultadotmp;
    }

    visitExpresion(node) {
        if ( node.qty && //there is a quantifier
            (node.expr instanceof n.String 
            || node.expr instanceof n.Corchetes
            || node.expr instanceof n.grupo)
        ){
            node.expr.qty = node.qty // inherit quantifier
        }
        return node.expr.accept(this);
    }

    visitString(node) {
        const condition = node.isCase 
        ? `tolower("${node.val}") == tolower(input(cursor:cursor + ${ node.val.length - 1} ))`
        :  `"${node.val}" == input(cursor:cursor + ${node.val.length - 1} )`;
        return this.renderQuantifierOption(node.qty, condition, node.val.length)
    }

    visitAny(node) { 
        return `
    ! Cualquier carácter es aceptado como lexema
    if (cursor <= len_trim(input)) then
        buffer = buffer // input(cursor:cursor + ${length - 1})
        buffer = replace_special_characters(buffer)
        cursor = cursor + ${length}
    else
        concat_failed = .true.
        buffer = ""
    end if
    `;
    }

    visitCorchetes(node) {
        node.exprs.forEach(expr => { expr.isCase = node.isCase });
        let conditions = "(" + node.exprs.map((expr) => expr.accept(this)).join(')& \n    .or. (') + ")"
        return this.renderQuantifierOption(node.qty, conditions, 1)
    }

    //Solo devuelve las condiciones a cumplirse
    visitrango(node) {
        const condition = node.isCase 
        ? `iachar(tolower(input(cursor:cursor))) >= iachar("${node.start}") .and. &
        iachar(tolower(input(cursor:cursor))) <= iachar("${node.end}")`
        : `iachar(input(cursor:cursor)) >= iachar("${node.start}") .and. &
        iachar(input(cursor:cursor)) <= iachar("${node.end}")`;

        return "(" + condition + ")";
    }

    //Solo devuelve las condiciones a cumplirse
    visitliteralRango(node) {
        const literalMap = {
            "\\t": "char(9)",  // Tabulación
            "\\n": "char(10)", // Nueva línea
            " ": "char(32)",   // Espacio
            "\\r": "char(13)",  // Retorno de carro
        };
    
        // Verifica si el literal es especial y tradúcelo, de lo contrario usa comillas
        const literalFortran = literalMap[node.val] || `"${node.val}"`;
    
        const condition = node.isCase
        ? `tolower(input(cursor:cursor)) == tolower(${literalFortran})`
        : `input(cursor:cursor) == ${literalFortran}`
        return "(" + condition + ")";
    }

    visitidRel(node) {
        if (!this.calledRules.includes(node.val)) {
            this.calledRules.push(node.val);
            this.pendingRules.push(node.val);
        }
        return '';
    }

    visitgrupo(node) {
        node.expr.qty = node.qty
        return node.expr.accept(this);
    }

    visitfinCadena(node) {
        return '';
    }

    renderQuantifierOption(qty, condition, length){
        var resultOneMore = `
        initialCursor = cursor
        do while (cursor <= len_trim(input) .and. (${condition}))
            cursor = cursor + ${length}
        end do
        if (cursor > initialCursor) then
            buffer = buffer // input(initialCursor:cursor-1) 
            buffer = replace_special_characters(buffer)
        else
            cursor = initialCursor
            concat_failed = .true.
            buffer = ""
        end if`      ;

        var resultZeroMore = `
        initialCursor = cursor
        do while (cursor <= len_trim(input) .and. (${condition}))
            cursor = cursor + ${length}
        end do
        if (cursor > initialCursor) then
            buffer = buffer // input(initialCursor:cursor-1) 
            buffer = replace_special_characters(buffer)
        end if`      ;

        var resultZeroOrOne = `
        if (cursor <= len_trim(input) .and. (${condition})) then 
            buffer = buffer // input(cursor:cursor + ${length - 1})
            buffer = replace_special_characters(buffer)
            cursor = cursor + ${length}
        end if` ;

        var one = `
        if (cursor <= len_trim(input) .and. (${condition})) then 
            buffer = buffer // input(cursor:cursor + ${length - 1})
            buffer = replace_special_characters(buffer)
            cursor = cursor + ${length}
        else
            concat_failed = .true.
            buffer = ""
        end if` ;
    
        
        switch (qty) {
            case '+': return resultOneMore;
            case '*': return resultZeroMore;
            case '?': return resultZeroOrOne;
            default: return one;
        }   


        /*return (qty == '+' || qty == '*')
        ? `
        initialCursor = cursor
        do while (cursor <= len_trim(input) .and. (${condition}))
            cursor = cursor + ${length}
        end do
        if (cursor > initialCursor) then
            buffer = buffer // input(initialCursor:cursor-1) 
            buffer = replace_special_characters(buffer)
        else
            cursor = initialCursor
            concat_failed = .true.
            buffer = ""
        end if`      
            : `
        if (cursor <= len_trim(input) .and. (${condition})) then 
            buffer = buffer // input(cursor:cursor + ${length - 1})
            buffer = replace_special_characters(buffer)
            cursor = cursor + ${length}
        else
            concat_failed = .true.
            buffer = ""
        end if`;*/
    
    }

}
