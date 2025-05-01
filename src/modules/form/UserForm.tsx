"use client";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { MdCancel } from "react-icons/md";
import { useDropzone } from "react-dropzone";

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
  {
    name: "installation",
    label: "Installation",
    options: ["On Demand", "None"],
  },
  {
    name: "ulcertificate",
    label: "UL Certificate",
    options: ["On Demand", "None"],
  },
  {
    name: "size",
    label: "Size",
    options: ["100 x 100", "128.86 x 37.81", "200 x 200"],
  },
  { name: "basePrice", label: "Base Price", options: ["100", "200", "300"] },
  {
    name: "discount",
    label: "Discount Price (%)",
    options: ["10", "20", "30"],
  },
];

export default function UserForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const basePrice = Number(watch("basePrice"));
  const discount = Number(watch("discount"));

  const discountedPrice =
    basePrice && discount ? basePrice - (basePrice * discount) / 100 : null;

  // react-dropzone configuration
  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif",".webp"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
    onDrop,
    onDropRejected: (rejectedFiles) => {
      alert(
        `Some files were rejected. Only images under 10MB are allowed.`
      );
    },
  });

  // Handle file processing
  const handleFiles = useCallback(
    (newFiles: File[]) => {
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);

      const dataTransfer = new DataTransfer();
      updatedFiles.forEach((file) => dataTransfer.items.add(file));
      setValue("images", dataTransfer.files);
    },
    [files, previews, setValue]
  );

  // Clean up object URLs
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  // Handle manual file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  // Remove image from preview and files
  const handleRemoveImage = (indexToRemove: number) => {
    const newFiles = files.filter((_, index) => index !== indexToRemove);
    const newPreviews = previews.filter((_, index) => index !== indexToRemove);

    setFiles(newFiles);
    setPreviews(newPreviews);

    const dataTransfer = new DataTransfer();
    newFiles.forEach((file) => dataTransfer.items.add(file));
    setValue("images", dataTransfer.files);
  };

  // Form submission
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const imagePromises = files.map((file) => {
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

  // File validation
  const validateFiles = (files: FileList) => {
    if (!files || files.length === 0) return "Please upload at least one image";
    return true;
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto rounded-xl shadow-md overflow-hidden p-6 sm:p-8 bg-gray-100 transition-all duration-300"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-blue-600">
          Customer Order Form
        </h2>

        {/* Name Field */}
        <div className="mb-8">
          <label className="block text-sm font-bold mb-2 text-blue-600">
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
            <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {fields.map((field) => (
            <div key={field.name} className="space-y-1">
              <label className="block text-sm font-bold text-blue-600">
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
                <p className="mt-2 text-sm text-red-600">
                  {errors[field.name as keyof FormData]?.message as string}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* File Upload Section */}
        <div className="mb-8">
          <label className="block text-sm font-bold mb-2 text-blue-600">
            Upload Images
          </label>
          <div
            {...getRootProps()}
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
              isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            } ${errors.images ? "border-red-300" : ""}`}
          >
            <div className="space-y-1 text-center">
              <svg
                className={`mx-auto h-12 w-12 ${
                  errors.images ? "text-red-400" : "text-blue-500"
                }`}
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
              <div className="flex text-sm justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-bold text-blue-600 hover:text-blue-500"
                >
                  <span>Upload files</span>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
                <p className="pl-1 text-blue-600">or drag and drop</p>
              </div>
              <p className="text-xs text-blue-600">PNG, JPG, GIF up to 10MB</p>
              {isDragActive && (
                <p className="text-sm text-blue-500 mt-2">
                  Drop your images here
                </p>
              )}
              {previews.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative w-32 h-32">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <MdCancel
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(index);
                        }}
                        className="absolute top-1 right-1 text-red-500 bg-white rounded-full text-xl cursor-pointer hover:text-red-700"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <input
            {...getInputProps()}
            {...register("images", { validate: validateFiles })}
          />
          {errors.images && (
            <p className="mt-2 text-sm text-red-600">{errors.images.message}</p>
          )}
        </div>

        {/* Discounted Price */}
        {discountedPrice !== null && (
          <div className="mb-6 text-right text-sm font-semibold text-blue-600">
            Discounted Price: ${discountedPrice.toFixed(2)}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-md shadow-sm text-white ${
              isSubmitting
                ? "cursor-not-allowed bg-blue-400"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            } transition duration-150 ease-in-out`}
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