<?php
function compile()
{
	$output = shell_exec('clang-11 --target=mipsel-linux-gnu -static /home/ivan-arhipych/Web-interface-Baikal/executable_code/code.c -o /home/ivan-arhipych/Web-interface-Baikal/executable_code/code -lm');

	return $output;
}

function send()
{
	$output = shell_exec('sshpass -p "" scp -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -oKexAlgorithms=+diffie-hellman-group1-sha1 -q /home/ivan-arhipych/Web-interface-Baikal/executable_code/code root@baikal.softcom.su:/root/app');

	return $output;
}

function execute()
{
	$output = shell_exec('sshpass -p "" ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -oKexAlgorithms=+diffie-hellman-group1-sha1 -q root@baikal.softcom.su "/root/app"');

	return $output;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $request_json = json_decode(file_get_contents('php://input')); 
//  echo "Preparing to compile code:\n" 
//    . $request_json->code
//    . "\nwith input data:\n"
//    . $request_json->input;

  $file_code = '/home/ivan-arhipych/Web-interface-Baikal/executable_code/code.c';
  file_put_contents($file_code, $request_json->code);

  echo "aaa";
  echo compile();
  echo send();
  echo execute();
}
?>
