'use client';
import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import StaticSectionOne from '@/components/StaticSectionsOne';

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
  images: string[];
  basePrice: number;
  discount: number;
};

export default function UserPreview() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('formData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setFormData(parsedData);
    }
  }, []);

  const downloadAsPDF = async () => {
    const input = previewRef.current;
    if (!input) return;
  
    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
    });
  
    const imgData = canvas.toDataURL('image/png');
  
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: [imgWidth, imgHeight], // Custom height based on content
    });
  
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('form-data.pdf');
  };
  
  

  if (!formData) return <div className="p-4 text-center" style={{ color: '#4B5563' }}>No data found</div>;

  const discountedPrice = formData.basePrice * (1 - formData.discount / 100);

  return (
    <div ref={previewRef} className=" " style={{ backgroundColor: '#F3F4F6' }}>
      <div className=" mx-auto grid grid-cols-1 lg:grid-cols-3">
        {/* Left Static Section */}
        <div className="col-span-2">
          <StaticSectionOne />
        </div>

        {/* Right Form Data Preview */}
        <div className=" p-6 flex flex-col gap-6" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="relative border rounded-2xl p-4">
            <span
              className="absolute top-0 left-0 text-xl px-6 py-4 font-semibold uppercase tracking-wide"
              style={{
                borderRadius: '15px 0 0 0',
                backgroundColor: '#0072FF',
                color: 'white',
              }}
            >
              Quote Details
            </span>

            <div className="flex justify-between gap-10 mt-20">
              <div className="flex flex-col gap-2 text-sm font-semibold">
                <h1 className="text-lg mb-2">Customer Name</h1>
                <h1>Sign Type</h1>
                <h1>Dimensions</h1>
                <h1>Color</h1>
                <h1>Finish</h1>
                <h1>Usage</h1>
                <h1>Illuminated</h1>
              </div>
              <div className="flex flex-col gap-2 text-sm font-semibold" style={{ color: '#0072FF' }}>
                <span className="mb-2">:</span>
                <span>:</span>
                <span>:</span>
                <span>:</span>
                <span>:</span>
                <span>:</span>
                <span>:</span>
              </div>
              <div className="flex flex-col gap-2 text-sm" style={{ color: '#374151' }}>
                <p className="mb-2">{formData.name}</p>
                <p>{formData.signType}</p>
                <p>{formData.dimensions}</p>
                <p>{formData.colors}</p>
                <p>{formData.finish}</p>
                <p>{formData.usage}</p>
                <p>{formData.illuminated}</p>
              </div>
            </div>

            <hr className="my-4" style={{ borderColor: '#0072FF' }} />

            <div className="flex justify-between gap-10">
              <div className="flex flex-col gap-2 text-sm font-semibold">
                <h1>Permit</h1>
                <h1>Installation</h1>
                <h1>UL Certificate</h1>
                <h1>Size</h1>
              </div>
              <div className="flex flex-col gap-2 text-sm font-semibold" style={{ color: '#0072FF' }}>
                <span>:</span>
                <span>:</span>
                <span>:</span>
                <span>:</span>
              </div>
              <div className="flex flex-col gap-2 text-sm" style={{ color: '#374151' }}>
                <p>{formData.permit}</p>
                <p>{formData.installation}</p>
                <p>{formData.ulcertificate}</p>
                <p>{formData.size}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-col justify-center gap-2">
              <div className="flex flex-row justify-between">
                <h1>Client-Specified Size</h1>
                <h1>Discounted Price</h1>
              </div>
              <div className="flex justify-between">
                <div>
                  <p>{formData.size} inches</p>
                </div>
                <div>
                  <p className="text-sm line-through" style={{ color: 'red' }}>${formData.basePrice}</p>
                  <p className="text-sm"style={{color: '#0072FF'}}>${discountedPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Download Button */}
          </div>
              <div>
              <div className=" flex">
              <p
                onClick={downloadAsPDF}
                className=" transition px-6 py-2 cursor-pointer rounded-lg shadow-md"
                style={{ backgroundColor: '#0072FF', color: 'white' }}
              >
                Download as PDF
              </p>
            </div>
              </div>
          {/* Uploaded Images */}
          {formData.images && formData.images.length > 0 && (
            <div className="relative border rounded-2xl p-4">
              <span
                className="absolute top-0 left-0 text-md px-6 py-4 font-semibold uppercase tracking-wide"
                style={{
                  borderRadius: '15px 0 0 0',
                  backgroundColor: '#0072FF',
                  color: 'white',
                }}
              >
                Your Package Includes
              </span>
              <div className="mt-8 grid grid-cols-2 md:grid-cols-2 gap-4">
                {formData.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Uploaded ${idx}`}
                    className="w-full h-40 object-cover rounded-lg border"
                    style={{
                      transform: 'scale(0.4) rotate(130deg)',
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <footer className="text-sm w-full"style={{background:"white"}}>
      {/* Full-width heading row */}
      <div className=" font-semibold text-left w-full"
      style={{backgroundColor:"#E9F5FF"}}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between p-3">
          <div className="w-full md:w-1/2">Please review this carefully</div>
          <div className="w-full md:w-1/2">COPYRIGHT NOTICE</div>
        </div>
      </div>

      {/* Table content inside container */}
      <div className="max-w-6xl mx-auto">
        <table className="table-auto w-full border-separate border-spacing-y-4">
          <tbody>
            <tr className="align-top">
              {/* Left content (bullets) */}
              <td className="p-4 w-1/2"style={{color:"black"}}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Please make sure Spellings are correct</li>
                    <li>Mentioned Dimensions are accurate</li>
                    <li>2 Years Warranty: UL Listed Components</li>
                    <li>Delivery in 10-12 Working Days</li>
                  </ul>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Test proof of Color can be provided upon request</li>
                    <li>
                      Please note that NovaProSigns has up to 5% color and
                      dimension tolerance acceptable difference between digital
                      proof and actual product
                    </li>
                  </ul>
                </div>
              </td>

              {/* Right content (copyright) */}
              <td className="p-4 w-1/2 align-top"style={{color:"black"}}>
                <p>
                  All information on this document including mockups is the
                  property of NovaProSigns. Any use of redistribution of this
                  information, in whole or in part, contained within these
                  documents, may only be done with express written consent of
                  NovaProSigns.
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </footer>
    </div>
  );
}
