"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Camera, Mic, AlertCircle } from 'lucide-react';

const RequestPermissionPlaceholder = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center p-6 bg-card rounded-xl border border-border shadow-lg max-w-md mx-auto"
    >
      <div className="bg-primary/15 p-3 rounded-full mb-4">
        <AlertCircle className="text-primary size-7" />
      </div>

      <h3 className="font-medium text-lg mb-1">Permission required</h3>
      <p className="text-muted-foreground text-sm mb-4 text-center">
        Allow access to your camera and microphone to join the call.
      </p>

      <div className="flex gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="bg-muted p-3 rounded-full">
            <Camera className="text-foreground/80 size-5" />
          </div>
          <span className="text-xs text-muted-foreground">Camera</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="bg-muted p-3 rounded-full">
            <Mic className="text-foreground/80 size-5" />
          </div>
          <span className="text-xs text-muted-foreground">Microphone</span>
        </div>
      </div>
    </motion.div>
  );
};

export default RequestPermissionPlaceholder;
