export interface LogPayload {
  event: string;
  orderId?: string;
  sareeId?: string;
  ms?: number;
  [key: string]: unknown;
}

export const logger = {
  info: (payload: LogPayload) => {
    console.log(JSON.stringify({ level: "info", timestamp: new Date().toISOString(), ...payload }));
  },
  warn: (payload: LogPayload) => {
    console.warn(JSON.stringify({ level: "warn", timestamp: new Date().toISOString(), ...payload }));
  },
  error: (payload: LogPayload) => {
    console.error(JSON.stringify({ level: "error", timestamp: new Date().toISOString(), ...payload }));
  },
};
