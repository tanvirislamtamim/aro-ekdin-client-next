import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || "AIzaSyAe0og_1m6ea7zazPI96pjK-bRz4rfAb24";
  const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || "UCf9PIYP6I_lU46BGcNB3u9w";

  try {
    const res = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          key: API_KEY,
          channelId: CHANNEL_ID,
          part: "snippet",
          order: "date",
          maxResults: 20,
          type: "video",
        },
        headers: {
          Referer: "http://localhost:5173",
        },
      }
    );
    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("YouTube API Route Error:", error?.response?.data || error.message);
    return NextResponse.json(
      { error: error?.response?.data || error.message },
      { status: error?.response?.status || 500 }
    );
  }
}
