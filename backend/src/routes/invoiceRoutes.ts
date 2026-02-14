import express from "express";
import { ValidateJWT } from "../middlewares/authMiddleware";
import { createNewInvoice, deleteInvoice, getAllUserInvoices, getInvoiceById, updateInvoice, updateInvoiceStatus } from "../controllers/invoiceController";
const invoiceRouter = express.Router();

//Authentication Required
invoiceRouter.use(ValidateJWT)

//Post Invoice
invoiceRouter.post("/", createNewInvoice);

//Get all Invoices
invoiceRouter.get("/", getAllUserInvoices);

//Get Invoice By Id
invoiceRouter.get("/:id", getInvoiceById);

//Delete Invoice By Id
invoiceRouter.delete("/:id", deleteInvoice);

//Update Invoice By Id
invoiceRouter.put("/:id", updateInvoice);

//Update status of the invoice
invoiceRouter.patch("/:id/status", updateInvoiceStatus)

// Later
// POST/api/invoices/:id/send
// Send invoice via email
// LaterGET/api/invoices/:id/pdf
// Download PDF


export default invoiceRouter