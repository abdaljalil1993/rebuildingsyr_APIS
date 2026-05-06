import { ServiceFieldType } from "../constants/enums";
import { ServiceEntity } from "../entities/Service";
import { ServiceField } from "../entities/ServiceField";
import { AppDataSource } from "../config/data-source";

interface SeedServiceItem {
  name: string;
  description: string;
  fields: Array<{
    fieldName: string;
    fieldType: ServiceFieldType;
    required: boolean;
  }>;
}

const seedServices: SeedServiceItem[] = [
  {
    name: "Reconstruction",
    description: "Support for repairing or rebuilding damaged homes.",
    fields: [
      { fieldName: "building_address", fieldType: ServiceFieldType.TEXT, required: true },
      { fieldName: "damage_level", fieldType: ServiceFieldType.TEXT, required: true },
      { fieldName: "estimated_cost", fieldType: ServiceFieldType.NUMBER, required: true },
      { fieldName: "incident_date", fieldType: ServiceFieldType.DATE, required: false }
    ]
  },
  {
    name: "Health Aid",
    description: "Medical support for affected citizens and families.",
    fields: [
      { fieldName: "patient_name", fieldType: ServiceFieldType.TEXT, required: true },
      { fieldName: "medical_condition", fieldType: ServiceFieldType.TEXT, required: true },
      { fieldName: "monthly_medication_cost", fieldType: ServiceFieldType.NUMBER, required: false },
      { fieldName: "medical_report_file", fieldType: ServiceFieldType.FILE, required: true }
    ]
  },
  {
    name: "Humanitarian Aid",
    description: "Immediate financial and humanitarian relief support.",
    fields: [
      { fieldName: "family_size", fieldType: ServiceFieldType.NUMBER, required: true },
      { fieldName: "current_shelter", fieldType: ServiceFieldType.TEXT, required: true },
      { fieldName: "monthly_income", fieldType: ServiceFieldType.NUMBER, required: false }
    ]
  }
];

export class SeedService {
  async seedServicesAndFields(): Promise<void> {
    const serviceRepo = AppDataSource.getRepository(ServiceEntity);
    const serviceFieldRepo = AppDataSource.getRepository(ServiceField);

    for (const seedService of seedServices) {
      let service = await serviceRepo.findOne({ where: { name: seedService.name } });

      if (!service) {
        service = serviceRepo.create({
          name: seedService.name,
          description: seedService.description
        });
        service = await serviceRepo.save(service);
      }

      const existingFields = await serviceFieldRepo.find({
        where: { serviceId: service.id }
      });

      for (const seedField of seedService.fields) {
        const alreadyExists = existingFields.some(
          (existingField) => existingField.fieldName === seedField.fieldName
        );

        if (!alreadyExists) {
          const field = serviceFieldRepo.create({
            serviceId: service.id,
            fieldName: seedField.fieldName,
            fieldType: seedField.fieldType,
            required: seedField.required
          });

          await serviceFieldRepo.save(field);
        }
      }
    }
  }
}
