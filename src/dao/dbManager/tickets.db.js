import ticketsModel from "./models/tickets.model.js";

export default class Ticket {
    constructor (){
    }
    save = async (ticket) => {
        const result = await ticketsModel.create(ticket);
        return result;
        }
    
}