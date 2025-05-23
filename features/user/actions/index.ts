"use server"

import CurrentUser from "@/lib/auth";
import { db } from "@/lib/db";

export const deleteAccount = async () => {
    try {
        const authUser = await CurrentUser();
        if (!authUser) {
            throw new Error("you must be logged in to delete your account");
        }
        const user = await db.user.delete({
            where: { id: authUser.id },
        });
        return user;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to delete account, please try again later.");
    }
}