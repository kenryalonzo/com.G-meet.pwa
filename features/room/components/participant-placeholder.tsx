"use client";

import React from 'react';
import { motion } from 'motion/react';
import useCurrentUser from '@/hooks/use-current-user';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from '@/lib/utils';

const ParticipantPlaceholder = () => {
    const user = useCurrentUser();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
        >
            <motion.div
                className="absolute inset-0 rounded-full bg-primary/30 blur-xl -z-10"
                animate={{ opacity: [0.3, 0.55, 0.3] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />

            <Avatar className="size-32 border-4 border-background/10 shadow-xl">
                <AvatarImage src={user?.image ?? undefined} />
                <AvatarFallback className="text-foreground text-5xl font-medium bg-primary/15">
                    {getInitials(user?.name)}
                </AvatarFallback>
            </Avatar>

            <span className="absolute bottom-2 right-2 size-5 bg-live rounded-full border-2 border-background" />
        </motion.div>
    );
};

export default ParticipantPlaceholder;
