import { EntitySchema } from "typeorm";

const RecentlyWatched = new EntitySchema({
    name: "RecentlyWatched",
    tableName: "recently_watched",
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
        watched_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
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

export default RecentlyWatched;
