import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import camera from "./Camera.js";
const threats = sequelize.define(
    "threats",{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        camera_id:{
            type:DataTypes.INTEGER,
            allowNull: false,
            references:{
                model: camera,
                key:'id',
            }
        },
        area: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        location: {
            type: DataTypes.GEOMETRY("POINT"),
            allowNull: false,
        },
        frame: {
            type: DataTypes.BLOB,
            allowNull: false,
        },
        dispatched:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        tableName: "threats",
        timestamps: false,
    }
)

camera.hasMany(threats, { foreignKey: 'camera_id' });
threats.belongsTo(camera, { foreignKey: 'camera_id' });

export default threats;