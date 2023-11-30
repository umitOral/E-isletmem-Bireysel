
import {Ticket} from '../models/ticketModel.js'

const answerTicket = async (req, res) => {
    try {
      const ticket = await Ticket.findByIdAndUpdate(req.params.id,{
        
      });
  
      res.redirect("back");
    } catch (error) {
      res.status(500).json({
        succes: false,
        message: "delete error",
      });
    }
  };

  export {
    answerTicket
  }