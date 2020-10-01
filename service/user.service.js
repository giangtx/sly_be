import User from '../model/User';

const getAll = async () => {
    return User.findAll();
} 

export default {
    getAll
}