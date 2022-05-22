<?php
$file_code = '/home/ivan-arhipych/Web-interface-Baikal/executable_code/code.c';
$file_bin = '/home/ivan-arhipych/Web-interface-Baikal/executable_code/code';

$input;

$queue_code = new SplQueue();
$queue_input = new SplQueue();

function compile()
{
	global $file_code, $file_bin;

	$output = shell_exec('clang-11 --target=mipsel-linux-gnu -static ' . $file_code . ' -o ' . $file_bin . ' -lm 2>&1');

	return $output;
}

function send()
{
	global $file_bin;

	$output = shell_exec('sshpass -p "" scp -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -oKexAlgorithms=+diffie-hellman-group1-sha1 -q ' . $file_bin . ' root@baikal.softcom.su:/root/app 2>&1');

	return $output;
}

function execute()
{
	global $input;

	$output = shell_exec('sshpass -p "" ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -oKexAlgorithms=+diffie-hellman-group1-sha1 -q root@baikal.softcom.su "/root/app ' . $input . ' " 2>&1');

	return $output;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	$request_json = json_decode(file_get_contents('php://input'));

	$queue_code->enqueue($request_json->code);
	$queue_input->enqueue($request_json->input);
}

while (!$queue_code->isEmpty() && !$queue_input->isEmpty()) {
	file_put_contents($file_code, $queue_code->dequeue());
	$input = $queue_input->dequeue();

	$output_compile = compile();
	if ($output_compile == "") {
		echo send();
		echo execute();
	}
	else {
		echo "Ошибка компиляции:\n";
		echo $output_compile;
	}
}

?>
