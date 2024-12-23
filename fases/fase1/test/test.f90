program test
	use parser
	implicit none
	character(len=100) :: filename
	character(len=:), allocatable :: input
	integer :: u, len
	logical :: exists

	if (command_argument_count() == 0) then
		print *, "error: no input file"
		stop
	end if

	call get_command_argument(1, filename)

	inquire(file=filename, exist=exists, size=len)
	if (exists) then
		open (1, file=filename, status='old', action='read', access='stream', form='unformatted')
		allocate (character(len=len) :: input)
        read (1) input
		call parse(input)
        !print *, input
	else
		print *, "error: file is not present"
		stop
	end if

	close(u)

end program test