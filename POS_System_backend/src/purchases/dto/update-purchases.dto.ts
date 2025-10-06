import { PartialType } from "@nestjs/mapped-types";
import { CreatePurchasesDto } from "./create-purchases.dto";


export class UpdatePurchasesDto extends PartialType(CreatePurchasesDto) {}