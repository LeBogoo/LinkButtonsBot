import { appendFileSync, existsSync, mkdirSync } from "fs";

export class Logger {
    private logDir: string;
    private logFile: string;
    private logPath: string;
    constructor(logDir: string = "logs") {
        this.logDir = logDir;
        mkdirSync(this.logDir, { recursive: true });
        this.logFile = this.getNewLogfileName();
        this.logPath = `${this.logDir}/${this.logFile}`;
    }

    private getNewLogfileName(): string {
        let counter = 1;
        const now = new Date();
        let logFileName = `log_${now.getFullYear()}-${now.getMonth()}-${now.getDate()}.log`;
        while (existsSync(`${this.logDir}/${logFileName}`)) {
            logFileName = `log_${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${counter}.log`;
            counter++;
        }
        return logFileName;
    }

    log(...data:unknown[]): void {
        const logData = data.length == 1 ? data[0] : data;
        console.log(logData);
        appendFileSync(
            this.logPath,
            new Date().toUTCString() +
                " | " +
                JSON.stringify(logData, (k, v) => (v instanceof Map ? Object.fromEntries(v) : v)) +
                "\n"
        );
    }
}
