import { ProjectStatus } from "../enums/projectStatus.js";
import { IsRecurring } from "../enums/isRecurring.js";
import { BillingCycle } from "../enums/billingCycle.js";
import { Billability } from "../enums/billability.js";

//mapping the projectDTo to ProjectModel
export const mapCreateProjectDTOtoProjectModel = (dto) => ({
    clientId: dto.clientId,
    projectId: dto.projectId,
    projectName: dto.projectName,
    description: dto.description,
    startDate: dto.startDate,
    endDate: dto.endDate,
    status: dto.status,
    currency: dto.currency,
    cost: dto.cost,
    finalAmount: dto.finalAmount,
    profitMargin: dto.profitMargin,
    commissionPercent: dto.commissionPercent,
    isRecurring: dto.isRecurring,
    billingCycle: dto.billingCycle,
    billingDate: dto.billingDate,
    billability: dto.billability,
})


//mapping update DTO to Project Model.
export const mapUpdateProjectDTOtoProjectModel = (dto) => {
    const model = {};

    const assignIfDefined = (target, key, value) => {
        if (value !== undefined) target[key] = value;
    };

    const assignEnumDefault = (target, key, value, enumObj, defaultValue) => {
        // set sensible default first
        target[key] = defaultValue;
        if (value !== undefined) {
            target[key] = Object.values(enumObj).includes(value) ? value : defaultValue;
        }
    };

    assignIfDefined(model, 'clientId', dto.clientId);
    assignIfDefined(model, 'projectName', dto.projectName);
    assignIfDefined(model, 'description', dto.description);
    assignIfDefined(model, 'startDate', dto.startDate);
    assignIfDefined(model, 'endDate', dto.endDate);

    assignEnumDefault(model, 'status', dto.status, ProjectStatus, ProjectStatus.PLANNED);

    assignIfDefined(model, 'cost', dto.cost);
    assignIfDefined(model, 'currency', dto.currency);
    assignIfDefined(model, 'finalAmount', dto.finalAmount);
    assignIfDefined(model, 'profitMargin', dto.profitMargin);
    assignIfDefined(model, 'commissionPercent', dto.commissionPercent);

    assignEnumDefault(model, 'isRecurring', dto.isRecurring, IsRecurring, IsRecurring.NO);
    assignEnumDefault(model, 'billingCycle', dto.billingCycle, BillingCycle, BillingCycle.MONTHLY);
    assignIfDefined(model, 'billingDate', dto.billingDate);

    // billability: default to BILLABLE unless a valid value is provided
    assignEnumDefault(model, 'billability', dto.billability, Billability, Billability.BILLABLE);

    return model;
};