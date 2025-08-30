"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SubscriptionWithRelations } from "@/types";
import UpdateSubscriptionDialog from "./update-modal";

export default function SubscriptionsList({
  subscriptions = [],
}: {
  subscriptions: SubscriptionWithRelations[];
}) {
  return (
    <div className="w-fit overflow-x-scroll">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Clinic Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Bkash Number</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((sub) => (
            <TableRow key={sub.id} className="hover:bg-muted">
              {/* Clinic Name */}
              <TableCell>
                <div className="flex gap-3 items-center">
                  <Avatar>
                    <AvatarImage src={sub?.clinic?.user?.image || ""} />
                    <AvatarFallback>
                      {sub?.clinic?.user?.name?.[0] || "C"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {sub?.clinic?.user?.name || "Unknown Clinic"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {sub?.clinic?.user?.email}
                    </div>
                  </div>
                </div>
              </TableCell>

              {/* Status */}
              <TableCell>
                <Badge variant="soft" className="capitalize">
                  {sub.status.toLowerCase()}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(sub.startDate).toLocaleString("en-US", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
              <TableCell>
                {new Date(sub.endDate).toLocaleString("en-US", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
              {/* Amount */}
              <TableCell>
                ৳ {sub.pricePlan?.price?.toLocaleString() || 0}
              </TableCell>

              {/* Transaction ID */}
              <TableCell>{sub.transactionId || "-"}</TableCell>

              {/* Bkash Number */}
              <TableCell>{sub.bkashNumber}</TableCell>

              {/* Actions */}
              <TableCell className="flex gap-2 justify-end">
                <UpdateSubscriptionDialog subscription={sub} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
