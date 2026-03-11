import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DocumentData } from "@/types/trip";
import { Download, FileText, Trash2, Upload } from "lucide-react";

type DocumentsTabProps = {
  documents: DocumentData[];
};

function formatBytes(bytes?: number | null) {
  if (!bytes) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentsTab({ documents }: DocumentsTabProps) {
  return (
    <Card className="overflow-hidden py-0">
      <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-5">
        <CardTitle>Travel Documents</CardTitle>

        <Button disabled>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
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

                  <Button variant="ghost" size="icon" disabled>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
}