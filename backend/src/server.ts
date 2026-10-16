import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";
import { seedDatabase } from "./seed/seed.js";
import { Product } from "./models/Product.js";

const startServer = async () => {
  try {
    console.log("Starting Kartly Backend Server...");
    await connectDB();

    // Auto-seed if products don't exist yet
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log("Empty database detected. Running initial catalog seeder...");
      await seedDatabase();
    }

    const app = createApp();

    const server = app.listen(ENV.PORT, () => {
      console.log(`\n==================================================`);
      console.log(`✨ KARTLY REST API is live on: http://localhost:${ENV.PORT}`);
      console.log(`🌐 Allowed Frontend Client: ${ENV.CLIENT_URL}`);
      console.log(`📡 Health Check: http://localhost:${ENV.PORT}/api/health`);
      console.log(`📦 Products API: http://localhost:${ENV.PORT}/api/products`);
      console.log(`🏷️ Categories API: http://localhost:${ENV.PORT}/api/categories`);
      console.log(`==================================================\n`);
    });

    const gracefulShutdown = () => {
      console.log("Shutting down Kartly backend gracefully...");
      server.close(() => {
        console.log("Server closed.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
