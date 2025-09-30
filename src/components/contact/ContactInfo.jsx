import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";

/**
 * ContactInfo Component
 * Displays contact information with address, phone, and email
 */
const ContactInfo = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-black mb-12">
          Contact Us
        </h2>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          {/* Address */}
          <div className="space-y-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <MapPin className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">ADDRESS</h3>
              <p className="text-gray-600 text-sm">
                234 Hai Trieu, Ho Chi Minh City,
                <br />
                Viet Nam
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">CONTACT US</h3>
              <p className="text-gray-600 text-sm">+84 234 567 890</p>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">EMAIL</h3>
              <p className="text-gray-600 text-sm">hello@3legant.com</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
