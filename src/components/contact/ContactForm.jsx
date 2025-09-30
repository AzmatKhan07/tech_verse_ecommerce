import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

/**
 * ContactForm Component
 * Displays the contact form with map integration
 */
const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  FULL NAME
                </label>
                <Input
                  name="fullName"
                  placeholder="Your Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  EMAIL ADDRESS
                </label>
                <Input
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  MESSAGE
                </label>
                <textarea
                  name="message"
                  placeholder="Your message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                />
              </div>

              <Button
                type="submit"
                className="bg-black text-white hover:bg-gray-800 px-8 py-3"
              >
                Send Message
              </Button>
            </form>
          </div>

          {/* Map Section */}
          <div>
            <Card>
              <CardContent className="p-0">
                <div className="w-full h-[400px] bg-gray-200 rounded-lg overflow-hidden relative">
                  {/* Placeholder for map - you can integrate with Google Maps or other map service */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-xl">3L</span>
                      </div>
                      <p className="text-gray-600 font-medium">
                        3legant Store Location
                      </p>
                      <p className="text-gray-500 text-sm">
                        234 Hai Trieu, Ho Chi Minh City
                      </p>
                    </div>
                  </div>

                  {/* You can replace this with actual map integration */}
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4326023157336!2d106.70414731533413!3d10.775570892318834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4b3332c9a9%3A0x3d8a7d3b8b3b3b3b!2s234%20Hai%20Trieu%2C%20District%201%2C%20Ho%20Chi%20Minh%20City%2C%20Vietnam!5e0!3m2!1sen!2s!4v1635789012345!5m2!1sen!2s"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
