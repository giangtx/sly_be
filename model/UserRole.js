import Sequelize from 'sequelize';
import {sequelize, Op} from '../config/database';
import User from './User';
import Role from './Role';

const UserRole = sequelize.define('user_role', {
    idUser: {
        field: 'id_user',
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    idRole: {
        field: 'id_role',
        type: Sequelize.INTEGER,
        primaryKey: true
    }
}, {
    tableName: 'user_role',
    timestamps: false
});

export default UserRole;