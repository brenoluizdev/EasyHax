import path from "path";

export class ActionManager {
  private actions: Record<string, Array<Function>> = {};

  constructor(private room: any) {}

  register(event: string, handlerOrName: string | Function) {
    if (!this.actions[event]) this.actions[event] = [];

    if (typeof handlerOrName === "function") {
      this.actions[event].push(handlerOrName);
      return;
    }

    const actionFn = this.loadAction(handlerOrName);
    if (actionFn) this.actions[event].push(actionFn);
  }

  run(event: string, ...args: any[]) {
    const handlers = this.actions[event] || [];
    for (const fn of handlers) fn(...args);
  }

  private loadAction(name: string) {
    try {
      const actionPath = path.join(__dirname, "..", "actions", name);
      const action = require(actionPath);
      return action.default || action;
    } catch (err) {
      console.error(`Action '${name}' not found.`);
      return null;
    }
  }
}
