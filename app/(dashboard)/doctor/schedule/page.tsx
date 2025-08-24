"use client";
import CustomImage from "@/components/ImageComponent";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, MapPin, Phone, Plus, X } from "lucide-react";
import { useState } from "react";
import { clinics } from "../dashboard/components/data";

interface ScheduleItem {
  form: string;
  to: string;
  startTime: string;
  endTime: string;
}

interface ClinicFormData {
  id: string;
  name: string;
  image: string;
  consultationFee: number;
  address: string;
  phone: string;
  schedule: ScheduleItem[];
}

const timeOptions = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
  "09:00 PM",
];

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Clinics = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentClinic, setCurrentClinic] = useState<ClinicFormData | null>(
    null
  );
  const [formData, setFormData] = useState<ClinicFormData>({
    id: "",
    name: "",
    image: "",
    consultationFee: 100,
    address: "",
    phone: "",
    schedule: [
      {
        form: "",
        to: "",
        startTime: "",
        endTime: "",
      },
    ],
  });

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      image: "",
      consultationFee: 100,
      address: "",
      phone: "",
      schedule: [
        {
          form: "Monday",
          to: "Friday",
          startTime: "08:00 AM",
          endTime: "06:00 PM",
        },
      ],
    });
  };

  const handleEdit = (clinic: ClinicFormData) => {
    setCurrentClinic(clinic);
    setFormData(clinic);
    setIsOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setCurrentClinic(null);
      resetForm();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.schedule.some(
        (item) => !item.form || !item.to || !item.startTime || !item.endTime
      )
    ) {
      alert("Please fill in all schedule fields.");
      return;
    }

    setIsOpen(false);
    resetForm();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScheduleChange = (
    index: number,
    field: keyof ScheduleItem,
    value: string
  ) => {
    const updated = [...formData.schedule];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, schedule: updated }));
  };

  const addScheduleDay = () => {
    setFormData((prev) => ({
      ...prev,
      schedule: [
        ...prev.schedule,
        { form: "", to: "", startTime: "", endTime: "" },
      ],
    }));
  };

  const removeScheduleDay = (index: number) => {
    if (formData.schedule.length > 1) {
      const updated = [...formData.schedule];
      updated.splice(index, 1);
      setFormData((prev) => ({ ...prev, schedule: updated }));
    }
  };

  return (
    <div className="w-full">
      <div className="border bg-card/70 rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-6 border-b">
          <h1 className="text-xl font-semibold">Clinics Schedules</h1>
          <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button onClick={() => setCurrentClinic(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Clinic
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {currentClinic ? "Edit Clinic" : "Add New Clinic"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Clinic Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter clinic name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="consultationFee">
                      Consultation Fee ($)
                    </Label>
                    <Input
                      id="consultationFee"
                      name="consultationFee"
                      type="number"
                      value={formData.consultationFee}
                      onChange={handleChange}
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Clinic address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="Image URL"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Schedule</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={addScheduleDay}
                    >
                      Add Day
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.schedule.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="grid grid-cols-4 gap-2 flex-1">
                          <select
                            value={item.form}
                            onChange={(e) =>
                              handleScheduleChange(
                                index,
                                "form",
                                e.target.value
                              )
                            }
                            className="border rounded-md px-3 py-2 text-base bg-background"
                            required
                          >
                            <option value="">From day</option>
                            {days.map((day) => (
                              <option key={day} value={day}>
                                {day}
                              </option>
                            ))}
                          </select>

                          <select
                            value={item.to}
                            onChange={(e) =>
                              handleScheduleChange(index, "to", e.target.value)
                            }
                            className="border rounded-md px-3 py-2 text-base bg-background"
                            required
                          >
                            <option value="">To day</option>
                            {days.map((day) => (
                              <option key={day} value={day}>
                                {day}
                              </option>
                            ))}
                          </select>

                          <select
                            value={item.startTime}
                            onChange={(e) =>
                              handleScheduleChange(
                                index,
                                "startTime",
                                e.target.value
                              )
                            }
                            className="border rounded-md px-3 py-2 text-base bg-background"
                            required
                          >
                            <option value="">Start</option>
                            {timeOptions.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>

                          <select
                            value={item.endTime}
                            onChange={(e) =>
                              handleScheduleChange(
                                index,
                                "endTime",
                                e.target.value
                              )
                            }
                            className="border rounded-md px-3 py-2 text-base bg-background"
                            required
                          >
                            <option value="">End</option>
                            {timeOptions.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>
                        {formData.schedule.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeScheduleDay(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {currentClinic ? "Save Changes" : "Add Clinic"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="p-6 space-y-4">
          {clinics.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-lg border p-6 hover:shadow-sm transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="flex flex-col sm:flex-row w-full items-start gap-4 flex-1">
                  <CustomImage
                    src={item.image}
                    alt={item.name}
                    aspectRatio="1/1"
                    containerClass="w-24 h-24"
                    className="rounded-lg"
                  />

                  <div className="flex-1 space-y-3">
                    <div>
                      <h2 className="font-medium text-lg">{item.name}</h2>
                      <p className="text-base text-muted-foreground">
                        ${item.consultationFee || 100} per consultation
                      </p>
                    </div>

                    <div className="space-y-1 text-base">
                      {item.address && (
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                          <span>{item.address}</span>
                        </div>
                      )}
                      {item.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{item.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {item.schedule?.map((day, i) => (
                        <div
                          key={i}
                          className="flex flex-col gap-1 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xs hover:shadow-sm min-w-[130px]"
                        >
                          <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-md px-2 py-1 text-xs font-medium text-center">
                            {day.form} - {day.to}
                          </div>
                          <div className="text-center font-semibold text-base text-gray-800 dark:text-gray-100">
                            {day.startTime} - {day.endTime}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => handleEdit(item)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>
          ))}

          <div className="text-center pt-4">
            {/* <Pagination totalPages={10} currentPage={1} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clinics;
