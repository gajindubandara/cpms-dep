import { Status } from "../enums/clientStatus.js" 
import { ClientType } from "../enums/clientType.js"
import { getDateOnly } from "../utils/dateOnly.js";


export const Client = {
    pk: (clientId) => `CLIENT#${clientId}`,
    sk: () => `CLIENT`,
    
    create: (data) => ({
        PK: `CLIENT#${data.clientId}`,
        SK: `CLIENT`,        
        Attributes: {
            clientName: data.clientName ,
            email: data.email,
            address: data.address,
            phone: data.phone,
            status: data.status ?? Status.ACTIVE,
            clientType:data.clientType ?? ClientType.INDIVIDUAL,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        queryDate: getDateOnly()
    })
};
