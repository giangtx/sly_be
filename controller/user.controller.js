import catchAsync from '../utils/catchAsync';
import userService from '../service/user.service';

const getAll = catchAsync( async(request, response) => {
    const categorys = await userService.getAll();
    response.json({
        status: 'Ok',
        data: categorys,
        message: 'Success'
    })
});

export default {
    getAll,
}