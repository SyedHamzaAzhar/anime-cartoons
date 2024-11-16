import express from "express";
import { getRepository } from "typeorm";
import RecentlyWatched from "../Entities/recently_watched.entity.js";


const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { device_id } = req.query; // Extract device_id from query parameters
        const recentlyWatchedRepository = getRepository(RecentlyWatched);

        // Validate that device_id is provided
        if (!device_id) {
            return res.status(400).json({
                code: 400,
                message: "device_id is a required query parameter",
                payload: null,
            });
        }

        // Set default values for page and limit if not provided
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

        // Calculate the number of items to skip based on the page and limit
        const skip = (page - 1) * limit;

        // Fetch records ordered by watched_at in descending order with pagination
        const [result, total] = await recentlyWatchedRepository.findAndCount({
            where: { device_id },
            order: {
                watched_at: "DESC",
            },
            skip,
            take: limit,
        });

        res.status(200).json({
            code: 200,
            message: "Records fetched successfully",
            payload: result,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: "Internal Server Error",
            error: error.message,
        });
    }
});



router.post("/", async (req, res) => {
    try {
        const { device_id, anime_id, anime_title, anime_image } = req.body;
        const recentlyWatchedRepository = getRepository(RecentlyWatched);

        // Validate required fields
        if (!device_id || !anime_id) {
            return res.status(400).json({
                code: 400,
                message: "device_id and anime_id are required fields",
                payload: null,
            });
        }

        // Fetch all records for the given device_id
        const records = await recentlyWatchedRepository.find({
            where: { device_id },
            order: { watched_at: "ASC" }, // Order by oldest record first
        });

        // Delete the oldest record if the limit of 10 is exceeded
        if (records.length >= 10) {
            const oldestRecord = records[0]; // Get the oldest record
            await recentlyWatchedRepository.delete(oldestRecord.id);
        }

        // Check if a record with the same device_id and anime_id already exists
        let recentlyWatched = await recentlyWatchedRepository.findOne({
            where: { device_id, anime_id },
        });

        if (recentlyWatched) {
            // If exists, update the watched_at field to the current timestamp
            recentlyWatched.watched_at = new Date();
            await recentlyWatchedRepository.save(recentlyWatched);
            res.status(200).json({
                code: 200,
                message: "Record updated successfully",
                payload: recentlyWatched,
            });
        } else {
            // If doesn't exist, create a new record
            recentlyWatched = recentlyWatchedRepository.create({
                device_id,
                anime_id,
                anime_title,
                anime_image,
                watched_at: new Date(),
            });
            await recentlyWatchedRepository.save(recentlyWatched);
            res.status(201).json({
                code: 201,
                message: "Record added successfully",
                payload: recentlyWatched,
            });
        }
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: "Internal Server Error",
            error: error.message,
        });
    }
});

export default router;