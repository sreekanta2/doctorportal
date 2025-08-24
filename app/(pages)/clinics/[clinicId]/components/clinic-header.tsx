import { Button } from "@/components/ui/button";
import { Calendar, Mail, MapPin, Phone, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ClinicHeader({ clinic }: { clinic: any }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="flex flex-col md:flex-row gap-6 p-6">
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg">
            <Image
              src={clinic.image}
              alt={clinic.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 25vw"
            />
            {clinic.premium && (
              <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                <Star className="w-3 h-3 mr-1 fill-white" />
                PREMIUM
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {clinic.name}
            </h1>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(clinic.rating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600">
              {clinic.rating} ({clinic.reviewCount} reviews)
            </span>
          </div>

          <p className="text-gray-700 mb-6">{clinic.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">Address</h3>
                <p className="text-gray-600">{clinic.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">Phone</h3>
                <p className="text-gray-600">{clinic.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">Email</h3>
                <p className="text-gray-600">{clinic.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">Specialists</h3>
                <p className="text-gray-600">{clinic.doctorCount}+ doctors</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              <Link href="#appointment">
                <Calendar className="w-4 h-4 mr-2" />
                Book Appointment
              </Link>
            </Button>
            <Button variant="outline">
              <Phone className="w-4 h-4 mr-2" />
              Call Clinic
            </Button>
            <Button variant="ghost">
              <MapPin className="w-4 h-4 mr-2" />
              Get Directions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
