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
    const favouritesRepository = getRepository(Favourites);
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