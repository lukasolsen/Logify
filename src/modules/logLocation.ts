import Logger from '../Logger';
import {TransportFunction} from '../types/logLocation';
import {LogType} from '../types/logManager';

export function transport(): ClassDecorator {
  return function (target: Function) {
    target.prototype.addTransport = function (transportFn: TransportFunction) {
      transportFn(this);
    };
  };
}

export abstract class LogLocation {
  private id: string = this.generateId();
  private logs: LogType[] = [];

  public abstract log(message: string, colors?: string[]): void;
  //Make a custom id without having to require the transport or anything making it.

  private generateId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  public getId(): string {
    return this.id;
  }

  public addLog(log: LogType): void {
    this.logs.push(log);
  }

  public getLogs(): LogType[] {
    return this.logs;
  }

  public getLog(id: string): LogType {
    return this.logs.find((log) => log.id === id);
  }

  public getRecentLog(): LogType {
    return this.logs[this.logs.length - 1];
  }
}

/**
 * ConsoleTransport Transport
 */
export class ConsoleTransport extends LogLocation {
  public log(message: string, colors?: string[]): void {
    console.log(message, ...colors);
  }
}

/**
 * FileTransport Transport
 */
export class FileTransport extends LogLocation {
  public log(message: string, colors?: string[]): void {
    throw new Error('Method not implemented.');
  }
}