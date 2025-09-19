import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { assets } from "@/assets/assets";

const HeroItems = [
  {
    id: 1,
    image:
      "https://contentgrid.homedepot-static.com/hdus/en_US/DTCCOMNEW/Articles/best-furniture-for-your-home-2022-section-1.jpg",
    alt: "Modern Living Room Furniture",
  },
  {
    id: 2,
    image:
      "https://contentgrid.homedepot-static.com/hdus/en_US/DTCCOMNEW/Articles/best-furniture-for-your-home-2022-section-2.jpg",
    alt: "Contemporary Furniture Collection",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=600&fit=crop&auto=format",
    alt: "Elegant Home Decor",
  },
];

const Hero = () => {
  return (
    <section className="relative mt-5">
      <div className="container mx-auto px-4">
        <div className="relative mb-12">
          <Carousel className="" options={{ loop: true }}>
            <CarouselContent>
              {HeroItems.map((item) => (
                <CarouselItem key={item.id}>
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="w-full h-[60vh] object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-10 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white border-gray-200" />
            <CarouselNext className="right-10 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white border-gray-200" />
          </Carousel>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-6xl font-semibold text-black leading-tight">
              Simply Unique/
              <br />
              Simply Better.
            </h1>
          </div>

          <div className="space-y-2">
            <p className="text-gray-600 text-lg leading-relaxed">
              3legant is a gift & decorations store based in HCMC,
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Vietnam. Est since 2019.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
