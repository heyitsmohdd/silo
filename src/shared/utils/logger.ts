export const logger = {
    info: (message: string, meta: Record<string, any> = {}) => {
        log('INFO', message, meta);
    },
    warn: (message: string, meta: Record<string, any> = {}) => {
        log('WARN', message, meta);
    },
    error: (message: string, error?: Error, meta: Record<string, any> = {}) => {
        log('ERROR', message, {
            ...meta,
            error: error?.message,
            stack: error?.stack,
        });
    },
    debug: (message: string, meta: Record<string, any> = {}) => {
        if (process.env['NODE_ENV'] !== 'production') {
            log('DEBUG', message, meta);
        }
    },
};

const log = (level: string, message: string, meta: Record<string, any>) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        ...meta,
    };

    // In production, log as a single JSON line for easy parsing by Render/Datadog/Logtail etc.
    if (process.env['NODE_ENV'] === 'production') {
        process.stdout.write(JSON.stringify(logEntry) + '\n');
    } else {
        // Pretty print in development
        const metaString = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
        const color = level === 'ERROR' ? '\x1b[31m' : level === 'WARN' ? '\x1b[33m' : level === 'INFO' ? '\x1b[36m' : '\x1b[32m';
        const reset = '\x1b[0m';
        console.log(`[${logEntry.timestamp}] ${color}[${level}]${reset} ${message}${metaString}`);
    }
};
