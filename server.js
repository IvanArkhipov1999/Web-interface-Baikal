const express = require('express');
const app = express();
var session = require('express-session');
var hash = require('pbkdf2-password')();

const fs = require('fs')

const { exec } = require('child_process');
const path = require("path");

app.use(express.urlencoded({ extended: false }))
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'secret'
}));

app.get('/', function(req, res){
    res.redirect('/login');
});

app.use('/public', express.static('public'));

app.get('/login', function(req, res){
    res.sendFile(path.join(__dirname, '/public/1.html'));
});

app.post('/login', function (req, res, next) {
    authenticate(req.body.login, req.body.password, function(err, user){
        if (err) return next(err)
        if (user) {
            req.session.regenerate(function(){
                req.session.user = user;
                req.session.success = 'Authenticated as ' + user.name;
                res.redirect('/code_task');
            });
        } else {
            req.session.error = 'Authentication failed';
            res.redirect('/login');
        }
    });
});

function restrict(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}

function authenticate(login, pass, fn) {
    if (!module.parent) console.log('authenticating %s:%s', login, pass);
    const users_db = {
        'admin': {name: 'admin'}
    };
    const user = users_db[login];
    if (!user) return fn(null, null)

    hash({ password: '11111111' }, function (err, admin_pass, admin_salt, admin_hash) {
        if (err) throw err;
        user.salt = admin_salt;
        user.hash = admin_hash;

        hash({ password: pass, salt: user.salt }, function (err, pass, salt, hash) {
            if (err) return fn(err);
            if (hash === user.hash) return fn(null, user)
            fn(null, null)
        });
    });
}

app.get('/code_task', restrict, function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.post('/code_task', restrict, function(req, res){
    try {
        const code_dir = `${__dirname}/executable_code`;
        const code_file = `${code_dir}/code.c`;
        const bin_file = `${code_dir}/code`;

        let user_program = '';
        req.on('data', chunk => {
            user_program += chunk;
        });
        req.on('end', () => {
            user_program = JSON.parse(user_program);
            console.log('Got user program: ' + user_program.code);

            fs.mkdirSync(code_dir, {recursive: true});
            fs.writeFileSync(code_file, user_program.code, 'utf8');

            compile_and_run(code_file, bin_file, user_program.input, res);
        });
    } catch (error) {
        console.log('Internal error: ' + error.message);
        res.status(500).send("Internal error: " + error.message);
    }
})

module.exports = app;

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
    exec(`clang-11 --target=mipsel-linux-gnu -static ${file_code} -o ${file_bin} -lm`, (error, stdout, stderr) => {
        if (error || stderr) {
            process_error(error, stderr, res);
            return;
        }

        console.log('COMPILED');
        send_stub(file_bin, input, res);
    });
}

function send_stub(file_bin, input, res) {
    exec(`sshpass -p "" scp -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -oKexAlgorithms=+diffie-hellman-group1-sha1 -q ${file_bin} root@baikal.softcom.su:/root/app`, (error, stdout, stderr) => {
        if (error || stderr) {
            process_error(error, stderr, res);
            return;
        }

        console.log('SENT');
        run_stub(file_bin, input, res);
    });
}

function run_stub(file_bin, input, res) {
    exec(`sshpass -p "" ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -oKexAlgorithms=+diffie-hellman-group1-sha1 -q root@baikal.softcom.su "/root/app ${input}" `, (error, stdout, stderr) => {
        if (error || stderr) {
            process_error(error, stderr, res);
            return;
        }

        console.log('RUN');
        res.writeHead(200, {'Content-Type': 'text'});
        res.write(stdout);
        res.end();
    });
}
