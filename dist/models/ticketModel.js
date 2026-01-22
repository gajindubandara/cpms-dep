import { v4 as uuidv4 } from 'uuid';
import { getDateOnly } from '../utils/dateOnly.js';
import { TicketStatus } from '../enums/ticketStatus.js';

export const Ticket = {
    pk: (clientId) => `CLIENT#${clientId}`,
    sk: (ticketId) => `TICKET#${ticketId}`,

    create: (data) => {
        const id = data.ticketId || uuidv4(); // Generate a new UUID if ticketId is not provided    
        return {
            PK: `CLIENT#${data.clientId}`,
            SK: `TICKET#${id}`,
            Attributes: {
                clientId: data.clientId,
                clientName: data.clientName,
                projectId: data.projectId || null,
                projectName: data.projectName || null,
                subject: data.subject,
                message: data.message,
                status: data.status ?? TicketStatus.OPEN,
                adminResponse: data.adminResponse ?? '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            queryDate: getDateOnly()
        };
    }
};
