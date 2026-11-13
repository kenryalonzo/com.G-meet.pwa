import React, { useState, useEffect, useRef } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { useCallStateHooks } from '@stream-io/video-react-sdk'
import { 
  Webcam, 
  Laptop, 
  Monitor, 
  TabletSmartphone,
  Loader2,
  Video,
  VideoOff
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

interface Props {
  disabled: boolean
  className?: string
}

// Catégoriser les caméras par type basé sur leur nom
const getDeviceCategory = (label: string): string => {
  const lowerLabel = label.toLowerCase()
  
  if (/(integrated|built-in|facetime|macbook)/.test(lowerLabel)) return 'built-in'
  if (/(external|logitech|hd pro|webcam)/.test(lowerLabel)) return 'external'
  if (/(monitor|display|screen)/.test(lowerLabel)) return 'monitor'
  if (/(phone|tablet|mobile|android|ios)/.test(lowerLabel)) return 'mobile'
  if (/(virtual|obs|camlink|ndi)/.test(lowerLabel)) return 'virtual'
  return 'other'
}

// Obtenir l'icône appropriée pour chaque catégorie
const getDeviceIcon = (category: string) => {
  switch (category) {
    case 'built-in': return <Laptop className="size-4 mr-2" />
    case 'external': return <Webcam className="size-4 mr-2" />
    case 'monitor': return <Monitor className="size-4 mr-2" />
    case 'mobile': return <TabletSmartphone className="size-4 mr-2" />
    case 'virtual': return <Video className="size-4 mr-2" />
    default: return <Webcam className="size-4 mr-2" />
  }
}

const CustomDeviceSelectorVideo = ({ disabled, className }: Props) => {
  const { useCameraState } = useCallStateHooks()
  const { camera, devices, selectedDevice } = useCameraState()
  const [isLoading, setIsLoading] = useState(false)
  const [lastSelected, setLastSelected] = useState(selectedDevice || '')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  // Garder une trace du dernier appareil sélectionné
  useEffect(() => {
    if (selectedDevice) {
      setLastSelected(selectedDevice)
    }
  }, [selectedDevice])

  // Nettoyer le flux de prévisualisation
  useEffect(() => {
    return () => {
      if (previewStream) {
        previewStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [previewStream])

  const handleSelect = async (value: string) => {
    setIsLoading(true)
    try {
      await camera.select(value)
    } catch (error) {
      console.error('Failed to select camera:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Regrouper les appareils par catégorie
  const deviceGroups = devices?.reduce((acc, device) => {
    const category = getDeviceCategory(device.label)
    if (!acc[category]) acc[category] = []
    acc[category].push(device)
    return acc
  }, {} as Record<string, typeof devices>)

  // Catégories dans l'ordre d'affichage souhaité
  const categoryOrder = ['built-in', 'external', 'monitor', 'mobile', 'virtual', 'other']

  // Démarrer la prévisualisation de la caméra
  const startCameraPreview = async (deviceId: string) => {
    // Arrêter toute prévisualisation existante
    if (previewStream) {
      previewStream.getTracks().forEach(track => track.stop())
      setPreviewStream(null)
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId } }
      })
      
      setPreviewStream(stream)
      setPreviewOpen(true)
      
      // Attacher le flux à l'élément vidéo une fois qu'il est ouvert
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      }, 100)
    } catch (error) {
      console.error('Failed to start camera preview:', error)
    }
  }

  return (
    <div className={cn("w-full", className)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Select
              disabled={disabled || isLoading}
              value={selectedDevice || ''}
              onValueChange={handleSelect}
            >
              <SelectTrigger className="w-full flex items-center justify-between">
                <div className="flex items-center">
                  {isLoading ? (
                    <Loader2 className="size-4 mr-2 animate-spin" />
                  ) : selectedDevice ? (
                    <Video className="size-4 mr-2" />
                  ) : (
                    <VideoOff className="size-4 mr-2" />
                  )}
                  
                  {selectedDevice ? (
                    devices?.find(d => d.deviceId === selectedDevice)?.label?.split('(')[0] || 'Selected camera'
                  ) : (
                    <span>Select camera</span>
                  )}
                </div>
              </SelectTrigger>
              
              <SelectContent className="max-h-80 overflow-y-auto">
                {devices?.length === 0 ? (
                  <div className="py-4 text-center text-sm text-muted-foreground">
                    No cameras found
                  </div>
                ) : (
                  <>
                    {categoryOrder.map(category => (
                      deviceGroups?.[category]?.length ? (
                        <div key={category}>
                          <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            {category === 'built-in' ? 'Built-in Cameras' : 
                             category === 'external' ? 'External Webcams' : 
                             category === 'monitor' ? 'Monitor Cameras' : 
                             category === 'mobile' ? 'Mobile Devices' : 
                             category === 'virtual' ? 'Virtual Cameras' : 
                             'Other Cameras'}
                          </div>
                          
                          {deviceGroups[category].map((device) => (
                            <SelectItem 
                              key={device.deviceId} 
                              value={device.deviceId}
                              className="flex items-center"
                            >
                              {getDeviceIcon(category)}
                              {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
                              
                              {device.deviceId === lastSelected && (
                                <span className="ml-2 text-xs text-green-500">(Active)</span>
                              )}
                            </SelectItem>
                          ))}
                        </div>
                      ) : null
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </TooltipTrigger>
        
        <TooltipContent side="top">
          {selectedDevice ? (
            <p>Current camera: {devices?.find(d => d.deviceId === selectedDevice)?.label}</p>
          ) : (
            <p>Select a camera</p>
          )}
        </TooltipContent>
      </Tooltip>
      
      {/* Prévisualisation de la caméra */}
      {selectedDevice && !disabled && (
        <div className="mt-3">
          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => startCameraPreview(selectedDevice)}
              >
                Preview Camera
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-md">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                {previewStream ? (
                  <video 
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Loader2 className="size-8 animate-spin" />
                  </div>
                )}
              </div>
              
              <div className="mt-4 text-sm">
                <p className="font-medium">
                  {devices?.find(d => d.deviceId === selectedDevice)?.label || 'Camera Preview'}
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  Ensure your camera is positioned correctly and has adequate lighting
                </p>
              </div>
              
              <div className="mt-4 flex justify-end gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setPreviewOpen(false)}
                >
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    setPreviewOpen(false)
                    if (previewStream) {
                      previewStream.getTracks().forEach(track => track.stop())
                      setPreviewStream(null)
                    }
                  }}
                >
                  Use This Camera
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}

export default CustomDeviceSelectorVideo