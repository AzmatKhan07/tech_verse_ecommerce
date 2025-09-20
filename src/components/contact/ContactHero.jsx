import React from "react";

/**
 * ContactHero Component
 * Displays the main hero section with heading and description
 */
const ContactHero = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl">
          <h1 className="text-4xl lg:text-5xl font-bold text-black mb-6 leading-tight">
            We believe in sustainable decor. We're passionate about life at
            home.
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">
            Our features timeless furniture, with natural fabrics, curved lines,
            plenty of mirrors and classic design, which can be incorporated into
            any decor project. The pieces enchant for their sobriety, to last
            for generations, faithful to the shapes of each period, with a touch
            of the present.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
