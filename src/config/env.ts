import dotenv from "dotenv";

dotenv.config();

interface GetEnvOptions {
  allowEmpty?: boolean;
}

const getEnv = (
  key: string,
  fallback?: string,
  options: GetEnvOptions = {}
): string => {
  const value = process.env[key] ?? fallback;

  if (value === undefined || (!options.allowEmpty && value === "")) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const env = {
  nodeEnv: getEnv("NODE_ENV", "development"),
  port: Number(getEnv("PORT", "5000")),
  seedOnStart: getEnv("SEED_ON_START", "true") === "true",
  db: {
    host: getEnv("DB_HOST"),
    port: Number(getEnv("DB_PORT", "3306")),
    username: getEnv("DB_USER"),
    password: getEnv("DB_PASSWORD", "", { allowEmpty: true }),
    database: getEnv("DB_NAME"),
    synchronize: getEnv("DB_SYNCHRONIZE", "true") === "true"
  },
  jwt: {
    secret: getEnv("JWT_SECRET"),
    expiresIn: getEnv("JWT_EXPIRES_IN", "1d"),
    reviewerDefaultPassword: getEnv("REVIEWER_DEFAULT_PASSWORD", "ReviewerPass123")
  }
};
