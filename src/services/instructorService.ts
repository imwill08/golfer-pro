import { InstructorDTO, InstructorSchema, ServiceSchema, Service } from '../types/instructor';

export class InstructorService {
  /**
   * Normalizes raw form data into a consistent InstructorDTO format
   */
  static normalizeInput(raw: any): Partial<InstructorDTO> {
    // Handle services array/object normalization
    let services: Service[] = [];
    if (raw.services) {
      if (Array.isArray(raw.services)) {
        services = raw.services;
      } else if (typeof raw.services === 'object') {
        services = Object.entries(raw.services as Record<string, Service>)
          .filter(([key, value]) => key !== '0' && value.title && value.title !== '0')
          .map(([_, value]) => value);
      }
    }

    // Normalize arrays to prevent null/undefined
    const arrays = ['specialties', 'certifications', 'lesson_types', 'highlights', 'photos'];
    const normalizedArrays = arrays.reduce((acc, key) => ({
      ...acc,
      [key]: Array.isArray(raw[key]) ? raw[key] : 
             raw[key] ? [raw[key]] : []
    }), {});

    // Generate computed fields
    const computed = {
      name: raw.first_name && raw.last_name ? `${raw.first_name} ${raw.last_name}` : undefined,
      location: [raw.city, raw.state, raw.country].filter(Boolean).join(', '),
      contact_info: {
        email: raw.email,
        phone: raw.phone,
        website: raw.website || ''
      }
    };

    return {
      ...raw,
      ...normalizedArrays,
      services,
      ...computed
    };
  }

  /**
   * Validates and transforms the DTO according to schema rules
   */
  static validateAndTransform(dto: Partial<InstructorDTO>): InstructorDTO {
    try {
      return InstructorSchema.parse(dto) as InstructorDTO;
    } catch (error) {
      console.error('Validation error:', error);
      throw error;
    }
  }

  /**
   * Prepares the DTO for database storage
   */
  static toDbPayload(dto: InstructorDTO): any {
    // Format arrays for PostgreSQL
    const arrayFields = ['specialties', 'certifications', 'lesson_types', 'highlights', 'photos'];
    const formattedArrays = arrayFields.reduce((acc, field) => ({
      ...acc,
      [field]: dto[field]?.length ? `{${dto[field].join(',')}}` : '{}'
    }), {});

    // Handle services format
    const services = Array.isArray(dto.services) ? 
      JSON.stringify(dto.services) :
      JSON.stringify(Object.values(dto.services));

    return {
      ...dto,
      ...formattedArrays,
      services,
      faqs: JSON.stringify(dto.faqs || []),
      contact_info: JSON.stringify(dto.contact_info)
    };
  }

  /**
   * Formats database record back into DTO format
   */
  static fromDbPayload(dbRec: any): InstructorDTO {
    // Parse PostgreSQL arrays
    const parseArray = (str: string) => {
      if (!str) return [];
      if (typeof str === 'string' && str.startsWith('{') && str.endsWith('}')) {
        return str.slice(1, -1).split(',').filter(Boolean);
      }
      return Array.isArray(str) ? str : [];
    };

    // Parse JSON fields
    const parseJson = (field: any, defaultValue: any = {}) => {
      if (!field) return defaultValue;
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch {
          return defaultValue;
        }
      }
      return field;
    };

    // Handle special case for services
    const services = parseJson(dbRec.services, []);
    const normalizedServices = Array.isArray(services) ? 
      services : 
      Object.values(services as Record<string, Service>).filter(s => s.title && s.title !== '0');

    return {
      ...dbRec,
      specialties: parseArray(dbRec.specialties),
      certifications: parseArray(dbRec.certifications),
      lesson_types: parseArray(dbRec.lesson_types),
      highlights: parseArray(dbRec.highlights),
      photos: parseArray(dbRec.photos),
      services: normalizedServices,
      faqs: parseJson(dbRec.faqs, []),
      contact_info: parseJson(dbRec.contact_info, {
        email: dbRec.email,
        phone: dbRec.phone,
        website: dbRec.website || ''
      })
    } as InstructorDTO;
  }

  /**
   * Helper function to format service price
   */
  static formatPrice(price: string | number): string {
    if (typeof price === 'string') {
      return price.startsWith('$') ? price : `$${price}`;
    }
    return `$${price}`;
  }

  /**
   * Helper function to format service duration
   */
  static formatDuration(duration: string): string {
    const num = parseInt(duration.replace(/[^0-9]/g, ''));
    return isNaN(num) ? duration : `${num} minutes`;
  }
} 