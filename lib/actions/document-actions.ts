"use server";

import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function saveDocument(data: {
  tripId: string;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  storageKey: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user?.id) {
    throw new Error("You must be signed in to upload documents.");
  }

  const { tripId, url, fileName, storageKey } = data;
  if (!tripId || !url || !fileName || !storageKey) {
    throw new Error("Missing required document fields.");
  }

  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      userId: session.user.id,
    },
    select: { id: true },
  });

  if (!trip) {
    throw new Error("Trip not found.");
  }

  try {
    await prisma.document.create({
      data: {
        tripId,
        url,
        fileName,
        fileSize: Math.floor(data.fileSize),
        mimeType: data.mimeType || "application/octet-stream",
        storageKey,
      },
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw new Error("This file already exists in your storage.");
    }
    throw new Error("Failed to save document to the database.");
  }
}