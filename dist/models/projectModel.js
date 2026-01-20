import { getDateOnly } from "../utils/dateOnly.js";
import {BillingCycle} from "../enums/billingCycle.js"
import { ProjectStatus } from "../enums/projectStatus.js";
import { Billability } from "../enums/billability.js";

export const Project = {
    pk: (cliednId) => `CLIENT#${cliednId}`,
    sk: (projectId, featureId)=> `PROJECT#${projectId}#FEATURE#${featureId}`,
    create: (data) =>({
        PK: `CLIENT#${data.clientId}`,
        SK: `PROJECT#${data.projectId}#FEATURE#${data.featureId}`,
        Attributes: {
            projectName: data.projectName,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate,
            status: data.status?? ProjectStatus.PLANNED,
            currency: data.currency,
            cost: data.cost,
            finalAmount: data.finalAmount,
            profitMargin: data.profitMargin,
            commissionPercent: data.commissionPercent,
            isRecurring: data.isRecurring,
            billingCycle: data.billingCycle ?? BillingCycle.NONE,
            billingDate: data.billingDate,
            billability: data.billability?? Billability.NON_BILLLABLE,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        queryDate: getDateOnly()
    })

};