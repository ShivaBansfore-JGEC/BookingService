
const {StatusCodes} = require('http-status-codes')
const {Booking} = require('../models/index');
const {ValidationError, AppError} = require('../utils/errors/index');

class BookingRepository {

    async create(data){
        try{
            const booking = await Booking.create(data);
            return booking;
        }catch(error){
            if(error.name === "SequelizeValidationError"){
                throw new ValidationError(error);
            }
            throw new AppError(
                'Repository error',
                'cannot create booking',
                'something went wrong',
                StatusCodes.INTERNAL_SERVER_ERROR
            )
        }
    }

    async update(bookingId, data){
        try {
            // await Booking.update(data, {
            //     where:{
            //         id: bookingId
            //     }
            // })
            const booking = await Booking.findByPk(bookingId);
            if(data.status){
                booking.status = data.status;
            }
            await booking.save();
            return booking;

        } catch (error) {
            if(error.name === "SequelizeValidationError"){
                throw new ValidationError(error);
            }
            throw new AppError(
                'Repository error',
                'cannot update booking',
                'something went wrong please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            )
        }
    }

}

module.exports = BookingRepository;