
const axios = require('axios');
const {BookingRepository} = require('../repository/index');
const { FLIGHT_SERVICE_PATH } = require('../config/serverConfig');
const {ServiceError} = require('../utils/errors/index');

class BookingService {
    constructor(){
        this.bookingRepository = new BookingRepository();
    }

    async createBooking(data){
        try {
            const flightId = data.flightId;
            const getFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const response = await axios.get(getFlightRequestUrl);
            const flightDetails = response.data.data;
            const priceOfTheFlight = flightDetails.price;
            if(data.noOfSeats > flightDetails.totalSeats){
                throw new ServiceError(
                    'something went wrong in the booking process!',
                    'Insufficient seats available'
                    )
            }
            const totalCost = priceOfTheFlight * data.noOfSeats;
            const bookingPayload = {...data, totalCost};
            const booking = await this.bookingRepository.create(bookingPayload);
            const updateFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
            console.log('updateFlightRequestUrl:', updateFlightRequestUrl);
            const r1 = await axios.patch(updateFlightRequestUrl, {totalSeats: flightDetails.totalSeats - booking.noOfSeats});
           // console.log('r1', r1);
            const finalBooking = await this.bookingRepository.update(booking.id, {status: "Booked"});
            return finalBooking;
        } catch (error) {
            console.log('error:', error);
            if(error.name === 'validationError' || error.name === 'Repository error'){
                throw error;
            }
            throw new ServiceError()
        }
    }
}

module.exports = BookingService;