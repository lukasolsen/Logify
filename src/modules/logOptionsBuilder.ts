import {LevelUsageType, LogOptions} from '../types/logManager';

export class LogOptionsBuilder {
  private options: LogOptions;

  constructor() {
    this.options = {};
  }

  public setLevel(level: LevelUsageType): LogOptionsBuilder {
    this.options.level = level;
    return this;
  }

  public build(): LogOptions {
    return this.options;
  }
}
