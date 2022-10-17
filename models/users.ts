import {Table, Model, Column, DataType} from "sequelize-typescript";

@Table({
   timestamps: true,
   tableName: "users"
})

export class Users extends Model {
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false
    })
    email!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    password!: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
        allowNull: false
    })
    isActivated!: boolean;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    activationLink!: string;
}