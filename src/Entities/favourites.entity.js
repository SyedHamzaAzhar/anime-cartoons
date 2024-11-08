import { EntitySchema } from "typeorm";

const Favourites = new EntitySchema({
    name: "Favourites",
    tableName: "favourites",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true
        },
        device_id: {
            type: "varchar",
            nullable: false
        },
        anime_id: {
            type: "varchar",
            nullable: false
        }
    }
});

export default Favourites;
