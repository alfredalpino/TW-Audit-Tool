type LogLevel = "debug" | "info" | "warn" | "error";

export type LogContext = Record<string, unknown>;

function emit(level: LogLevel, message: string, context: LogContext): void {
  const entry = {
    level,
    ts: new Date().toISOString(),
    msg: message,
    ...context,
  };
  const line = JSON.stringify(entry);
  if (level === "error") {
    console.error(line);
    return;
  }
  if (level === "warn") {
    console.warn(line);
    return;
  }
  console.log(line);
}

export type Logger = {
  child: (extra: LogContext) => Logger;
  debug: (message: string, extra?: LogContext) => void;
  info: (message: string, extra?: LogContext) => void;
  warn: (message: string, extra?: LogContext) => void;
  error: (message: string, extra?: LogContext) => void;
};

export function createLogger(baseContext: LogContext = {}): Logger {
  return {
    child(extra: LogContext) {
      return createLogger({ ...baseContext, ...extra });
    },
    debug(message, extra) {
      emit("debug", message, { ...baseContext, ...extra });
    },
    info(message, extra) {
      emit("info", message, { ...baseContext, ...extra });
    },
    warn(message, extra) {
      emit("warn", message, { ...baseContext, ...extra });
    },
    error(message, extra) {
      emit("error", message, { ...baseContext, ...extra });
    },
  };
}
