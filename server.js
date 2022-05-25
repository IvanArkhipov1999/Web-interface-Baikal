const express = require('express');
const app = express();
const fs = require('fs')

const { exec } = require('child_process');

function process_error(error, stderr, res) {
    let message;
    if (error) {
        message = error.message;
        console.log(`error: ${error.message}`);
    } else {
        message = stderr;
        console.log(`stderr: ${stderr}`);
    }
    res.writeHead(500, {'Content-Type': 'text'});
    res.write(message);
    res.end();
}

function compile_and_run(file_code, file_bin, input, res) {
    exec(`clang -static ${file_code} -o ${file_bin} -lm`, (error, stdout, stderr) => {
        if (error || stderr) {
            process_error(error, stderr, res);
            return
        }

        console.log('COMPILED');
        send_stub(file_bin, input, res);
    });
}

function send_stub(file_bin, input, res) {
    exec('echo place-your-sending-script-here', (error, stdout, stderr) => {
        if (error || stderr) {
            process_error(error, stderr, res);
            return
        }

        console.log('SENT')
        run_stub(file_bin, input, res)
    });
}

function run_stub(file_bin, input, res) {
    exec(`${file_bin} ${input}`, (error, stdout, stderr) => {
        if (error || stderr) {
            process_error(error, stderr, res);
            return
        }

        console.log('RUN')
        res.writeHead(200, {'Content-Type': 'text'});
        res.write(stdout);
        res.end();
    });
}

const port = 3000;
const code_dir = 'executable_code'

app.use(express.static('public'))

app.post('/code_task', function(req, res){
    let code_file = `${__dirname}/${code_dir}/code.c`;
    let bin_file = `${__dirname}/${code_dir}/code`;

    let user_program = '';
    req.on('data', chunk => {
        user_program += chunk;
    });
    req.on('end', () => {
        user_program = JSON.parse(user_program)
        console.log('Got user program: ' + user_program.code);

        fs.writeFileSync(code_file, user_program.code, 'utf8')

        compile_and_run(code_file, bin_file, user_program.input, res);
    });
})

app.listen(port, () =>
    console.log('Example app listening on port 3000!')
)
