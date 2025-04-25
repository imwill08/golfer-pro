import { InstructorDTO, InstructorSchema, ServiceSchema, Service } from '../types/instructor';

export class InstructorService {
  /**
   * Normalizes raw form data into a consistent InstructorDTO format
   */
  static normalizeInput(raw: any): Partial<InstructorDTO> {
    // Handle lesson_types array/object normalization
    let lesson_types: Service[] = [];
    
    if (raw.lesson_types) {
      if (Array.isArray(raw.lesson_types)) {
        // If it's already an array (new structure), use it directly
        lesson_types = raw.lesson_types.map((lt: any) => ({
          title: lt.title || '',
          description: lt.description || '',
          duration: lt.duration || '',
          price: typeof lt.price === 'number' ? lt.price : Number(String(lt.price || '0').replace(/[^0-9.]/g, '')) || 0
        }));
      } else if (typeof raw.lesson_types === 'object' && raw.lesson_types !== null) {
        // Handle old structure (object with boolean or object values)
        try {
          lesson_types = Object.entries(raw.lesson_types)
            .filter(([_, value]) => value && typeof value === 'object' && 'title' in value)
            .map(([_, value]: [string, any]) => ({
              title: value.title || '',
              description: value.description || '',
              duration: value.duration || '',
              price: typeof value.price === 'number' ? value.price : Number(String(value.price || '0').replace(/[^0-9.]/g, '')) || 0
            }));
        } catch (error) {
          console.error('Error processing lesson_types:', error);
          lesson_types = [];
        }
      }
    } else if (raw.services) {
      // Backward compatibility with old services field
      if (Array.isArray(raw.services)) {
        lesson_types = raw.services;
      } else if (typeof raw.services === 'object' && raw.services !== null) {
        try {
          lesson_types = Object.entries(raw.services as Record<string, Service>)
            .filter(([key, value]) => key !== '0' && value.title && value.title !== '0')
            .map(([_, value]) => value);
        } catch (error) {
          console.error('Error processing services:', error);
          lesson_types = [];
        }
      }
    }

    // Normalize arrays to prevent null/undefined
    const arrays = ['specialties', 'certifications', 'highlights', 'photos', 'gallery_photos'];
    const normalizedArrays = arrays.reduce((acc, key) => ({
      ...acc,
      [key]: Array.isArray(raw[key]) ? raw[key] : 
             raw[key] ? [raw[key]] : []
    }), {});

    // Generate computed fields
    const computed = {
      name: raw.first_name && raw.last_name ? `${raw.first_name} ${raw.last_name}` : raw.name || '',
      location: raw.location || [raw.city, raw.state, raw.country].filter(Boolean).join(', '),
      contact_info: {
        email: raw.email,
        phone: raw.phone,
        website: raw.website || ''
      }
    };

    return {
      ...raw,
      ...normalizedArrays,
      lesson_types,
      ...computed
    };
  }

  /**
   * Validates and transforms the DTO according to schema rules
   */
  static validateAndTransform(dto: Partial<InstructorDTO>): InstructorDTO {
    try {
      return InstructorSchema.parse(dto) as unknown as InstructorDTO;
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
    const arrayFields = ['specialties', 'certifications', 'highlights', 'photos', 'gallery_photos'];
    const formattedArrays = arrayFields.reduce((acc, field) => ({
      ...acc,
      [field]: dto[field]?.length ? `{${dto[field].join(',')}}` : '{}'
    }), {});

    // Handle lesson_types format - ensure it's always stored as JSON
    const lesson_types = JSON.stringify(Array.isArray(dto.lesson_types) ? dto.lesson_types : []);

    return {
      ...dto,
      ...formattedArrays,
      lesson_types,
      faqs: JSON.stringify(dto.faqs || []),
      contact_info: JSON.stringify(dto.contact_info)
    };
  }

  /**
   * Formats database record back into DTO format
   */
  static fromDbPayload(dbRec: any): Partial<InstructorDTO> {
    if (!dbRec) return {} as Partial<InstructorDTO>;
    
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

    // Handle special case for lesson_types (with backward compatibility for services)
    let lesson_types: Service[] = [];
    
    if (dbRec.lesson_types) {
      const parsedTypes = parseJson(dbRec.lesson_types, []);
      if (Array.isArray(parsedTypes)) {
        lesson_types = parsedTypes.map((lt: any) => ({
          title: lt.title || '',
          description: lt.description || '',
          duration: lt.duration || '',
          price: typeof lt.price === 'number' ? lt.price : 
                Number(String(lt.price || '0').replace(/[^0-9.]/g, '')) || 0
        }));
      }
    } else if (dbRec.services) {
      // Backward compatibility
      const parsedServices = parseJson(dbRec.services, []);
      if (Array.isArray(parsedServices)) {
        lesson_types = parsedServices.map((s: any) => ({
          title: s.title || '',
          description: s.description || '',
          duration: s.duration || '',
          price: typeof s.price === 'number' ? s.price :
                 Number(String(s.price || '0').replace(/[^0-9.]/g, '')) || 0
        }));
      } else if (typeof parsedServices === 'object') {
        lesson_types = Object.values(parsedServices)
          .filter(s => s && typeof s === 'object' && 'title' in s)
          .map((s: any) => ({
            title: s.title || '',
            description: s.description || '', 
            duration: s.duration || '',
            price: typeof s.price === 'number' ? s.price :
                   Number(String(s.price || '0').replace(/[^0-9.]/g, '')) || 0
          }));
      }
    }

    return {
      ...dbRec,
      specialties: parseArray(dbRec.specialties),
      certifications: parseArray(dbRec.certifications),
      highlights: parseArray(dbRec.highlights),
      photos: parseArray(dbRec.photos),
      gallery_photos: parseArray(dbRec.gallery_photos || []),
      lesson_types,
      faqs: parseJson(dbRec.faqs, []),
      contact_info: parseJson(dbRec.contact_info, {
        email: dbRec.email,
        phone: dbRec.phone,
        website: dbRec.website || ''
      })
    };
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