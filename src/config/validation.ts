// Validador de variables de entorno usando class-validator para fallar rapido si falta algo.
import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  @IsNotEmpty()
  DB_NAME: string;

  @IsString()
  @IsNotEmpty()
  DB_USER: string;

  @IsString()
  @IsNotEmpty()
  DB_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRES_IN: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_EXPIRES_IN: string;

  @IsOptional()
  @IsString()
  RSA_PUBLIC_KEY?: string;

  @IsOptional()
  @IsString()
  RSA_PRIVATE_KEY?: string;

  @IsOptional()
  @IsString()
  API_KEY_DEFAULT?: string;

  @IsOptional()
  @IsString()
  ARDUINO_CLIENT_ID?: string;

  @IsOptional()
  @IsString()
  ARDUINO_CLIENT_SECRET?: string;

  @IsOptional()
  @IsString()
  ARDUINO_AUDIENCE?: string;

  @IsOptional()
  @IsString()
  ARDUINO_TOKEN_URL?: string;

  @IsOptional()
  @IsString()
  ARDUINO_THING_ID?: string;

  @IsOptional()
  @IsString()
  ARDUINO_TEMP_PROPERTY_ID?: string;

  @IsOptional()
  @IsString()
  ARDUINO_HUM_PROPERTY_ID?: string;

  @IsOptional()
  @IsString()
  ARDUINO_API_BASE?: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
