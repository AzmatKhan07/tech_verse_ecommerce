import React, { useEffect, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useBanners } from "@/lib/query/hooks/useBanners";
import { assets } from "@/assets/assets";

// Fallback static images in case API fails
const fallbackHeroItems = [
  {
    id: 1,
    image:
      "https://contentgrid.homedepot-static.com/hdus/en_US/DTCCOMNEW/Articles/best-furniture-for-your-home-2022-section-1.jpg",
    alt: "Modern Living Room Furniture",
    btn_txt: "Shop Now",
    btn_link: "/shop",
  },
  {
    id: 2,
    image:
      "https://contentgrid.homedepot-static.com/hdus/en_US/DTCCOMNEW/Articles/best-furniture-for-your-home-2022-section-2.jpg",
    alt: "Contemporary Furniture Collection",
    btn_txt: "Explore",
    btn_link: "/shop",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=600&fit=crop&auto=format",
    alt: "Elegant Home Decor",
    btn_txt: "Discover",
    btn_link: "/shop",
  },
];

const Hero = () => {
  const [api, setApi] = React.useState();
  const [isHovered, setIsHovered] = React.useState(false);
  const intervalRef = useRef(null);

  // Fetch active banners from API
  const {
    data: bannersData,
    isLoading,
    error,
  } = useBanners({
    status: true, // Only get active banners
    ordering: "-created_at", // Latest first
    page_size: 10, // Get up to 10 banners
  });

  // Use API banners if available, otherwise fallback to static images
  const heroItems =
    bannersData?.banners?.length > 0
      ? bannersData.banners.map((banner) => ({
          id: banner.id,
          image: banner.image,
          alt: banner.btn_txt || "Banner",
          btn_txt: banner.btn_txt,
          btn_link: banner.btn_link,
        }))
      : fallbackHeroItems;

  // Auto-play functionality
  useEffect(() => {
    if (!api || heroItems.length <= 1 || isHovered) return;

    const startAutoplay = () => {
      intervalRef.current = setInterval(() => {
        // With loop: true, scrollNext() will automatically loop to the beginning
        api.scrollNext();
      }, 3000);
    };

    startAutoplay();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [api, heroItems.length, isHovered]);

  // Handle hover events
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <section className="relative mt-5">
      <div className="container mx-auto px-4">
        <div className="relative mb-12">
          {isLoading ? (
            <Skeleton className="w-full h-[60vh] rounded-lg" />
          ) : (
            <Carousel
              className=""
              setApi={setApi}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              opts={{
                loop: true,
                align: "start",
                skipSnaps: false,
                dragFree: false,
              }}
            >
              <CarouselContent>
                {heroItems.map((item) => (
                  <CarouselItem key={item.id}>
                    <div className="relative rounded-lg overflow-hidden group">
                      <img
                        src={item.image}
                        alt={item.alt}
                        className="w-full h-[60vh] object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          e.target.src = "/placeholder-banner.jpg";
                        }}
                      />
                      {/* Banner Button Overlay */}
                      {item.btn_txt && item.btn_link && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                          <a
                            href={item.btn_link}
                            className="inline-flex flex-col items-center px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                          >
                            {item.btn_txt}{" "}
                            <span className="text-xs">{item.btn_link}</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-10 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white border-gray-200" />
              <CarouselNext className="right-10 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white border-gray-200" />
            </Carousel>
          )}
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
