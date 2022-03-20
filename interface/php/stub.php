<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $request_json = json_decode(file_get_contents('php://input')); 
  echo "Preparing to compile code:\n" 
    . $request_json->code
    . "\nwith input data:\n"
    . $request_json->input;
}
?>
