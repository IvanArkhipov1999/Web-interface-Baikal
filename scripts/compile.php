<?php
function compile()
{
	$output = shell_exec('clang-11 --target=mipsel-linux-gnu -static executable_code/code.c -o executable_code/code -lm');

	return $output;
}

echo compile();
?>

