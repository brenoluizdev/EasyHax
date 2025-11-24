import chalk from "chalk";
import fs from "fs";
import path from "path";

type LogLevel =
  | "info"
  | "warn"
  | "error"
  | "debug"
  | "success"
  | "event"
  | "database";

interface LoggerOptions {
  context?: string;
  saveToFile?: boolean;
}

export class LoggerFunctions {
  private context: string;
  private saveToFile: boolean;
  private logPath: string;

  constructor(options: LoggerOptions = {}) {
    this.context = options.context ?? "APP";
    this.saveToFile = options.saveToFile ?? true;

    const logsDir = path.join(process.cwd(), "logs");
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir);
    }

    this.logPath = path.join(logsDir, "app.log");
  }

  private getTimestamp() {
    return chalk.gray(new Date().toISOString());
  }

  private formatContext() {
    return chalk.blue(`[${this.context}]`);
  }

  private writeToFile(message: string) {
    if (!this.saveToFile) return;
    fs.appendFileSync(this.logPath, message + "\n");
  }

  private format(level: LogLevel, message: string) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${this.context}] [${level.toUpperCase()}] ${message}`;
  }

  private output(level: LogLevel, coloredLevel: string, message: any) {
    const final = `${this.getTimestamp()} ${this.formatContext()} ${coloredLevel} ${message}`;

    console.log(final);
    this.writeToFile(this.format(level, typeof message === "string" ? message : JSON.stringify(message)));
  }

  info(message: any) {
    this.output("info", chalk.cyan("[INFO]"), message);
  }

  warn(message: any) {
    this.output("warn", chalk.yellow("[WARN]"), message);
  }

  error(message: any, ...args: any[]) {
    this.output("error", chalk.red("[ERROR]"), message);
    if (args.length > 0) {
      console.error(...args);
    }
  }

  debug(message: any) {
    this.output("debug", chalk.magenta("[DEBUG]"), message);
  }

  success(message: any) {
    this.output("success", chalk.green("[SUCCESS]"), message);
  }

  event(message: any) {
    this.output("event", chalk.hex("#00E0FF")("[EVENT]"), message);
  }

  database(message: any) {
    this.output("database", chalk.hex("#FFA500")("[DATABASE]"), message);
  }

  static for(context: string) {
    return new LoggerFunctions({ context });
  }
}

export const logger = new LoggerFunctions({ context: "FUTHERO" });
export const roomLog = new LoggerFunctions({ context: "ROOM-MANAGER" });