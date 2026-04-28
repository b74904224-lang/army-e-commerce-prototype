"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useStore } from "@/lib/store-context"
import { CheckCircle } from "lucide-react"

export function Notification() {
  const { notification } = useStore()

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -50, x: "-50%" }}
          className="fixed top-20 left-1/2 z-50 px-6 py-3 bg-primary text-primary-foreground rounded shadow-lg flex items-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">{notification}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
