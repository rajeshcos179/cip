import {DataTypes,Model} from "sequelize";
import sequelize from "../config/database.js";

const stations = sequelize.define(
    "stations",
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
        incharge: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone_no: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        station_no: {
            type: DataTypes.STRING,
            allowNull: false,
        },

    },
    {
        tableName: "stations",
        timestamps: false,
    }
)

export default stations;