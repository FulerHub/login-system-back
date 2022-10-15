import {Table, Model, Column, DataType} from "sequelize-typescript";

@Table({
    timestamps: true,
    tableName: "token"
})

export class Token extends Model {
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    user_id!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    refreshToken!: string;
}