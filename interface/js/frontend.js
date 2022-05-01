const backendUrl = 'php/stub.php'

function assembleRequestContent() {
    codeEditor.save();
    const programCode = document.getElementById('code-editor').value;
    const programInput = document.getElementsByName('input_data')[0].value;

    var content = {};
    content.code = programCode;
    content.input = programInput;

    return content;
}

function compileRemotely() {
    const contentStr = JSON.stringify(assembleRequestContent());

    fetch(backendUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: contentStr
    }).then(response => {
        response.text().then(data => {
            document.getElementById('output').innerHTML = data;
        }); 
    });
} 
