// Configuracion centralizada: lee variables de entorno y expone objeto de settings.
export default () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'techhelpdesk',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'supersecretjwt',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'supersecretrefresh',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  rsa: {
    publicKey: process.env.RSA_PUBLIC_KEY || '',
    privateKey: process.env.RSA_PRIVATE_KEY || '',
  },
  apiKeyDefault: process.env.API_KEY_DEFAULT || '',
  arduino: {
    clientId: process.env.ARDUINO_CLIENT_ID || '',
    clientSecret: process.env.ARDUINO_CLIENT_SECRET || '',
    audience: process.env.ARDUINO_AUDIENCE || 'https://api2.arduino.cc/iot',
    tokenUrl: process.env.ARDUINO_TOKEN_URL || 'https://api2.arduino.cc/iot/v1/clients/token',
    thingId: process.env.ARDUINO_THING_ID || '',
    tempPropertyId: process.env.ARDUINO_TEMP_PROPERTY_ID || '',
    humPropertyId: process.env.ARDUINO_HUM_PROPERTY_ID || '',
    apiBase: process.env.ARDUINO_API_BASE || 'https://api2.arduino.cc/iot',
  },
});
