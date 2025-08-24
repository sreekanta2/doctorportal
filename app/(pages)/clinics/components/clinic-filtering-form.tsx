"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const locations = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
];

export default function FilterForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    name: searchParams.get("name") || "",
    branch: searchParams.get("branch") || "",
  });

  // Sync state with URL params
  useEffect(() => {
    setFilters({
      name: searchParams.get("name") || "",

      branch: searchParams.get("branch") || "",
    });
  }, [searchParams]);

  const handleChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (filters.name) params.set("name", filters.name);

    if (filters.branch) params.set("branch", filters.branch);

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    setFilters({ name: "", branch: "" });
    router.push(pathname);
  };

  return (
    <div className="bg-card rounded-md  ">
      <form onSubmit={handleSubmit} className=" space-y-6 dark:p-4  dark:mb-4">
        <div className="flex flex-col md:flex-row gap-4  ">
          {/* Name Field */}
          <div className="flex-1 min-w-[200px]">
            <Input
              name="name"
              value={filters.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Doctor name"
              className="w-full h-10 placeholder:text-sm md:text-base "
            />
          </div>

          {/* branch Field */}
          <div className="flex-1 min-w-[150px]">
            <Select
              value={filters.branch}
              onValueChange={(value) => handleChange("branch", value)}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="brach" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="">Branch</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-3 pb-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="h-9 px-4"
            >
              Clear Filters
            </Button>
            <Button type="submit" className="h-9 px-4">
              Apply Filters
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
