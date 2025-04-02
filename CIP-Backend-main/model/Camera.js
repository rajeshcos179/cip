import { DataTypes,Model } from "sequelize";
import sequelize from "../config/database.js";

const cameras = sequelize.define(
    "cameras",
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        area: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        location: {
            type: DataTypes.GEOMETRY("POINT"),
            allowNull: false,
        },
    },{
        tableName: "cameras",
        timestamps: false,
    }
)

export default cameras;
