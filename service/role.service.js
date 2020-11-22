import { Role } from "../model";

const getAll = async () => {
  return await Role.findAll({
    where: {}
  });
};

export default {
  getAll,
};
