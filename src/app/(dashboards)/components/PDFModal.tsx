// "use client";

// import { useState } from "react";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import Image, { StaticImageData } from "next/image";
// import { Loader2, FileText } from "lucide-react";

// interface PdfModalProps {
//   pdf: string;
//   thumbnail?: StaticImageData; // optional preview image
// }

// export function PdfModal({ pdf, thumbnail }: PdfModalProps) {
//   const [loading, setLoading] = useState(true);

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="ghost" className="p-0 w-full h-full">
//           {thumbnail ? (
//             <Image
//               src={thumbnail}
//               alt="PDF Thumbnail"
//               width={300}
//               height={200}
//               className="rounded-md w-full h-full object-cover"
//             />
//           ) : (
//             <div className="rounded-md w-full h-full bg-gray-200 flex items-center justify-center">
//               <FileText className="w-10 h-10 text-black" />
//             </div>
//           )}
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[800px] h-[90vh]">
//         <div className="w-full h-full relative rounded-md overflow-hidden">
//           {loading && (
//             <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
//               <Loader2 className="w-10 h-10 animate-spin text-white" />
//             </div>
//           )}
//           <iframe
//             src={pdf}
//             className="w-full h-full"
//             onLoad={() => setLoading(false)}
//           />
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import Image, { StaticImageData } from "next/image";
import { FileText } from "lucide-react";

interface PdfDownloadProps {
  pdf: string;
  thumbnail?: StaticImageData;
  fileName?: string;
}

export function PdfDownload({ pdf, thumbnail, fileName }: PdfDownloadProps) {
  return (
    <a href={pdf} download={fileName || "document.pdf"}>
      <Button variant="ghost" className="p-0 w-full h-full">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt="PDF Thumbnail"
            width={300}
            height={200}
            className="rounded-md w-full h-full object-cover"
          />
        ) : (
          <div className="rounded-md w-full h-full bg-gray-200 flex items-center justify-center">
            <FileText className="w-10 h-10 text-black" />
          </div>
        )}
      </Button>
    </a>
  );
}
