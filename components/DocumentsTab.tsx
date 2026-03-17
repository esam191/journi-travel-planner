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
        <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-5">
          <div className="space-y-1">
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
            <p className="text-sm text-muted-foreground">
              No documents uploaded yet.
            </p>
          ) : (
            documents.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="flex items-center justify-between gap-4 p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-medium">{doc.fileName}</h3>
                      <div className="text-sm text-muted-foreground">
                        <span>{formatBytes(doc.fileSize)}</span>
                        <span className="mx-2">•</span>
                        <span>{doc.mimeType || "Unknown type"}</span>
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
                      className="text-destructive hover:text-destructive"
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
