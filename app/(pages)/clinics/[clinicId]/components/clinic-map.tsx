"use client";
// components/clinic-map.tsx
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function ClinicMap({ address }: { address: string }) {
  const getDirections = () => {
    const encodedAddress = encodeURIComponent(address);
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`
    );
  };
  return (
    <div className="bg-card/70 rounded-xl shadow-sm p-6 border border-default-200">
      <h3 className="text-lg font-semibold text-default-900 mb-4">Location</h3>

      <div className="rounded-xl overflow-hidden shadow-lg">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.138053618954!2d-122.4194155846823!3d37.77492997975938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
          width="100%"
          height="300"
          style={{ border: 0 }}
          aria-hidden="false"
          loading="lazy"
          title="MedCare HMS Location"
        ></iframe>
      </div>

      <Button variant="outline" className="w-full mt-4" onClick={getDirections}>
        <MapPin className="w-4 h-4 mr-2" />
        Get Directions
      </Button>
    </div>
  );
}
