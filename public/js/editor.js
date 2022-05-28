var codeEditor = CodeMirror.fromTextArea(document.getElementById("code-editor"), {
  mode: "text/x-csrc",
  lineNumbers: true,
  tabSize: 2
});

codeEditor.setValue(
    "#include <stdio.h>\n" +
    "\n" +
    "int main(int argc, char** argv)\n" +
    "{\n" +
    "  if (argc == 2)\n" +
    "    printf(\"Hello, %s!\", argv[1]);\n" +
    "  else \n" +
    "    printf(\"Hello, World!\\n\");\n" +
    "  return 0;\n" +
    "}");
