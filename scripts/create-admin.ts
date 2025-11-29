// NestFactory permite criar uma instância manual da aplicação Nest
// sem precisar subir um servidor HTTP. Ideal para scripts internos.
import { NestFactory } from "@nestjs/core";

// O módulo principal da sua aplicação, que contém a configuração
// do banco de dados, módulos e providers.
import { AppModule } from "../src/app.module";

// Vamos usar o UsersService para criar o usuário admin diretamente.
import { UsersService } from "../src/users/users.service";

// Biblioteca nativa do Node para ler dados digitados no terminal.
// Vamos usá-la para perguntar nome, email e senha.
import * as readline from "readline";

// Argon2 é a biblioteca moderna e segura para hash de senhas.
// Muito mais resistente que bcrypt.
import * as argon2 from "argon2";

// ----------------------------------------------------------------------------------
// FUNÇÃO ask() → serve para perguntar algo no terminal e capturar o que a pessoa digita
// ----------------------------------------------------------------------------------
async function ask(question: string): Promise<string> {
  // Criamos uma interface para permitir ler dados do terminal
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Retornamos uma Promise que resolve com a resposta escrita no terminal
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close(); // Fechamos a interface após digitar
      resolve(answer); // Retornamos o que o usuário digitou
    })
  );
}

// ----------------------------------------------------------------------------------
// FUNÇÃO PRINCIPAL DO SCRIPT: bootstrap()
// Aqui levantamos o Nest sem servidor e criamos o admin de verdade.
// ----------------------------------------------------------------------------------
async function bootstrap() {
  // Criamos um "ApplicationContext", não um servidor.
  // Isso significa que nenhum endpoint HTTP será iniciado.
  // Perfeito para rodar scripts internos com acesso ao banco.
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false, // Desliga logs visuais para ficar mais limpo
  });

  // Pegamos o UsersService do container de dependência do Nest.
  // Agora podemos usar seus métodos como se estivéssemos na API.
  const usersService = app.get(UsersService);

  // Perguntamos no terminal os dados necessários.
  const name = await ask("Nome do admin: ");
  const email = await ask("Email do admin: ");
  const password = await ask("Senha do admin: ");

  // Criamos o hash da senha usando Argon2.
  // A senha original nunca será salva no banco.
  const passwordHash = await argon2.hash(password);

  // Chamamos o service do Nest para criar o usuário.
  // Aqui assumimos que o UsersService possui um método create()
  // que salva o usuário no banco.
  await usersService.create({
    name,
    email,
    passwordHash,
    role: "admin", // definimos explicitamente que este usuário é admin
  });

  // Informamos no terminal que está tudo certo.
  console.log("\nAdmin criado com sucesso! 🚀");

  // Fechamos a aplicação Nest para liberar recursos.
  await app.close();
}

// Executa o script
bootstrap();
