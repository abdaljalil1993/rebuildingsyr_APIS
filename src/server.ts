import app from "./app";
import { AppDataSource } from "./config/data-source";
import { env } from "./config/env";
import { SeedService } from "./services/seed.service";
import {
  repairDropIndexForeignKeyConflict,
  shouldAttemptSyncRepair
} from "./utils/typeorm-sync-repair";

const initializeDataSource = async (): Promise<void> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await AppDataSource.initialize();
      return;
    } catch (error) {
      lastError = error;

      if (!shouldAttemptSyncRepair(error)) {
        throw error;
      }

      // eslint-disable-next-line no-console
      console.warn(
        `Detected MySQL FK/index sync conflict (attempt ${attempt}/3). Attempting automatic repair...`
      );

      const repaired = await repairDropIndexForeignKeyConflict(error);
      if (!repaired) {
        throw error;
      }
    }
  }

  throw lastError;
};

const bootstrap = async () => {
  try {
    await initializeDataSource();

    if (env.seedOnStart) {
      const seedService = new SeedService();
      await seedService.seedServicesAndFields();
    }

    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server started on port ${env.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

void bootstrap();
