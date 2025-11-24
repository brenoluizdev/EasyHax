import { EasyRoom } from "../core/EasyRoom";

export default function anunciarGol(room: EasyRoom, team: number) {
  room.send(`🥅 Gol do time ${team}!`);
}
