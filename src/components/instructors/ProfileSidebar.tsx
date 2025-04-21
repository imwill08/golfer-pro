import React from 'react';

export interface ProfileSidebarProps {
  contactInfo: {
    email: string;
    phone: string;
    website: string;
  };
  certifications: string[];
  specialties: string[];
  highlights: string[];
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  contactInfo,
  certifications,
  specialties,
  highlights
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
      {/* Contact Information */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Contact Information</h3>
        <div className="space-y-3">
          {contactInfo.email && (
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="text-gray-900">{contactInfo.email}</p>
            </div>
          )}
          {contactInfo.phone && (
            <div>
              <label className="text-sm text-gray-500">Phone</label>
              <p className="text-gray-900">{contactInfo.phone}</p>
            </div>
          )}
          {contactInfo.website && (
            <div>
              <label className="text-sm text-gray-500">Website</label>
              <a 
                href={contactInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-golf-blue hover:underline"
              >
                {contactInfo.website}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Certifications</h3>
          <ul className="space-y-2">
            {certifications.map((cert, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-golf-blue">•</span>
                <span>{cert}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Specialties */}
      {specialties.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Specialties</h3>
          <ul className="space-y-2">
            {specialties.map((specialty, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-golf-blue">•</span>
                <span>{specialty}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Highlights */}
      {highlights.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4">Highlights</h3>
          <ul className="space-y-2">
            {highlights.map((highlight, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-golf-blue">•</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileSidebar;
