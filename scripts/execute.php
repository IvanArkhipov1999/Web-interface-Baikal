<?php
function send()
{
	$output = shell_exec('sshpass -p "" scp -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -oKexAlgorithms=+diffie-hellman-group1-sha1 -q executable_code/code root@baikal.softcom.su:/root/app');

	return $output;
}

function execute()
{
	$output = shell_exec('sshpass -p "" ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -oKexAlgorithms=+diffie-hellman-group1-sha1 -q root@baikal.softcom.su "/root/app"');

	return $output;
}

echo send();
echo execute();
?>

