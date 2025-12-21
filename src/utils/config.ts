// This file handles all the configuration settings.
// It pulls in environment variables and build-time constants to set up things like the app name,
// version, environment type, logging settings, and feature flags.

declare global {
  var __APP_VERSION__: string | undefined
  var __APP_ENV__: string | undefined
}

interface AppConfig {
  app: {
    name: string
    version: string
    env: 'development' | 'production' | 'test'
  }
  logging: {
    level: 'development' | 'production' | 'none'
  }
  urls: {
    production: string
  }
  features: {
    enableCache: boolean
    enableErrorReporting: boolean
  }
}

// Helper to grab environment variables with a default if they're missing
const getEnvVar = (key: string, fallback: string = ''): string => {
  return (import.meta.env[key] as string | undefined) ?? fallback
}

// For build-time variables, we check if they were set during the build process,
// and if not, fall back to environment variables or a default value
const getBuildTimeVar = (
  buildTimeVar: string | undefined,
  envKey: string,
  fallback: string
): string => {
  return buildTimeVar ?? getEnvVar(envKey, fallback)
}

// The main config object that brings everything together
export const config: AppConfig = {
  app: {
    name: getEnvVar('VITE_APP_NAME', 'RJ Leyva Writes'),
    version: getBuildTimeVar(
      globalThis.__APP_VERSION__,
      'VITE_APP_VERSION',
      '0.0.1'
    ),
    env: getBuildTimeVar(
      globalThis.__APP_ENV__,
      'VITE_APP_ENV',
      'development'
    ) as AppConfig['app']['env']
  },
  logging: {
    level: getEnvVar(
      'VITE_LOG_LEVEL',
      'development'
    ) as AppConfig['logging']['level']
  },
  urls: {
    production: getEnvVar(
      'VITE_PRODUCTION_URL',
      'https://rjleyva-writes.pages.dev'
    )
  },
  features: {
    enableCache: getEnvVar('VITE_ENABLE_CACHE', 'true') === 'true',
    enableErrorReporting:
      getEnvVar('VITE_ENABLE_ERROR_REPORTING', 'true') === 'true'
  }
}

// Simple boolean flags for checking what environment we're running in
export const env = {
  isDevelopment: config.app.env === 'development',
  isProduction: config.app.env === 'production',
  isTest: config.app.env === 'test'
} as const
