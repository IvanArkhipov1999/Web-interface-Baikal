<?php
$file_code = '/home/ivan-arhipych/Web-interface-Baikal/executable_code/code.c';
$file_bin = '/home/ivan-arhipych/Web-interface-Baikal/executable_code/code';

function compile()
{
	global $file_code, $file_bin;

	$output = shell_exec('clang-11 --target=mipsel-linux-gnu -static ' . $file_code . ' -o ' . $file_bin . ' -lm');

	return $output;
}

function send()
{
	global $file_bin;

	$output = shell_exec('sshpass -p "" scp -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -oKexAlgorithms=+diffie-hellman-group1-sha1 -q ' . $file_bin . ' root@baikal.softcom.su:/root/app');

	return $output;
}

function execute()
{
	$output = shell_exec('sshpass -p "" ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -oKexAlgorithms=+diffie-hellman-group1-sha1 -q root@baikal.softcom.su "/root/app"');

	return $output;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	$request_json = json_decode(file_get_contents('php://input'));

	file_put_contents($file_code, $request_json->code);

	echo compile();
	echo send();
	echo execute();
}
?>