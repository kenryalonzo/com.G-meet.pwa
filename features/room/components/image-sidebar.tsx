import React, { useState, useEffect } from 'react'
import { useBackgroundFilters } from "@stream-io/video-react-sdk";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { 
  AlertTriangle, 
  Loader, 
  X, 
  Image as ImageIcon,
  Sparkles,
  Droplet
} from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface Props {
  blurLevel: blurLevel
  setOpen: (value: boolean) => void
  setBlurLevel: (value: blurLevel) => void
  selectedBackground: string | null
  setSelectedBackground: (value: string | null) => void
}

type blurLevel = "none" | "low" | "medium" | "high" | "disable"

const blurOptions = [
  { value: "disable", label: "None", icon: <X className="size-4" /> },
  { value: "low", label: "Low", icon: <Droplet className="size-4" /> },
  { value: "medium", label: "Medium", icon: <Droplet className="size-4" /> },
  { value: "high", label: "High", icon: <Droplet className="size-4" /> },
]

const ImageSidebar = ({ 
  blurLevel, 
  setOpen, 
  setBlurLevel,
  selectedBackground,
  setSelectedBackground
}: Props) => {
  const {
    isSupported,
    isReady,
    disableBackgroundFilter,
    applyBackgroundBlurFilter,
    applyBackgroundImageFilter,
    backgroundImages,
  } = useBackgroundFilters();

  const [searchQuery, setSearchQuery] = useState("")
  const [loadingImages, setLoadingImages] = useState(true)
  const [customImage, setCustomImage] = useState("")
  const [imageError, setImageError] = useState("")

  useEffect(() => {
    if (backgroundImages && backgroundImages.length > 0) {
      setLoadingImages(false)
    }
  }, [backgroundImages])

  const handleBlurChange = (value: blurLevel) => {
    setBlurLevel(value)
    setSelectedBackground(null)
    
    if (value === "disable") {
      disableBackgroundFilter()
    } else if (value !== "none") {
      applyBackgroundBlurFilter(value)
    }
  }

  const handleImageSelect = (image: string) => {
    applyBackgroundImageFilter(image)
    setSelectedBackground(image)
    setBlurLevel("disable")
  }

  const handleCustomImage = () => {
    if (!customImage) {
      setImageError("Please enter an image URL")
      return
    }
    
    try {
      // Vérifier si c'est une URL d'image valide
      new URL(customImage)
      
      // Créer un élément image pour vérifier la validité
      const img = new window.Image(0)
      img.onload = () => {
        applyBackgroundImageFilter(customImage)
        setSelectedBackground(customImage)
        setBlurLevel("disable")
        setImageError("")
        setOpen(false)
      }
      img.onerror = () => {
        setImageError("Failed to load image. Please check the URL.")
      }
      img.src = customImage
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setImageError("Invalid URL format")
    }
  }

  const filteredImages = backgroundImages?.filter(image => 
    image.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <aside className='bg-card relative h-full flex flex-col border-l border-border'>
      <div className='p-4 border-b border-border'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-lg font-bold flex items-center gap-2'>
              <Sparkles className='text-primary' size={20} />
              Virtual Background
            </h2>
            <p className='text-sm text-muted-foreground mt-1'>
              Enhance your video with background effects
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="text-muted-foreground"
          >
            <X size={18} />
          </Button>
        </div>
      </div>

      {/* Filtres de flou */}
      <div className='p-4 border-b border-border'>
        <div className='flex items-center justify-between mb-3'>
          <h3 className='font-medium'>Background Blur</h3>
          <Tooltip>
            <TooltipTrigger>
              <Droplet className='size-4 text-muted-foreground' />
            </TooltipTrigger>
            <TooltipContent>
              Blur your background to hide distractions
            </TooltipContent>
          </Tooltip>
        </div>

        <ToggleGroup
          type="single"
          value={blurLevel}
          onValueChange={(value: blurLevel) => handleBlurChange(value)}
          className='flex-wrap justify-start gap-2'
        >
          {blurOptions.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              className={cn(
                "flex flex-col h-16 w-16 rounded-lg border data-[state=on]:border-primary data-[state=on]:bg-primary/10",
                blurLevel === option.value ? "border-primary bg-primary/10" : ""
              )}
            >
              <div className="text-primary">
                {option.icon}
              </div>
              <span className="mt-1 text-xs">{option.label}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Custom image input */}
      <div className='p-4 border-b border-border'>
        <h3 className='font-medium mb-3'>Custom Background</h3>
        <div className="flex space-x-2">
          <Input
            placeholder="Paste image URL"
            value={customImage}
            onChange={(e) => setCustomImage(e.target.value)}
            className="flex-1"
          />
          <Button 
            variant="secondary"
            onClick={handleCustomImage}
            disabled={!customImage}
          >
            Apply
          </Button>
        </div>
        {imageError && (
          <p className="text-xs text-destructive mt-2">{imageError}</p>
        )}
      </div>

      {/* Bibliothèque d'images */}
      <div className='p-4 flex-1 overflow-hidden flex flex-col'>
        <div className="flex items-center justify-between mb-3">
          <h3 className='font-medium'>Image Library</h3>
          <div className="relative">
            <Input
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-40"
            />
            <ImageIcon className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          </div>
        </div>

        {!isSupported && (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <AlertTriangle className='size-8 text-yellow-500 mb-3' />
            <p className='text-muted-foreground'>
              Background filters are not supported on your device
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Try updating your browser or switching devices
            </p>
          </div>
        )}

        {!isReady && isSupported && (
          <div className='flex flex-col items-center justify-center py-12'>
            <Loader className='size-6 animate-spin text-primary mb-3' />
            <p className='text-muted-foreground'>Loading background filters</p>
          </div>
        )}

        {isSupported && isReady && (
          <ScrollArea className="h-[300px]">
            {loadingImages ? (
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <Skeleton key={idx} className="w-full h-24 rounded-md" />
                ))}
              </div>
            ) : (
              <div className='grid grid-cols-2 gap-4'>
                {filteredImages && filteredImages.length > 0 ? (
                  filteredImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageSelect(image)}
                      className={cn(
                        'relative w-full h-24 group rounded-md overflow-hidden border transition-all',
                        'hover:ring-2 hover:ring-primary hover:scale-[1.02]',
                        selectedBackground === image ? 'ring-2 ring-primary scale-[1.02]' : ''
                      )}
                    >
                      <Image 
                        fill
                        src={image}
                        alt={`Background ${index + 1}`}
                        className='object-cover'
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.onerror = null
                          target.parentElement?.classList.add('hidden')
                        }}
                      />
                      <div className={cn(
                        "absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                        selectedBackground === image ? "opacity-100" : ""
                      )}>
                        <div className="bg-black/50 rounded-full p-1.5">
                          <ImageIcon className="text-white size-4" />
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="col-span-2 py-8 text-center">
                    <ImageIcon className="mx-auto size-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No images found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {searchQuery ? "Try a different search term" : "No backgrounds available"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        )}
      </div>

      {/* Info footer */}
      <div className="p-4 mt-auto border-t border-border">
        <p className="text-xs text-muted-foreground">
          Background effects work best with a green screen and good lighting
        </p>
      </div>
    </aside>
  )
}

export default ImageSidebar

// Helper function for classNames
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}