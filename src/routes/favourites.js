import express from "express";
import { getRepository } from "typeorm";
import Favourites from "../Entities/favourites.entity.js";


const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const favouritesRepository = getRepository(Favourites);
      const { device_id, anime_id } = req.query;
      
      if (!device_id) {
          return res.status(400).json({
              code: 400,
              message: 'device_id is required',
              payload: null
        })

      }
    
    if (anime_id !== undefined) {
      const data = await favouritesRepository.findOne({ where: { device_id, anime_id } });
      
      if (data === null) {
        return  res.status(204).json();
      }
     return  res.status(200).json({
              code: 200,
              message: 'Record fetched successfully',
              payload: data
        });
    }
    
      const data = await favouritesRepository.find({ where: { device_id } });
     
    res.status(200).json({
              code: 200,
              message: 'Records fetched successfully',
              payload: data
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
    try {
        const { device_id, anime_id } = req.body;
        const favouritesRepository = getRepository(Favourites);

        // Validate required fields
        if (!device_id || !anime_id) {
            return res.status(400).json({
                code: 400,
                message: "device_id and anime_id are required fields",
                payload: null,
            });
        }

        // Count the existing records for the given device_id
        const existingFavouritesCount = await favouritesRepository.count({
            where: { device_id },
        });

        // Check if the count exceeds the maximum limit (15)
        if (existingFavouritesCount >= 15) {
            return res.status(400).json({
                code: 400,
                message: "Favourites list is already full. Maximum 15 entries are allowed.",
                payload: null,
            });
        }

        // Check if a record with the same device_id and anime_id already exists
        const existingFavourite = await favouritesRepository.findOne({
            where: { device_id, anime_id },
        });

        if (existingFavourite !== null) {
            // If the record exists, respond with a 400 error
            return res.status(400).json({
                code: 400,
                message: "Anime already exists in your wish list",
                payload: null,
            });
        }

        // If no existing record, create a new favourite entry
        const favourite = await favouritesRepository.save(req.body);
        res.status(201).json({
            code: 201,
            message: "Record added successfully",
            payload: favourite,
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: "Internal Server Error",
            error: error.message,
        });
    }
});

router.post("/delete", async (req, res) => {
    try {
        const { device_id, anime_id } = req.body;
        const favouritesRepository = getRepository(Favourites);

        // Validate required fields
        if (!device_id || !anime_id) {
            return res.status(400).json({
                code: 400,
                message: "device_id and anime_id are required fields",
                payload: null,
            });
        }

        // Find the record to delete
        const favourite = await favouritesRepository.findOne({
            where: { device_id, anime_id },
        });

        if (!favourite) {
            // If the record doesn't exist, respond with a 404 error
            return res.status(404).json({
                code: 404,
                message: "Record not found",
                payload: null,
            });
        }

        // Delete the record
        await favouritesRepository.delete({ device_id, anime_id });

        res.status(200).json({
            code: 200,
            message: "Record deleted successfully",
            payload: null,
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: "Internal Server Error",
            error: error.message,
        });
    }
});



// router.put("/:id", async (req, res) => {
//     const Favourites = await Favourites.findOne(req.params.id);

//     if (Favourites) {
//         await Favourites.update(Favourites,req.body);

//         res.json({
//             message: "Values updated successfully."
//         })
//     } 
//     else {
//         res.json({
//             message: "Favourites not found."
//         })
//     }
// })

// router.delete("/:id", async (req, res) => {
//     await Favourites.delete(req.params.id);

//     res.json({
//         message: "Record deleted successfully."
//     })
// })

export default router;