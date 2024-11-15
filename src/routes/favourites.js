import express from "express";
import { getRepository } from "typeorm";
import Favourites from "../Entities/favourites.entity.js";


const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const favouritesRepository = getRepository(Favourites);
      const { device_id } = req.query;
      
      if (!device_id) {
          return res.status(400).json({
              code: 400,
              message: 'device_id is required',
              payload: null
        })

      }

      const data = await favouritesRepository.find({ where: { device_id } });
      if (data.length < 1) {
        res.status(204)
      }
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
        const { device_id, anime_id} = req.body;
        const favouritesRepository = getRepository(Favourites);
         if (!device_id || !anime_id) {
          return res.status(400).json({
              code: 400,
              message: 'device_id and anime_id are required fields',
              payload: null
        })

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
        res.status(500).json({ error: error.message });
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