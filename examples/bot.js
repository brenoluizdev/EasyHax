const { EasyRoom } = require("../dist/index.js");

const room = new EasyRoom({
  name: "EasyHax Server",
  maxPlayers: 12,
  token: "thr1.AAAAAGkk2z35sRlr7ot1XA.SA5R-9pd4ic",
  public: false
});

room.onJoin((player) => {
    room.send(`Bem vindo, ${player.name}!`);
});

room.command("!ola", (player, room) => {
  room.send(`Olá, ${player.name}!`);
});

room.start();