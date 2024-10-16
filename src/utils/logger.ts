import pinoPretty from 'pino-pretty';
import dayjs from "dayjs";
import pino from 'pino';

const loggerConfig = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            ignore: 'pid,hostname'
        }
    }
});

export const logger = (level: 'info' | 'error', message: string) => {
    const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
    loggerConfig[level](`${timestamp} - ${message}`);
};