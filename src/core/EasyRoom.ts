import HaxballJS from "haxball.js";
import { ActionManager } from "./ActionManager";
import { CommandManager } from "./CommandManager";
import { logger } from "../utils/logger";

export class EasyRoom {
  private room!: RoomObject;
  private actions: ActionManager;
  private commands: CommandManager;

  constructor(private options: RoomConfigObject) {
    this.actions = new ActionManager(this);
    this.commands = new CommandManager(this);
  }

  async start() {
    const HBInit = await HaxballJS();
    this.room = HBInit({
      roomName: this.options.roomName || "EasyHax Server",
      maxPlayers: this.options.maxPlayers ?? 12,
      password: this.options.password || undefined,
      token: this.options.token || "",
      public: this.options.public || true,
      noPlayer: this.options.noPlayer || true,
      geo: this.options.geo || { code: "br", lat: 0, lon: 0 },
      playerName: this.options.playerName || "EasyHax Bot",
      proxy: (this.options as any).proxy || "",
      debug: (this.options as any).debug || false,
    });

    this.setupEvents();
  }

  private setupEvents() {
    this.room.onPlayerJoin = (player: any) =>
      this.actions.run("onJoin", player);

    this.room.onPlayerLeave = (player: any) =>
      this.actions.run("onLeave", player);

    this.room.onPlayerChat = (player: PlayerObject, msg: string): boolean => {
      return !!this.commands.handle(player, msg);
    };

    this.room.onRoomLink = (link: string) => {
      logger.debug(`Room link: ${link}`);
    };

    this.room.onTeamGoal = (team: number) => this.actions.run("onGoal", team);
  }

  send(msg: string) {
    this.room.sendAnnouncement(msg);
  }

  onJoin(handlerOrName: string | Function) {
    this.actions.register("onJoin", handlerOrName);
  }

  onLeave(handlerOrName: string | Function) {
    this.actions.register("onLeave", handlerOrName);
  }

  onGoal(handlerOrName: string | Function) {
    this.actions.register("onGoal", handlerOrName);
  }

  command(cmd: string, handler: any) {
    this.commands.register(cmd, handler);
  }
}