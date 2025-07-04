"use client";
import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function ImageBlock({
  block,
  onUpdate
}) {
  const [showUrlDialog, setShowUrlDialog] = useState(false)
  const [imageUrl, setImageUrl] = useState(block.content.src)

  const handleUrlSubmit = () => {
    onUpdate({ src: imageUrl })
    setShowUrlDialog(false)
  }

  const imageStyles = {
    width: block.content.width ? `${block.content.width}px` : "auto",
    height: block.content.height ? `${block.content.height}px` : "auto",
    padding: `${block.styles.padding?.top || 0}px ${block.styles.padding?.right || 0}px ${block.styles.padding?.bottom || 0}px ${block.styles.padding?.left || 0}px`,
    margin: `${block.styles.margin?.top || 0}px ${block.styles.margin?.right || 0}px ${block.styles.margin?.bottom || 0}px ${block.styles.margin?.left || 0}px`,
    backgroundColor: block.styles.backgroundColor,
    borderRadius: `${block.styles.borderRadius}px`,
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative group"
      style={imageStyles}>
      <img
        src={block.content.src || "/placeholder.svg"}
        alt={block.content.alt}
        className="max-w-full h-auto block"
        style={{
          borderRadius: `${block.styles.borderRadius}px`,
        }} />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20 flex items-center justify-center space-x-2">
        <Dialog open={showUrlDialog} onOpenChange={setShowUrlDialog}>
          <DialogTrigger asChild>
            <Button size="sm" variant="secondary">
              <LinkIcon className="w-4 h-4 mr-2" />
              Change URL
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Image URL</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg" />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowUrlDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUrlSubmit}>Update</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button size="sm" variant="secondary">
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
      </div>
    </motion.div>
  );
}
