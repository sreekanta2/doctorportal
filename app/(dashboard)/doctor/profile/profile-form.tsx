"use client";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import CustomImage from "@/components/ImageComponent";
import FileInput from "@/components/shared/FileInput";
import SubmitButton from "@/components/submit-button";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { baseDoctorSchema } from "@/zod-validation/doctor";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

export default function DoctorProfileForm() {
  const user: any = {};
  const address: any = {};
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(
    "/images/doctor-profile/doctor-18.jpg"
  );
  type FormData = z.infer<typeof baseDoctorSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(baseDoctorSchema),
    // defaultValues: {
    //   fir: user?.name || "Jhon Doe",
    //   institution: user?.name?.charAt(0) || "Jhon",
    //   specialty: user?.role || "Doctor",
    //   phoneNumber: "+1-212-456-7890",
    //   email: user?.email || "jhon.doe@gmail.com",
    //   city: address?.city || "Las Vegas",
    //   address: address?.address || "234 Hickory Ridge Drive",
    //   state: address?.state || "NV",
    //   zipCode: address?.zip || "89119",
    //   country: address?.country || "United States",
    //   bio: "",
    // },
  });
  const onSubmit: SubmitHandler<FormData> = (data) => {
    setLoading(true);
    setTimeout(() => {
      toast.success("Form submitted successfully!");
      setLoading(false);
    }, 2000);
  };

  return (
    <Form {...form}>
      <div className="bg-card/70 border rounded-md">
        <h1 className="  py-2 border-b p-4 text-xl font-bold md:text-2xl">
          Profile
        </h1>
        <form
          className="space-y-6 p-4 border m-4 rounded-md bg-card"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* Profile Section */}

          <div className="border p-4  rounded-md flex gap-4 bg-card">
            <CustomImage
              src={profilePicture}
              alt=""
              aspectRatio="1/1"
              className="rounded-full"
              containerClass="w-24 h-24 "
            />

            <FileInput
              images={images}
              setImages={setImages}
              label="Profile Image"
              maxFiles={1}
            />
          </div>

          {/* Information Section */}

          <div className="w-full flex flex-col md:flex-row gap-4 items-start">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="name"
              label="Full name"
              placeholder="John Doe"
              iconAlt="user"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              type="email"
              label="Email"
              placeholder="jhon@example.com"
              iconAlt="Email"
              disabled={true}
            />
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="specialty"
              label="Specialty"
              placeholder="Specialty "
            >
              {["Cardiology", "Medichine"].map((spc) => (
                <SelectItem key={spc} value={spc.toLocaleLowerCase()}>
                  {spc}
                </SelectItem>
              ))}
            </CustomFormField>
          </div>
          <div className="w-full flex flex-col md:flex-row gap-4 items-start">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name="institution"
              control={form.control}
              label="Work Institution"
              placeholder="Enter Work Institution"
            />
            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="phoneNumber"
              label="Phone number"
              placeholder="(555) 123-4567"
            />
          </div>
          <div className="bg-card  rounded-md space-y-4">
            <div className="w-full flex flex-col md:flex-row gap-4 items-start">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="address"
                control={form.control}
                label="Address"
                placeholder="Enter your display name"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="city"
                control={form.control}
                label="City"
                placeholder="Enter your  city"
              />
            </div>
            <div className="w-full flex flex-col md:flex-row gap-4 items-start">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="state"
                control={form.control}
                label="State"
                placeholder="Enter your state name"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="country"
                control={form.control}
                label="Country"
                placeholder="Enter your country name"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="zipCode"
                control={form.control}
                label="Zip code"
                placeholder="Enter your zip code"
              />
            </div>
          </div>
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            name="bio"
            control={form.control}
            label="About"
            placeholder="Write something about yourself"
          />
          {/* Submit and Reset Buttons */}

          <SubmitButton variant="soft" color="info" isLoading={loading}>
            Update
          </SubmitButton>
        </form>
      </div>
    </Form>
  );
}
