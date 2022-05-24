var codeEditor = CodeMirror.fromTextArea(document.getElementById("code-editor"), {
  mode: "text/x-csrc",
  lineNumbers: true,
  tabSize: 2
});
codeEditor.setValue(
    "#include <stdio.h>\n" +
    "\n" +
    "int main()\n" +
    "{\n" +
    "  printf(\"Hello, World!\\n\");\n" +
    "  return 0;\n" +
    "}");
