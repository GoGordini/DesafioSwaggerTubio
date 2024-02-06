import winston from 'winston';
import { environment } from './config.js';

const ENVIRONMENT = environment;
let logger;

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: "magenta",
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: "gray",
        debug: 'blue'
    }
};

if(ENVIRONMENT === 'PRODUCTION') {
    //prodLogger
    logger = winston.createLogger({
        levels: customLevelOptions.levels,
        transports: [
            new winston.transports.Console({
                level: 'debug',
                format: winston.format.combine(
                    winston.format.colorize({
                        all: true,
                        colors: customLevelOptions.colors
                    }),
                    winston.format.simple()
                )
            })
        ]
    });
} else {
    //devLogger
   logger = winston.createLogger({
        levels: customLevelOptions.levels,
        transports: [
            new winston.transports.Console({
                level: 'info',
                format: winston.format.combine(
                    winston.format.colorize({
                        all: true,
                        colors: customLevelOptions.colors
                    }),
                    winston.format.simple()
                )
            }),
            new winston.transports.File({
                filename: 'logs/errors.log',
                level: 'error'
            })
        ]
    });
}

//vamos a crear nuestro logger, donde vamos a definir nuestro transporte (s) y el nivel en el cual van a trabajar
// const logger = winston.createLogger({
//     transports: [
//         new winston.transports.Console({
//             level: 'info'
//         }),
//         new winston.transports.File({
//             filename: 'logs/dev.log',
//             level: 'warn'
//         })
//     ]
// });

export const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toISOString()}`);
    next();
}