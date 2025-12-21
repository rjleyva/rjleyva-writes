// This file sets up logging for the blog application.
// It automatically adjusts log levels based on whether we're in development or production,
// and provides contextual logging so we can track where messages are coming from.

import { config, env } from './config'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

// Main logger class that handles all the logging logic
class Logger {
  private context?: string

  constructor(context?: string) {
    if (context !== undefined) {
      this.context = context
    }
  }

  // Create a new logger instance with a specific context (like 'API' or 'Cache')
  createLogger(context: string): Logger {
    return new Logger(context)
  }

  // Figure out whether we should actually log this message based on the current environment and log level setting
  private shouldLog(level: LogLevel): boolean {
    if (config.logging.level === 'none') return false
    if (config.logging.level === 'production' && env.isDevelopment) return true
    if (config.logging.level === 'development' && env.isDevelopment) return true
    if (level === 'error') return true // Always log errors
    return false
  }

  // Format the log message with timestamp, level, context, and any extra data
  private formatLogEntry(
    level: LogLevel,
    message: string,
    data?: unknown
  ): string {
    const timestamp = new Date().toISOString()
    const context = this.context !== undefined ? `[${this.context}] ` : ''
    const dataStr =
      data !== undefined ? ` ${JSON.stringify(data, null, 2)}` : ''
    return `${timestamp} ${level.toUpperCase()}: ${context}${message}${dataStr}`
  }

  // Log detailed debugging info, only shown in development
  debug(message: string, data?: unknown): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatLogEntry('debug', message, data))
    }
  }

  // Log general information messages
  info(message: string, data?: unknown): void {
    if (this.shouldLog('info')) {
      console.info(this.formatLogEntry('info', message, data))
    }
  }

  // Log warnings that might indicate potential problems
  warn(message: string, data?: unknown): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatLogEntry('warn', message, data))
    }
  }

  // Log errors with full error details - these always get logged regardless of settings
  error(message: string, error?: unknown): void {
    if (this.shouldLog('error')) {
      const errorData =
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
              name: error.name
            }
          : error

      console.error(this.formatLogEntry('error', message, errorData))
    }
  }

  // Special method for logging cache-related operations
  cache(message: string, data?: unknown): void {
    this.debug(`[Cache] ${message}`, data)
  }

  // Special method for logging rendering operations
  render(message: string, data?: unknown): void {
    this.debug(`[Render] ${message}`, data)
  }

  // Special method for logging API operations
  api(message: string, data?: unknown): void {
    this.debug(`[API] ${message}`, data)
  }
}

// The main logger instance used throughout the app
export const logger = new Logger('App')

// Helper function to create loggers for specific parts of the application
export const createLogger = (context: string): Logger => {
  return logger.createLogger(context)
}
