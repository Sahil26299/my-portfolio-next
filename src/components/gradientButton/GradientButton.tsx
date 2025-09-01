"use client"

import { motion } from "framer-motion"
import { Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GradientButtonProps {
  fileName?: string
  fileUrl?: string
  className?: string
}

export default function GradientButton({
  fileName = "sahilLokhandeCV.pdf",
  fileUrl = `${location.href}files/sahilLokhandeCV.pdf`,
  className = "",
}: GradientButtonProps) {
  const handleDownload = () => {
    // Create a temporary link element to trigger download
    const link = document.createElement("a")
    link.target="_blank"
    link.href = fileUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`inline-block ${className}`}>
      <Button
        onClick={handleDownload}
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 hover:from-blue-700 hover:via-purple-700 hover:to-blue-900 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
      >
        {/* Animated background overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />

        {/* Button content */}
        <div className="relative flex items-center space-x-2 z-10">
          <FileText className="w-5 h-5" />
          <span>Download Resume</span>
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <Download className="w-5 h-5" />
          </motion.div>
        </div>

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
        />
      </Button>
    </motion.div>
  )
}
