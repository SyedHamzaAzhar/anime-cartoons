// Use Enviroment Variables
import dotenv from "dotenv";
import { createConnection } from "typeorm";
dotenv.config()

const connectDB = async () => {
    createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        logging: true,
        synchronize: true,
        entities: ["./src/Entities/**/*.js"],
        extra: process.env.DATABASE_USE_SSL === 'true' ? {
            ssl: {
                rejectUnauthorized: false
            }
        } : {},
        migrations: ["src/migrations/**/*.js"],
        cli: {
            migrationsDir: "src/migrations",
        },
    })
}

export default connectDB;