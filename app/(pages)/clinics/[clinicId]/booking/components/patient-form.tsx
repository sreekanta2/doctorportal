import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function PatientForm() {
  return (
    <div className="bg-card/70 rounded-lg shadow-sm border p-6">
      <h3 className="font-semibold text-lg mb-6">Patient Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="full-name">Full Name</Label>
          <Input id="full-name" placeholder="Your full name" />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" placeholder="Your phone number" />
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" placeholder="Your email" />
        </div>

        <div>
          <Label htmlFor="dob">Date of Birth</Label>
          <Input id="dob" type="date" />
        </div>
      </div>

      <div className="mt-6">
        <Label htmlFor="reason">Reason for Visit</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select reason" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="consultation">Consultation</SelectItem>
            <SelectItem value="follow-up">Follow-up Visit</SelectItem>
            <SelectItem value="checkup">Routine Checkup</SelectItem>
            <SelectItem value="symptoms">Specific Symptoms</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          placeholder="Any specific concerns or details you'd like to share"
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}
