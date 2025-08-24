"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

export default function LimitSelect() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const params = new URLSearchParams(searchParams.toString());

  const currentLimit = params.get("limit") || "10";

  const handleLimitChange = (value: string) => {
    params.set("limit", value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-40">
      <Select onValueChange={handleLimitChange}>
        <SelectTrigger size="lg">
          <SelectValue placeholder=" limit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5</SelectItem>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="50">50</SelectItem>
          <SelectItem value="100">100</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
