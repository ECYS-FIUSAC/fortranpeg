import Tokenizer from './Tokenizer.js';

export async function generateTokenizer(grammar) {
    const tokenizer = new Tokenizer();
    return `
module tokenizer
  implicit none

contains

  subroutine parse(input)
    character(len=*), intent(in) :: input
    integer :: cursor = 1
    character(len=:), allocatable :: lexeme

    print *, "Iniciando el analisis lexico..."
    
    do while (cursor <= len(input))
        lexeme = nextSym(input, cursor)  ! Llamada corregida, solo pasa input y cursor
        print *, "Lexeme: ", lexeme
        if (lexeme == "EOF") exit
        cursor = cursor + len(lexeme)
    end do

    print *, "Lexical analysis completed."
  end subroutine parse

  function nextSym(input, cursor) result(lexeme)
    character(len=*), intent(in) :: input
    integer, intent(inout) :: cursor
    character(len=:), allocatable :: lexeme
     integer :: i, start_pos, temp_cursor
    logical :: found_one

    if (cursor > len(input)) then
        allocate(character(len=3) :: lexeme)
        lexeme = "EOF"
        return
    end if

    ${grammar.map((produccion) => produccion.accept(tokenizer)).join('\n')}

    print *, "error lexico en col ", cursor, ', "'//input(cursor:cursor)//'"'
    lexeme = "ERROR"
  end function nextSym

  function lower(str) result(lower_str)
    character(len=*), intent(in) :: str
    character(len=len(str)) :: lower_str
    integer :: i
    character(len=26) :: upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    character(len=26) :: lower_case = 'abcdefghijklmnopqrstuvwxyz'

    lower_str = str
    do i = 1, len(str)
        if (index(upper, str(i:i)) > 0) then
            lower_str(i:i) = lower_case(index(upper, str(i:i)):index(upper, str(i:i)))
        end if
    end do
  end function lower

end module tokenizer
    `;
}

export function generateCaracteres(chars) {
    if (chars.length === 0) return '';
    return `
    if (findloc([${chars.map((char) => `"${char}"`).join(', ')}], input(i:i), 1) > 0) then
        lexeme = input(cursor:i)
        cursor = i + 1
        return
    end if
    `;
}