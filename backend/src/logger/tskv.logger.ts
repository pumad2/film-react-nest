import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  formatValue(value: any) {
    if (typeof value === 'string') {
      return value;
    }

    return JSON.stringify(value);
  }

  formatMessage(level: string, message: any, ...optionalParams: any[]) {
    const params = optionalParams.map((param, index) => {
      return `param${index + 1}=${this.formatValue(param)}`;
    });

    return (
      [
        `level=${level}`,
        `message=${this.formatValue(message)}`,
        ...params,
      ].join('\t') + '\n'
    );
  }

  log(message: any, ...optionalParams: any[]): void {
    process.stdout.write(this.formatMessage('log', message, ...optionalParams));
  }
  error(message: any, ...optionalParams: any[]): void {
    process.stdout.write(
      this.formatMessage('error', message, ...optionalParams),
    );
  }
  warn(message: any, ...optionalParams: any[]): void {
    process.stdout.write(
      this.formatMessage('warn', message, ...optionalParams),
    );
  }
}
