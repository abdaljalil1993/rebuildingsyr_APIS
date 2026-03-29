import app from "./app";
import { AppDataSource } from "./config/data-source";
import { env } from "./config/env";

const bootstrap = async () => {
  try {
    await AppDataSource.initialize();
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
