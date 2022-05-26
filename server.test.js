const server = require('./server');
const supertest = require('supertest')
const request = supertest.agent(server);

const code = "#include <stdio.h>\n" +
    "\n" +
    "int main(int argc, char** argv)\n" +
    "{\n" +
    "  if (argc == 2)\n" +
    "    printf(\"Hello, %s!\", argv[1]);\n" +
    "  else \n" +
    "    printf(\"Hello, World!\\n\");\n" +
    "  return 0;\n" +
    "}";
const input = "Maxim";

describe('/code_task endpoint', () => {
    it('should fail to login', async () => {
        const login = "admin"
        const password = "111112111"
        const response = await request
            .post('/login')
            .set('Connection', 'close')
            .type('x-www-form-urlencoded')
            .send(`login=${login}&password=${password}`)
            .expect(302)
            .expect('Location', '/login');
    });
    it('should login successfully', async () => {
        const login = "admin"
        const password = "11111111"
        const response = await request
            .post('/login')
            .set('Connection', 'close')
            .type('x-www-form-urlencoded')
            .send(`login=${login}&password=${password}`)
            .expect(302)
            .expect('Location', '/code_task');
    });
    it('should compile and execute properly', async () => {
        const login = "admin"
        const password = "11111111"
        const response = await request
            .post('/code_task')
            .send({code, input})
        expect(response.status).toBe(200);
        expect(response.text).toBe('Hello, Maxim!');
    });
});