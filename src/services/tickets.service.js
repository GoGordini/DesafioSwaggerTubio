import  TicketManagerRepository  from '../repositories/tickets.repository.js';
import { TicketManager } from '../dao/factory.js';
const ticketManager = new TicketManager();
const ticketManagerRepository= new TicketManagerRepository(ticketManager);

//const orderNumber = Date.now() + Math.floor(Math.random() * 100000 + 1);
   export const ticketService = async (user,totalPrice)=>{
   const ticket ={
        "code": Date.now() + Math.floor(Math.random() * 100000 + 1),
        "purchase_datetime": new Date(),
        "amount":totalPrice,
        "purchaser": user.email
    }
    const result = await ticketManagerRepository.saveRepository(ticket);
    return result;
}