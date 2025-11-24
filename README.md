# ⚽ EasyHax

**EasyHax** — A maneira mais fácil e moderna de criar bots e servidores para o Haxball Headless.

> Uma camada de abstração sobre `haxball.js` com eventos simplificados, comandos, auto-load de actions e arquitetura plug-and-play.  
> Projetado para iniciantes e desenvolvedores que querem prototipar rápido sem perder extensibilidade.

---

![EasyHax](https://raw.githubusercontent.com/brenoluizdev/easyhax/main/assets/logo.png)

## Índice

- [⚽ EasyHax](#-easyhax)
  - [Índice](#índice)
  - [Recursos](#recursos)
  - [Instalação](#instalação)
  - [Quickstart](#quickstart)
  - [API](#api)
    - [`new EasyRoom(options)`](#new-easyroomoptions)
    - [`room.start()`](#roomstart)
    - [Eventos (shortcuts)](#eventos-shortcuts)
    - [`room.command(cmd, handler)`](#roomcommandcmd-handler)
    - [`room.send(message)`](#roomsendmessage)
  - [Actions (autoload)](#actions-autoload)
  - [Comandos](#comandos)
  - [Exemplo completo (bot.js)](#exemplo-completo-botjs)
  - [Estrutura recomendada do projeto](#estrutura-recomendada-do-projeto)
    - [Exemplo de `actions/anunciarGol.js`](#exemplo-de-actionsanunciargoljs)
  - [Configurações e Build](#configurações-e-build)
  - [Troubleshooting](#troubleshooting)
    - [`onJoin` não dispara](#onjoin-não-dispara)
    - [`Action 'x' not found`](#action-x-not-found)
    - [`Cannot use import statement outside a module`](#cannot-use-import-statement-outside-a-module)
  - [Roadmap](#roadmap)
  - [Contribuição](#contribuição)
  - [Licença](#licença)

---

## Recursos

- Abstração simples dos eventos do Haxball: `onJoin`, `onLeave`, `onGoal`, `onChat` (e mais).
- `room.command()` para criar comandos com pouca boilerplate.
- Sistema de **actions** carregáveis por nome (autoload) e handlers inline (funções).
- Compatível com TypeScript (tipagens `.d.ts`) e build ESM/CJS via `tsup`.
- Logger embutido com níveis (`debug`, `info`, `warn`, `error`).
- Plugin-friendly: arquitetura pensada para extensões.

---

## Instalação

```bash
npm install easyhax
# ou
yarn add easyhax
```

> Se estiver trabalhando localmente durante o desenvolvimento, você pode usar `npm link` para testar o pacote localmente.

---

## Quickstart

Crie `bot.js` simples:

```js
const { EasyRoom } = require("easyhax");

const room = new EasyRoom({
  roomName: "EasyHax Server",
  maxPlayers: 12,
  token: "SEU_TOKEN_DO_HAXBALL",
  public: false,
  noPlayer: false, // importante: false para receber eventos
});

// Handler inline
room.onJoin((player) => {
  room.send(`👋 Bem-vindo, ${player.name}!`);
});

// Comando personalizado
room.command("!ola", (player, room) => {
  room.send(`Olá, ${player.name}!`);
});

room.start();
```

Execute:

```bash
node bot.js
```

---

## API

### `new EasyRoom(options)`

**Opções** (exemplo):

```ts
{
  roomName?: string;
  maxPlayers?: number;
  password?: string;
  token?: string;
  public?: boolean;
  noPlayer?: boolean; // padrão: false
  geo?: { code: string; lat: number; lon: number };
  playerName?: string;
  proxy?: string;
  debug?: boolean;
}
```

### `room.start()`

Inicializa a conexão com o Haxball Headless e registra os handlers internos.

### Eventos (shortcuts)

- `room.onJoin(handlerOrActionName)`  
- `room.onLeave(handlerOrActionName)`  
- `room.onGoal(handlerOrActionName)`  
- `room.onChat(handler)` (quando implementado)

Cada `handlerOrActionName` pode ser:
- uma **função**: `(player, room) => { ... }`
- uma **string**: `"nomeDaAction"` — que carrega `actions/nomeDaAction.js`

### `room.command(cmd, handler)`

Registra um comando. `handler` é função `(player, room, args)` ou uma string (mensagem simples).

### `room.send(message)`

Envia uma mensagem para a sala (chat).

---

## Actions (autoload)

Você pode criar ações para reutilizar lógica. Ex.: `actions/bemVindo.js`:

```js
module.exports = (room, player) => {
  room.send(`👋 Bem-vindo ${player.name}!`);
};
```

E ativar assim:

```js
room.onJoin("bemVindo");
```

Internamente a lib procura por `actions/<name>.js` dentro do pacote ou copiado em `dist/actions` quando construído.

> Dica: se preferir não usar actions por arquivo, registre handlers inline com `room.onJoin(fn)`.

---

## Comandos

Registrar comandos simples:

```js
room.command("!ping", (player, room) => {
  room.send("pong");
});
```

Ou com resposta fixa (string):

```js
room.command("!site", "https://meusite.com");
```

O `CommandManager` permite registrar handlers que recebem `(player, room, args)`.

---

## Exemplo completo (bot.js)

```js
const { EasyRoom } = require("easyhax");

const room = new EasyRoom({
  roomName: "Servidor Exemplo",
  maxPlayers: 12,
  token: process.env.HAX_TOKEN || "",
  public: false,
  noPlayer: false
});

room.onJoin((player) => {
  room.send(`Seja bem-vindo, ${player.name}!`);
});

room.onGoal((team) => {
  const teamName = team === 1 ? "🔴 Vermelho" : "🔵 Azul";
  room.send(`GOOOOL do ${teamName}!`);
});

room.command("!players", (player, room) => {
  // exemplo: listar jogadores
  const names = room.listPlayers ? room.listPlayers() : "não suportado";
  room.send(typeof names === "string" ? names : names.join(", "));
});

room.start();
```

---

## Estrutura recomendada do projeto

```
meu-bot/
├─ actions/
│  ├─ bemVindo.js
│  └─ anunciarGol.js
├─ bot.js
├─ package.json
```

### Exemplo de `actions/anunciarGol.js`

```js
module.exports = (room, team) => {
  const teamName = team === 1 ? "🔴 Vermelho" : "🔵 Azul";
  room.send(`⚽ GOOOOOL do ${teamName}!`);
};
```

---

## Configurações e Build

Recomendado usar `tsup` para compilar ESM e CJS:

**tsup.config.ts**

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  format: ["esm", "cjs"],
  outDir: "dist",
  clean: true,
  onSuccess: "cp -r src/actions dist/actions"
});
```

**package.json (exemplo)**

```json
{
  "name": "easyhax",
  "type": "module",
  "main": "dist/index.cjs",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "dev": "tsup --watch",
    "build": "tsup",
    "test": "node examples/bot.cjs"
  }
}
```

---

## Troubleshooting

### `onJoin` não dispara
- Certifique-se `noPlayer: false`. Se `noPlayer` for `true`, o bot será espectador invisível e não receberá eventos normalmente.
- Confirme token válido e que a sala está sendo criada corretamente.

### `Action 'x' not found`
- Verifique se `actions/x.js` existe e exporta `module.exports = (room, ...) => {}`.
- No build, confirme que `dist/actions` foi gerado/copied.

### `Cannot use import statement outside a module`
- Defina `"type": "module"` no `package.json` para usar `import`/ESM.
- Ou use a versão CJS (`require`) e `dist/index.cjs`.

---

## Roadmap

- [x] Eventos básicos: join, leave, goal
- [x] Sistema de comandos simples
- [x] Autoload de actions
- [x] Tipagens TypeScript básicas
- [ ] Sistema de plugins externo (plugin marketplace)
- [ ] Painel web de administração
- [ ] Suporte a matches e torneios
- [ ] Documentação online (docs.easyhax.dev)

---

## Contribuição

Contribuições são bem-vindas!  
Abra issues, envie PRs, crie actions úteis e compartilhe templates de servidores.

Padrões:
- Use `prettier` e `eslint`
- Escreva testes básicos quando possível
- Documente novas features no README

---

## Licença

MIT © EasyHax

---

**Obrigado por usar EasyHax!**  
Se quiser, eu posso também compor um `CHANGELOG.md`, `CONTRIBUTING.md` e templates de issues/PR.
