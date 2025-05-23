"use server";

import CurrentUser from "@/lib/auth";
import { StreamClient } from "@stream-io/node-sdk";

const STREAM_VIDEO_API_KEY = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;
const STREAM_VIDEO_API_SECRET = process.env.STREAM_VIDEO_API_SECRET;

export const getToken = async () => {
    const user = await CurrentUser();
    if (!user || !user.id || !user.name || !user.image) throw new Error("User not found");

    if (!STREAM_VIDEO_API_KEY) throw new Error("Stream Video key not found");
    if (!STREAM_VIDEO_API_SECRET) throw new Error("Stream Video secret not found");

    const client = new StreamClient(STREAM_VIDEO_API_KEY, STREAM_VIDEO_API_SECRET);

    const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour expiration time
    const issuedAt = Math.floor(Date.now() / 1000) - 60; // current time

    const token = client.generateUserToken({
        user_id: user.id,
        exp: expirationTime,
        iat: issuedAt,
    });

    return token;
}