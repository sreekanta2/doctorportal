import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, User } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Rating } from "../ui/rating";

export type TDoctor = {
  id: number;
  image: StaticImageData;
  name: string;
  rating: number;
  qualification: string;
  location: string;
  consultations: number;
};

export default function DoctorCard({ doctor }: { doctor: TDoctor }) {
  return (
    <Card className="bg-background shadow-lg rounded-lg p-2 text-left border">
      <CardHeader className="p-0 border-b-0">
        <div className="w-full h-64 lg:h-52 relative overflow-hidden border rounded-md p-2">
          <Image
            src={doctor?.image}
            alt={doctor?.name}
            fill
            className="object-cover cursor-pointer duration-500 hover:scale-110 transition-transform group-hover:opacity-50"
            quality={100}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 space-y-2">
        <div className="flex items-center gap-x-2">
          <Rating
            value={doctor?.rating} // Use dynamic rating
            readOnly
            className="gap-x-1.5 max-w-[120px]"
          />
          <span className="px-1 bg-primary rounded-md text-primary-foreground">
            {doctor?.rating?.toFixed(1)} {/* Ensure proper formatting */}
          </span>
        </div>
        <Link href={`/doctors/${doctor.id}`}>
          <CardTitle className="text-base lg:text-xl">{doctor.name}</CardTitle>
        </Link>

        <div className="text-xs space-y-1">
          <p className="text-base text-default-400">{doctor.qualification}</p>
          <p className="flex items-center gap-2">
            <MapPin size={14} />
            <span>{doctor.location}</span>
          </p>
          <p className="flex items-center gap-2">
            <User size={14} />
            <span>{doctor.consultations} Consultations</span>
          </p>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2 p-0  mt-4">
        <Button variant="soft" color="primary" className="text-primary">
          <Link href={`/doctors/${doctor.id}/booking`}>Book Now</Link>
        </Button>
        <Button variant="soft" color="primary" className="text-primary">
          <Link href={`/doctors/${doctor.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
