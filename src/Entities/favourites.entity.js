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
        },
        anime_title: {
            type: "varchar",
            nullable: false
        },
        anime_image: {
            type: "varchar",
            nullable: false
        },
        created_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false
        },
        updated_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
            nullable: false
        }
    }
});

export default Favourites;
