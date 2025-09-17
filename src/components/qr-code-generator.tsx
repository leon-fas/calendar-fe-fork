"use client";

import { Download, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  downloadQRCode,
  generateQRCode,
  getQRFilename,
  getRoomUrl,
} from "@/lib/qr-utils";

interface QRCodeGeneratorProps {
  roomSlug?: string;
  roomName?: string;
  className?: string;
}

export function QRCodeGenerator({
  roomSlug,
  roomName,
  className,
}: QRCodeGeneratorProps) {
  const [qrCodeDataURL, setQRCodeDataURL] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function generateQR() {
      try {
        setIsLoading(true);
        setError("");

        const url = getRoomUrl(roomSlug);
        const dataURL = await generateQRCode(url);
        setQRCodeDataURL(dataURL);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to generate QR code";
        setError(errorMessage);
        console.error("QR generation error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    generateQR();
  }, [roomSlug]);

  const handleDownload = () => {
    if (!qrCodeDataURL) {
      toast.error("QR code not available for download");
      return;
    }

    try {
      const filename = getQRFilename(roomName);
      downloadQRCode(qrCodeDataURL, filename);
      toast.success("QR code downloaded successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Download failed";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <p className="text-sm text-destructive mb-2">
          Error generating QR code
        </p>
        <p className="text-xs text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center">
        <div className="inline-block p-2 bg-white rounded-lg border">
          <img
            src={qrCodeDataURL}
            alt={`QR code for ${roomName || "All Rooms"}`}
            className="w-[200px] h-[200px]"
          />
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="font-medium text-sm">{roomName || "All Rooms"}</p>
        <Button
          onClick={handleDownload}
          variant="outline"
          size="sm"
          className="w-full cursor-pointer"
        >
          <Download className="h-4 w-4 mr-2" />
          Download PNG
        </Button>
      </div>
    </div>
  );
}
