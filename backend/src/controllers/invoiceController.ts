import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const createNewInvoice = async(req:Request,res:Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Not authenticated" });
            return;
        }
        //Get the details from the req.body
        const {clientId,
            dueDate,
            taxRate = 0,
            discount = 0,
            notes,
            terms,
            items} = req.body;
        
        // Validation: Required fields
        if (!clientId) {
            res.status(400).json({ error: "Client ID is required" });
            return;
        }

        if (!dueDate) {
            res.status(400).json({ error: "Due date is required" });
            return;
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            res.status(400).json({ error: "At least one invoice item is required" });
            return;
        }

        // Validate items
        for (const item of items) {
            if (!item.description || !item.quantity || !item.unitPrice) {
                res.status(400).json({ 
                    error: "Each item must have description, quantity, and unitPrice" 
                });
                return;
            }
            if (item.quantity <= 0 || item.unitPrice < 0) {
                res.status(400).json({ 
                    error: "Quantity must be positive and unitPrice cannot be negative" 
                });
                return;
            }
        }

        // Check if client exists and belongs to user
        const client = await prisma.client.findFirst({
            where: {
                id: clientId,
                userId: req.user.id
            }
        });

        if (!client) {
            res.status(404).json({ error: "Client not found or unauthorized" });
            return;
        }

        const subtotal = items.reduce((sum, item) => {
            return sum + (item.quantity * item.unitPrice);
        }, 0);

        const taxAmount = (subtotal * taxRate) / 100;
        const total = subtotal + taxAmount - discount;

        // Generate unique invoice number 
        const invoiceCount = await prisma.invoice.count({
            where: { userId: req.user.id }
        });
        const invoiceNumber = `INV-${String(invoiceCount + 1).padStart(4, '0')}`;
        // Create invoice with items
        const invoice = await prisma.invoice.create({
            data: {
                invoiceNumber,
                userId: req.user.id,
                clientId,
                issueDate: new Date(),
                dueDate: new Date(dueDate),
                status: "DRAFT",
                subtotal,
                taxRate,
                taxAmount,
                discount,
                total,
                notes: notes || null,
                terms: terms || null,
                items: {
                    create: items.map(item => ({
                        description: item.description,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        total: item.quantity * item.unitPrice
                    }))
                }
            },
            include: {
                items: true,
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        address: true
                    }
                }
            }
        });
        res.status(201).json({
            message: "Invoice created successfully",
            invoice
        });
    } catch (error) {
        console.error("Error while creating Invoice:", error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getAllUserInvoices = async(req:Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Not authenticated" });
            return;
        }
        const invoices = await prisma.invoice.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                },
                items: true  
            },
            orderBy: {
                createdAt: "desc"  
            }
        })
        res.status(200).json({
            message: "Invoices fetched successfully",
            invoices,
            total: invoices.length
        });
    } catch (error) {
        console.log("Error while getting all the invoices:", error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getInvoiceById = async(req:Request, res:Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Not authenticated" });
            return;
        }
        const {id} = req.params;
        const invoice = await prisma.invoice.findUnique({
            where: {id},
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        address: true,
                        city: true,
                        state: true,
                        zipCode: true,
                        country: true
                    }
                },
                items: true
            }
        })
        if (!invoice) {
            res.status(404).json({ error: "Invoice not found" });
            return;
        }
        // Check ownership
        if (invoice.userId !== req.user.id) {
            res.status(403).json({ error: "Unauthorized access" });
            return;
        }
        res.status(200).json({
            message: "Invoice fetched successfully",
            invoice
        });
    } catch (error) {
        console.log("Error while fetching the invoice:", error);
        res.status(500).json({message: "Internal Server Error"})
    }
}

export const deleteInvoice = async(req:Request, res:Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Not authenticated" });
            return;
        }
        const {id} = req.params;
        // Check if invoice exists and user owns it
        const invoice = await prisma.invoice.findUnique({
            where: { id }
        });
        if (!invoice) {
            res.status(404).json({ error: "Invoice not found" });
            return;
        }
        if (invoice.userId !== req.user.id) {
            res.status(403).json({ error: "Unauthorized access" });
            return;
        }
        //Prevent deletion of paid invoices
        if (invoice.status === "PAID") {
            res.status(400).json({ 
                error: "Cannot delete paid invoices. Please cancel instead." 
            });
            return;
        }

        await prisma.invoice.delete({
            where: { id }
        });

        res.status(200).json({
            message: "Invoice deleted successfully"
        });
    } catch (error) {
        console.error("Error while deleting invoice:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const updateInvoice = async(req:Request, res:Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Not authenticated" });
            return;
        }
        const { id } = req.params;
        const { 
            clientId, 
            dueDate, 
            taxRate, 
            discount, 
            notes, 
            terms, 
            items 
        } = req.body;
        // Check if invoice exists and user owns it
        const existingInvoice = await prisma.invoice.findUnique({
            where: { id }
        });
        if (!existingInvoice) {
            res.status(404).json({ error: "Invoice not found" });
            return;
        }
        if (existingInvoice.userId !== req.user.id) {
            res.status(403).json({ error: "Unauthorized access" });
            return;
        }
        // Only allow updates if invoice is DRAFT
        if (existingInvoice.status !== "DRAFT") {
            res.status(400).json({ 
                error: "Only DRAFT invoices can be edited. Current status: " + existingInvoice.status 
            });
            return;
        }
        // If clientId is being changed, verify new client exists
        if (clientId && clientId !== existingInvoice.clientId) {
            const client = await prisma.client.findFirst({
                where: {
                    id: clientId,
                    userId: req.user.id
                }
            });

            if (!client) {
                res.status(404).json({ error: "Client not found or unauthorized" });
                return;
            }
        }
        // Prepare update data
        const updateData: any = {};

        if (clientId !== undefined) updateData.clientId = clientId;
        if (dueDate !== undefined) updateData.dueDate = new Date(dueDate);
        if (taxRate !== undefined) updateData.taxRate = taxRate;
        if (discount !== undefined) updateData.discount = discount;
        if (notes !== undefined) updateData.notes = notes;
        if (terms !== undefined) updateData.terms = terms;
        if (items && Array.isArray(items)) {
            // Validate items
            for (const item of items) {
                if (!item.description || !item.quantity || item.unitPrice === undefined) {
                    res.status(400).json({ 
                        error: "Each item must have description, quantity, and unitPrice" 
                    });
                    return;
                }
            }

            // Calculate new totals
            const subtotal = items.reduce((sum, item) => {
                return sum + (item.quantity * item.unitPrice);
            }, 0);

            const taxAmount = (subtotal * (taxRate ?? existingInvoice.taxRate)) / 100;
            const total = subtotal + taxAmount - (discount ?? existingInvoice.discount);

            updateData.subtotal = subtotal;
            updateData.taxAmount = taxAmount;
            updateData.total = total;

            // Delete old items and create new ones
            await prisma.invoiceItem.deleteMany({
                where: { invoiceId: id }
            });

            updateData.items = {
                create: items.map(item => ({
                    description: item.description,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    total: item.quantity * item.unitPrice
                }))
            };
        } else {
            // Recalculate totals if tax or discount changed
            if (taxRate !== undefined || discount !== undefined) {
                const subtotal = existingInvoice.subtotal;
                const newTaxRate = taxRate ?? existingInvoice.taxRate;
                const newDiscount = discount ?? existingInvoice.discount;
                
                const taxAmount = (subtotal * newTaxRate) / 100;
                const total = subtotal + taxAmount - newDiscount;

                updateData.taxAmount = taxAmount;
                updateData.total = total;
            }
        }
        // Check if there's anything to update
        if (Object.keys(updateData).length === 0) {
            res.status(400).json({ error: "No fields to update" });
            return;
        }
        const updatedInvoice = await prisma.invoice.update({
            where: { id },
            data: updateData,
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                },
                items: true
            }
        });
        res.status(200).json({
            message: "Invoice updated successfully",
            invoice: updatedInvoice
        });
    } catch (error) {
        console.error("Error while updating invoice:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const updateInvoiceStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Not authenticated" });
            return;
        }

        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"];
        if (!status || !validStatuses.includes(status)) {
            res.status(400).json({ 
                error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` 
            });
            return;
        }

        // Check if invoice exists and user owns it
        const invoice = await prisma.invoice.findUnique({
            where: { id }
        });

        if (!invoice) {
            res.status(404).json({ error: "Invoice not found" });
            return;
        }

        if (invoice.userId !== req.user.id) {
            res.status(403).json({ error: "Unauthorized access" });
            return;
        }

        // Business logic: Prevent certain status transitions
        if (invoice.status === "PAID" && status === "DRAFT") {
            res.status(400).json({ 
                error: "Cannot change a PAID invoice back to DRAFT" 
            });
            return;
        }

        // Prepare update data
        const updateData: any = { status };

        // If marking as PAID, record payment info
        if (status === "PAID" && invoice.status !== "PAID") {
            updateData.amountPaid = invoice.total;
            updateData.paymentDate = new Date();
        }

        // Update invoice status
        const updatedInvoice = await prisma.invoice.update({
            where: { id },
            data: updateData,
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                items: true
            }
        });

        res.status(200).json({
            message: `Invoice status updated to ${status}`,
            invoice: updatedInvoice
        });

    } catch (error) {
        console.error("Error while updating invoice status:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

