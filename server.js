const http = require('http'),
    fs = require('fs');
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

function compile(file_code, file_bin, input, res) {
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

http.createServer(function (req, res) {

    if (req.url.indexOf('.html') !== -1) {
        fs.readFile(__dirname + '/public/index.html', function(err, html) {
            if (err) console.log(err)
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(html);
            res.end();
        });
    }

    if (req.url.indexOf('.css') !== -1) {
        fs.readFile(__dirname + '/public/styles.css', function(err, css) {
            if (err) console.log(err)
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(css);
            res.end();
        });
    }

    if (req.url.indexOf('frontend.js') !== -1) {
        fs.readFile(__dirname + '/public/frontend.js', function(err, js) {
            if (err) console.log(err)
            res.writeHead(200, {'Content-Type': 'text/js'});
            res.write(js);
            res.end();
        });
    }

    if (req.url.indexOf('editor.js') !== -1) {
        fs.readFile(__dirname + '/public/editor.js', function(err, js) {
            if (err) console.log(err)
            res.writeHead(200, {'Content-Type': 'text/js'});
            res.write(js);
            res.end();
        });
    }

    if (req.url.indexOf('.png') !== -1) {
        fs.readFile(__dirname + '/public/GitHub-Mark.png', function(err, img) {
            if (err) console.log(err)
            res.writeHead(200, {'Content-Type': 'image/png'});
            res.write(img);
            res.end();
        });
    }

    if (req.url.indexOf('.php') !== -1) {
        file_code = __dirname + '/executable_code/code.c';
        file_bin = __dirname + '/executable_code/code';

        let user_program = '';
        req.on('data', chunk => {
            user_program += chunk;
        });
        req.on('end', () => {
            user_program = JSON.parse(user_program)
            console.log('Got user program: ' + user_program.code);

            fs.writeFileSync(__dirname + '/executable_code/code.c', user_program.code, 'utf8')

            compile(file_code, file_bin, user_program.input, res);
        });
    }
}).listen(3000);
