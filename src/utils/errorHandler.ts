// This file provides a complete error handling system for the blog application.
// It standardizes how errors are created, logged, and handled throughout the app,
// making debugging easier and user experience more consistent.

import { createLogger } from './logger'

export interface AppError {
  message: string
  code?: string
  cause?: Error
  context?: Record<string, unknown>
}

// Custom error class that extends the built-in Error but adds extra fields
// like error codes and additional context for better debugging
export class ApplicationError extends Error implements AppError {
  override name: string
  code?: string
  override cause?: Error
  context?: Record<string, unknown>

  constructor(
    message: string,
    options?: {
      code?: string
      cause?: Error
      context?: Record<string, unknown>
    }
  ) {
    super(message)
    this.name = 'ApplicationError'
    if (options?.code !== undefined) {
      this.code = options.code
    }
    if (options?.cause !== undefined) {
      this.cause = options.cause
    }
    if (options?.context !== undefined) {
      this.context = options.context
    }
  }
}

// Main error handling class that provides consistent error processing across the app
export class ErrorHandler {
  private logger = createLogger('ErrorHandler')

  // Process an error - log it and either return it or rethrow it depending on options
  handle(
    error: unknown,
    context?: string,
    options?: {
      silent?: boolean
      rethrow?: boolean
    }
  ): ApplicationError {
    const appError = this.normalizeError(error)
    const errorContext = context ?? 'Unknown'

    if (options?.silent !== true) {
      this.logger.error(`Error in ${errorContext}`, appError)
    }

    if (options?.rethrow === true) {
      throw appError
    }

    return appError
  }

  // Convert any kind of error (string, Error object, or unknown) into our standardized ApplicationError
  private normalizeError(error: unknown): ApplicationError {
    if (error instanceof ApplicationError) {
      return error
    }

    if (error instanceof Error) {
      return new ApplicationError(error.message, {
        code: 'GENERIC_ERROR',
        cause: error
      })
    }

    if (typeof error === 'string') {
      return new ApplicationError(error, {
        code: 'STRING_ERROR'
      })
    }

    return new ApplicationError('An unknown error occurred', {
      code: 'UNKNOWN_ERROR',
      context: { originalError: error }
    })
  }

  // Handle errors in async operations, with an optional fallback value to return if something fails
  async handleAsync<T>(
    operation: () => Promise<T>,
    context: string,
    fallback?: T
  ): Promise<T | null> {
    try {
      return await operation()
    } catch (error) {
      this.handle(error, context)
      return fallback ?? null
    }
  }

  // Handle errors in regular synchronous operations, with an optional fallback value
  handleSync<T>(operation: () => T, context: string, fallback?: T): T | null {
    try {
      return operation()
    } catch (error) {
      this.handle(error, context)
      return fallback ?? null
    }
  }
}

// Single shared instance of the error handler that can be used throughout the app
export const errorHandler = new ErrorHandler()

// Simple helper function for React components that need to handle errors consistently
export const handleError = (
  error: unknown,
  context: string
): ApplicationError => {
  return errorHandler.handle(error, context)
}

// Helper for handling async errors in React hooks, with optional fallback values
export const handleAsyncError = async <T>(
  operation: () => Promise<T>,
  context: string,
  fallback?: T
): Promise<T | null> => {
  return errorHandler.handleAsync(operation, context, fallback)
}
