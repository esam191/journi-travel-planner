"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DocumentData } from "@/types/trip";
import { Download, FileText, Trash2, Upload } from "lucide-react";
import { saveDocument, deleteDocument } from "@/lib/actions/document-actions";
import { useRouter } from "next/navigation";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

type DocumentsTabProps = {
  documents: DocumentData[];
  tripId: string;
};

function formatBytes(bytes?: number | null) {
  if (!bytes) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getDocumentLabel(fileName: string) {
  const parts = fileName.split(".");
  if (parts.length < 2) return "FILE";
  return parts.at(-1)?.toUpperCase() ?? "FILE";
}

export default function DocumentsTab({ documents, tripId }: DocumentsTabProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<DocumentData | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed.");

      const { url } = await res.json();
      const storageKey = url.split(".com/")[1];

      await saveDocument({
        tripId,
        url,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        storageKey,
      });
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleDelete(document: DocumentData) {
    setDocumentToDelete(document);
  }

  async function handleConfirmDelete() {
    if (!documentToDelete) return;

    setDeleteLoading(true);
    try {
      await deleteDocument(documentToDelete.id);
      setDocumentToDelete(null);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Could not delete document.");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <>
      <Card className="overflow-hidden py-0">
        <CardHeader className="flex flex-col gap-4 border-b px-6 py-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Travel archive</Badge>
            </div>
            <CardTitle>Travel Documents</CardTitle>
            <CardDescription>
              Keep tickets, confirmations, and other trip files in one place.
            </CardDescription>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleUpload}
          />

          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload Document"}
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 p-6">
          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-[calc(var(--radius)*1.1)] border border-dashed border-border/80 bg-background/72 px-6 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border/70 bg-secondary text-primary">
                <FileText className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-2xl tracking-[-0.03em]">
                  No documents stored yet
                </h3>
                <p className="mx-auto max-w-md text-sm text-muted-foreground">
                  Upload tickets, hotel confirmations, and supporting files so
                  everything for the trip stays together.
                </p>
              </div>
            </div>
          ) : (
            documents.map((doc) => (
              <Card key={doc.id} className="bg-background/76 py-0">
                <CardContent className="flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-secondary text-primary">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">
                          {getDocumentLabel(doc.fileName)}
                        </Badge>
                        <Badge variant="outline">{formatBytes(doc.fileSize)}</Badge>
                      </div>
                      <h3 className="font-display text-2xl tracking-[-0.03em]">
                        {doc.fileName}
                      </h3>
                      <div className="text-sm text-muted-foreground">
                        <span>{doc.mimeType || "Unknown type"}</span>
                        <span className="mx-2">•</span>
                        <span>Stored for this trip</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button asChild variant="outline">
                      <a href={doc.url} target="_blank" rel="noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(doc)}
                      disabled={deleteLoading}
                      className="text-destructive hover:bg-destructive/8 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      <ConfirmDeleteDialog
        open={Boolean(documentToDelete)}
        onOpenChange={(open) => {
          if (!open && !deleteLoading) {
            setDocumentToDelete(null);
          }
        }}
        title="Delete Document"
        description={
          documentToDelete
            ? `Delete "${documentToDelete.fileName}"? This action cannot be undone.`
            : "Are you sure? This action cannot be undone."
        }
        confirmLabel="Delete Document"
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
