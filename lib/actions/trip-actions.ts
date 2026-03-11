"use server";

import { auth } from "@/lib/auth";
import prisma from "../prisma";
import { headers } from "next/headers";

export async function createTrip(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user?.id) {
    throw new Error("You must be signed in to create a trip.");
  }

  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();
  const startDateStr = formData.get("startDate")?.toString();
  const endDateStr = formData.get("endDate")?.toString();

  if (!title || !description || !startDateStr || !endDateStr) {
    throw new Error("Missing required trip fields.");
  }

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  await prisma.trip.create({
    data: {
      title,
      description,
      imageUrl,
      startDate,
      endDate,
      userId: session.user.id,
    },
  });
}