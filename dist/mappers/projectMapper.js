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

    if(dto.clientId !== undefined) model.clientId = dto.clientId;
    if(dto.projectName !== undefined) model.projectName = dto.projectName;
    if(dto.description !== undefined) model.description = dto.description;
    if(dto.startDate !== undefined) model.startDate = dto.startDate;
    if(dto.endDate !== undefined) model.endDate = dto.endDate;
    if(dto.status !== undefined) {
        model.status = Object.values(ProjectStatus).includes(dto.status) 
            ? dto.status 
            : ProjectStatus.PLANNED;
    }
    if(dto.cost !== undefined) model.cost = dto.cost;
    if(dto.currency !== undefined)model.currency = dto.currency;
    if(dto.finalAmount !== undefined) model.finalAmount = dto.finalAmount;
    if(dto.profitMargin !== undefined) model.profitMargin = dto.profitMargin;
    if(dto.commissionPercent !== undefined) model.commissionPercent = dto.commissionPercent;
    if(dto.isRecurring !== undefined) {
        model.isRecurring = Object.values(IsRecurring).includes(dto.isRecurring)
            ? dto.isRecurring
            : IsRecurring.NO;
    }
    if(dto.billingCycle !== undefined) {
        model.billingCycle = Object.values(BillingCycle).includes(dto.billingCycle)
            ? dto.billingCycle
            : BillingCycle.MONTHLY;
    }
    if(dto.billingDate !== undefined) model.billingDate = dto.billingDate;
    model.billability = dto.billability !== undefined
        ? (Object.values(Billability).includes(dto.billability) ? dto.billability : Billability.BILLABLE)
        : Billability.BILLABLE;

    return model;
};