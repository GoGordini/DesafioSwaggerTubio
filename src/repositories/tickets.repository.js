export default class TicketsRepository {
    constructor (dao){
        this.dao=dao;
    }
    saveRepository = async (ticket) => {
        const result = await this.dao.save(ticket);
        return result;
        }
    }