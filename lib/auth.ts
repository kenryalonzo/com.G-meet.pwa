import { auth } from "@/auth";

export default async function CurrentUser() {
    const session = await auth();

    return session?.user;
}