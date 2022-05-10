var codeEditor = CodeMirror.fromTextArea(document.getElementById("code-editor"), {
  mode: "text/x-csrc",
  lineNumbers: true,
  tabSize: 2
});
codeEditor.setValue("void main()\n{\n  return 0;\n}\n");
