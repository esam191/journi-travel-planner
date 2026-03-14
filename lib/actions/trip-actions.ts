"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "../prisma";

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

export async function deleteTrip(tripId: string){
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user?.id) {
    throw new Error("You must be signed in to delete a trip.");
  }

  if (!tripId) {
    throw new Error("Missing trip ID.");
  }

  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      userId: session.user.id, 
    },
    select: {
      id: true,
    },
  });

  if (!trip) {
    throw new Error("Trip not found.");
  }
  
  await prisma.trip.delete({
    where: {
      id: trip.id,
    },
  });
}