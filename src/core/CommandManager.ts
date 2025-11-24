export class CommandManager {
  private commands: Map<string, Function> = new Map();

  constructor(private easyRoom: any) {}

  register(cmd: string, handler: Function | string) {
    if (typeof handler === "string") {
      this.commands.set(cmd, () => {
        this.easyRoom.send(handler);
      });
    } else {
      this.commands.set(cmd, handler);
    }
  }

  handle(player: any, msg: string): boolean {
    const cmd = this.commands.get(msg);
    if (!cmd) return false;

    cmd(player, this.easyRoom);
    return true;
  }
}