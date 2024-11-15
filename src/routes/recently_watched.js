import express from "express";
import { getRepository } from "typeorm";
import RecentlyWatched from "../Entities/recently_watched.entity.js";


const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const recentlyWatchedRepository = getRepository(RecentlyWatched);

        // Set default values for page and limit if not provided
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

        // Calculate the number of items to skip based on the page and limit
        const skip = (page - 1) * limit;

        // Fetch records ordered by watched_at in descending order with pagination
        const [result, total] = await recentlyWatchedRepository.findAndCount({
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
        res.status(500).json({ error: error.message });
    }
});


router.post("/", async (req, res) => {
    try {
        const { device_id, anime_id, anime_title, anime_image} = req.body;
        const recentlyWatchedRepository = getRepository(RecentlyWatched);

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
        res.status(500).json({ error: error.message });
    }
});

export default router;