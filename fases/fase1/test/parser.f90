
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
            temp_string = temp_string // '\n'
        case (9)  ! Tabulación
            temp_string = temp_string // '\t'
        case (13) ! Retorno de carro
            temp_string = temp_string // '\r'
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

    
    concat_failed = .false.
    buffer = ""
    
        if (cursor <= len_trim(input) .and. ("atacar" == input(cursor:cursor + 5 ))) then 
            buffer = buffer // input(cursor:cursor + 5)
            buffer = replace_special_characters(buffer)
            cursor = cursor + 6
        else
            concat_failed = .true.
            buffer = ""
        end if

        if (cursor <= len_trim(input) .and. (":" == input(cursor:cursor + 0 ))) then 
            buffer = buffer // input(cursor:cursor + 0)
            buffer = replace_special_characters(buffer)
            cursor = cursor + 1
        else
            concat_failed = .true.
            buffer = ""
        end if

        if (cursor <= len_trim(input) .and. (((input(cursor:cursor) == char(32))))) then 
            buffer = buffer // input(cursor:cursor + 0)
            buffer = replace_special_characters(buffer)
            cursor = cursor + 1
        else
            concat_failed = .true.
            buffer = ""
        end if
    if (.not. concat_failed .and. len(buffer) > 0) then
        allocate( character(len=len(buffer)) :: lexeme)
        lexeme = buffer
        lexeme = lexeme // " -" // "turno"
        return
    end if
        



    concat_failed = .false.
    buffer = ""
    
        if (cursor <= len_trim(input) .and. (((iachar(tolower(input(cursor:cursor))) >= iachar("a") .and. &
        iachar(tolower(input(cursor:cursor))) <= iachar("j"))))) then 
            buffer = buffer // input(cursor:cursor + 0)
            buffer = replace_special_characters(buffer)
            cursor = cursor + 1
        else
            concat_failed = .true.
            buffer = ""
        end if
    if (.not. concat_failed .and. len(buffer) > 0) then
        allocate( character(len=len(buffer)) :: lexeme)
        lexeme = buffer
        lexeme = lexeme // " -" // "columna"
        return
    end if
        

    concat_failed = .false.
    buffer = ""
    
        if (cursor <= len_trim(input) .and. (((input(cursor:cursor) == "0")))) then 
            buffer = buffer // input(cursor:cursor + 0)
            buffer = replace_special_characters(buffer)
            cursor = cursor + 1
        else
            concat_failed = .true.
            buffer = ""
        end if

        if (cursor <= len_trim(input) .and. (((iachar(input(cursor:cursor)) >= iachar("1") .and. &
        iachar(input(cursor:cursor)) <= iachar("9"))))) then 
            buffer = buffer // input(cursor:cursor + 0)
            buffer = replace_special_characters(buffer)
            cursor = cursor + 1
        else
            concat_failed = .true.
            buffer = ""
        end if
    if (.not. concat_failed .and. len(buffer) > 0) then
        allocate( character(len=len(buffer)) :: lexeme)
        lexeme = buffer
        lexeme = lexeme // " -" // "fila"
        return
    end if
        

    concat_failed = .false.
    buffer = ""
    
        if (cursor <= len_trim(input) .and. ("10" == input(cursor:cursor + 1 ))) then 
            buffer = buffer // input(cursor:cursor + 1)
            buffer = replace_special_characters(buffer)
            cursor = cursor + 2
        else
            concat_failed = .true.
            buffer = ""
        end if
    if (.not. concat_failed .and. len(buffer) > 0) then
        allocate( character(len=len(buffer)) :: lexeme)
        lexeme = buffer
        lexeme = lexeme // " -" // "fila"
        return
    end if
        

    print *, "error lexico en col ", cursor, ', "'//input(cursor:cursor)//'"'
    lexeme = "ERROR"
end function nextSym
end module parser 
        