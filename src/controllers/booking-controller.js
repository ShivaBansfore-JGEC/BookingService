
const { StatusCodes } = require('http-status-codes')
const { BookingService } = require('../services/index');

const { createChannel, publishMessage } = require('../utils/messageQueue');
const { REMINDER_BINDING_KEY} = require('../config/serverConfig');

const bookingService = new BookingService();

class BookingController {

    constructor(){
        
    }

    async sendMessageToQueue(req, res){
        const channel = await createChannel();
        const data = {message: 'success'}
        publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(data));
        return res.status(200).json({
            message:'successfully published the event'
        })
    }

    async create(req, res){
        try {
            const response = await bookingService.createBooking(req.body);
            console.log('response from controller', response);
            return res.status(StatusCodes.OK).json({
                data: response,
                message: 'successfully completed booking!',
                success: true,
                err: {}
            })
        } catch (error) {
            console.log('error:', error)
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
                err: error.explaination,
                data: {}
            })
        }
    }
}


module.exports = BookingController