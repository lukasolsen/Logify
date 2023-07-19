import {
  generateUniqueID,
  logLevelExist,
  getLogLevel,
  getLogLevelName,
} from '../constants/LogLevels';
import {
  LogType,
  LogOptions,
  LogLevelValueType,
  LogLevelUsageType,
} from '../types/logManager';
import {formatTextAllDependencies} from './log-modifier';
import {ConsoleTransport, LogLocation, transport} from './logLocation';
import {logClusterOptions} from '../types/logCluster';
import {FormatManager} from './log-modifiers';

/**
 * A class that represents a log cluster.
 * @class LogCluster
 */
export class LogCluster {
  private logClusterName: string;
  private logClusterID: string;
  private logLocations: LogLocation[];

  constructor(logClusterOptions?: logClusterOptions) {
    this.logClusterName =
      logClusterOptions?.logClusterName || this.generateRandomName();
    this.logClusterID = generateUniqueID();
    this.logLocations = Array.isArray(logClusterOptions?.logLocations)
      ? logClusterOptions?.logLocations
      : logClusterOptions?.logLocations
      ? [logClusterOptions.logLocations]
      : [];
  }

  /**
   * Add a log to the cluster.
   * @param {LogType} log
   * @return {void}
   * @example
   * const logCluster = new LogCluster();
   * logCluster.addLog({ logLevel: 'INFO', message: 'Hello World', timestamp: 123456789 });
   * @throws {Error} - If the log level does not exist.
   */
  private addLog(logLocation: LogLocation, log: LogType): void {
    if (!logLevelExist(log.logLevel)) {
      throw new Error(`Log level ${log.logLevel} does not exist.`);
    }

    const logLevel = getLogLevel(log.logLevel);
    log.logLevel = logLevel;

    logLocation.addLog(log);
  }

  /**
   * Generates a random name for the log cluster.
   * @deprecated
   * @return {string} - A string representing the name of the log cluster.
   * @example
   * const logCluster = new LogCluster();
   * logCluster.generateRandomName(); // LogCluster-123456789
   */
  private generateRandomName(): string {
    return 'LogCluster-' + generateUniqueID();
  }

  public addLogLocation(logLocations: LogLocation | LogLocation[]) {
    if (Array.isArray(logLocations)) {
      this.logLocations.push(...logLocations);
    } else {
      this.logLocations.push(logLocations);
    }
  }

  public log(
    logLevel: LogLevelUsageType,
    message: string,
    options?: LogOptions
  ): void {
    options = options || {};

    const log = this.generateLogData(logLevel, message, options);
    const {text, colors} = formatTextAllDependencies(log);

    for (const logLocations of this.logLocations) {
      this.addLog(this.logLocations[0], log);
      logLocations.log(text, colors);
    }
    //console.log(text, ...colors);
  }

  public setFormat(format: string): void {
    FormatManager.getInstance().setFormat(format);
  }

  private generateLogData(
    logLevel: LogLevelUsageType,
    message: string,
    options?: LogOptions
  ): LogType {
    options = options || {};

    logLevel = getLogLevelName(logLevel) || getLogLevelName(1);

    const log: LogType = {
      id: generateUniqueID(),
      logLevel: logLevel || 'INFO',
      message: message,
      timestamp: Date.now(),
    };
    return log;
  }
}

//TODO: Need to add logLocation support
//TODO: Will be used from Logger, and will hold the LogLocations, aka the loggers. Each logger will hold each logs.
