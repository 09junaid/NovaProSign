"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

type FormData = {
  name: string;
  signType: string;
  dimensions: string;
  colors: string;
  finish: string;
  usage: string;
  illuminated: string;
  permit: string;
  installation: string;
  ulcertificate: string;
  size: string;
  images: FileList;
  basePrice: number;
  discount: number;
};

const fields = [
  {
    name: "signType",
    label: "Sign Type",
    options: ["Acrylic Backkit", "Flat Cut", "Illuminated", "Non-Illuminated"],
  },
  { name: "dimensions", label: "Dimensions", options: ["See Table Below"] },
  {
    name: "colors",
    label: "Colors",
    options: ["Same as Mockup", "Red", "Green", "Blue"],
  },
  {
    name: "finish",
    label: "Finish",
    options: ["Matte", "Gloss", "Matte Gloss"],
  },
  { name: "usage", label: "Usage", options: ["Indoor", "Outdoor", "Both"] },
  { name: "illuminated", label: "Illuminated", options: ["Yes", "No"] },
  { name: "permit", label: "Permit", options: ["On Demand", "None"] },
  { name: "installation", label: "Installation", options: ["On Demand", "None"] },
  { name: "ulcertificate", label: "UL Certificate", options: ["On Demand", "None"] },
  {
    name: "size",
    label: "Size",
    options: ["100 x 100", "128.86 x 37.81", "200 x 200"],
  },
  { name: "basePrice", label: "Base Price", options: ["100", "200", "300"] },
  { name: "discount", label: "Discount Price (%)", options: ["10", "20", "30"] },
];

export default function UserForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const basePrice = Number(watch("basePrice"));
  const discount = Number(watch("discount"));

  const discountedPrice =
    basePrice && discount ? basePrice - (basePrice * discount) / 100 : null;

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const files = data.images;
      const imagePromises = Array.from(files).map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      const base64Images = await Promise.all(imagePromises);
      const finalData = {
        ...data,
        images: base64Images,
        discountedPrice,
      };

      localStorage.setItem("formData", JSON.stringify(finalData));
      router.push("/preview");
    } catch (error) {
      console.error("Error processing form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#f9fafb" }}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto rounded-xl shadow-md overflow-hidden p-6 sm:p-8 transition-all duration-300"
        style={{ backgroundColor: "#ffffff" }}
      >
        <h2
          className="text-2xl sm:text-3xl font-bold mb-6 text-center"
          style={{ color: "#1f2937" }}
        >
          Customer Order Form
        </h2>

        <div className="mb-8">
          <label className="block text-sm font-medium mb-2" style={{ color: "#374151" }}>
            Name
          </label>
          <input
            {...register("name", {
              required: "Name is required",
              validate: (value) =>
                value.trim() !== "" || "Name cannot be empty",
            })}
            className={`block w-full px-4 py-3 rounded-md border ${
              errors.name
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            } transition duration-150 ease-in-out sm:text-sm`}
            placeholder="Your full name"
          />
          {errors.name && (
            <p className="mt-2 text-sm" style={{ color: "#dc2626" }}>
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {fields.map((field) => (
            <div key={field.name} className="space-y-1">
              <label className="block text-sm font-medium" style={{ color: "#374151" }}>
                {field.label}
              </label>
              <select
                {...register(field.name as keyof FormData, {
                  required: `${field.label} is required`,
                })}
                className={`block w-full px-4 py-3 pr-8 rounded-md border ${
                  errors[field.name as keyof FormData]
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                } transition duration-150 ease-in-out sm:text-sm`}
              >
                <option value="">Select {field.label}</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors[field.name as keyof FormData] && (
                <p className="mt-2 text-sm" style={{ color: "#dc2626" }}>
                  {errors[field.name as keyof FormData]?.message as string}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium mb-2" style={{ color: "#374151" }}>
            Upload Images
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12"
                style={{ color: errors.images ? "#f87171" : "#9ca3af" }}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium hover:text-blue-500"
                  style={{ color: "#2563eb" }}
                >
                  <span>Upload files</span>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    {...register("images", {
                      required: "Please upload at least one image",
                      validate: (files) =>
                        files.length > 0 || "At least one image is required",
                    })}
                    className="sr-only"
                  />
                </label>
                <p className="pl-1" style={{ color: "#4b5563" }}>or drag and drop</p>
              </div>
              <p className="text-xs" style={{ color: "#6b7280" }}>
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
          {errors.images && (
            <p className="mt-2 text-sm" style={{ color: "#dc2626" }}>
              {errors.images.message}
            </p>
          )}
        </div>

        {discountedPrice !== null && (
          <div className="mb-6 text-right text-sm font-semibold" style={{ color: "#374151" }}>
            Discounted Price: ${discountedPrice.toFixed(2)}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
              isSubmitting
                ? "cursor-not-allowed"
                : "hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            } transition duration-150 ease-in-out`}
            style={{
              backgroundColor: isSubmitting ? "#60a5fa" : "#2563eb",
            }}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
