import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    const data = await res.json();

    const imageUrl =
      data.results?.[0]?.urls?.regular ||
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";

    return NextResponse.json({ imageUrl });
  } 
  catch (error) {
    return NextResponse.json(
      { imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
      { status: 200 }
    );
  }
}