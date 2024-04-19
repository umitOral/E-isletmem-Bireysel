import { Ticket } from "../models/ticketModel.js";
import { CustomError } from "../helpers/error/CustomError.js";

const answerTicket = async (req, res,next) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, {});

    res.redirect("back");
  } catch (error) {
    return next(new CustomError("bilinmeyen hata", 500, error));
  }
};

export { answerTicket };
