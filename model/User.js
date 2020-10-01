import Sequelize from 'sequelize';
import { sequelize, Op } from '../config/database'

const User = sequelize.define('user',{
    id: {
        field: 'id',
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        field: 'username',
        type: Sequelize.STRING
    },
    password: {
        field: 'password',
        type: Sequelize.STRING
    },
    email: {
        field: 'email',
        type: Sequelize.STRING
    },
    firstname: {
        field: 'firstname',
        type: Sequelize.STRING,
    },
    lastname: {
        field: 'lastname',
        type: Sequelize.STRING,
    },
    avatar: {
        field: 'avatar',
        type: Sequelize.STRING
    },
    phone: {
        field: 'phone',
        type: Sequelize.STRING
    },
    birthday: {
        field: 'birthday',
        type: Sequelize.DATE
    },
    status: {
        field: 'status',
        type: Sequelize.INTEGER
    },
    gender: {
        field: 'gender',
        type: Sequelize.STRING,
    },
    isDelete: {
        field: 'is_delete',
        type: Sequelize.BOOLEAN,
    },
    createdAt: {
        field: 'created_at',
        type: Sequelize.DATE,
    },
    updatedAt: {
        field: 'updated_at',
        type: Sequelize.DATE,
    }
},{
    tableName: 'user',
    timestamps: false
})
export default User