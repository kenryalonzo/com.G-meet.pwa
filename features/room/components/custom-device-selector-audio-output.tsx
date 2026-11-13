import React, { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { useCallStateHooks } from '@stream-io/video-react-sdk'
import { 
  Speaker, 
  Headphones, 
  Bluetooth, 
  MonitorSpeaker,
  Volume2,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface Props {
  disabled: boolean
  className?: string
}

const getDeviceIcon = (label: string) => {
  if (label.toLowerCase().includes('headphone')) return <Headphones className="size-4 mr-2" />
  if (label.toLowerCase().includes('bluetooth')) return <Bluetooth className="size-4 mr-2" />
  if (label.toLowerCase().includes('monitor') || label.toLowerCase().includes('display')) 
    return <MonitorSpeaker className="size-4 mr-2" />
  return <Volume2 className="size-4 mr-2" />
}

const CustomDeviceSelectorAudioOutput = ({ disabled, className }: Props) => {
  const { useSpeakerState } = useCallStateHooks()
  const { speaker, devices, selectedDevice } = useSpeakerState()
  const [isLoading, setIsLoading] = useState(false)
  const [lastSelected, setLastSelected] = useState(selectedDevice || '')
  
  // Garder une trace du dernier appareil sélectionné
  useEffect(() => {
    if (selectedDevice) {
      setLastSelected(selectedDevice)
    }
  }, [selectedDevice])

  const handleSelect = async (value: string) => {
    setIsLoading(true)
    try {
      await speaker.select(value)
    } catch (error) {
      console.error('Failed to select audio output device:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Regrouper les appareils par type
  const deviceGroups = devices?.reduce((acc, device) => {
    const type = device.kind || 'other'
    if (!acc[type]) acc[type] = []
    acc[type].push(device)
    return acc
  }, {} as Record<string, typeof devices>)

  // Trier les groupes: d'abord les haut-parleurs, puis les casques, etc.
  const groupOrder = ['audiooutput', 'headphones', 'bluetooth', 'other']

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
                    <Speaker className="size-4 mr-2" />
                  ) : (
                    <Volume2 className="size-4 mr-2" />
                  )}
                  
                  {selectedDevice ? (
                    devices?.find(d => d.deviceId === selectedDevice)?.label?.split('(')[0] || 'Selected speaker'
                  ) : (
                    <span>Select speaker</span>
                  )}
                </div>
              </SelectTrigger>
              
              <SelectContent className="max-h-80 overflow-y-auto">
                {devices?.length === 0 ? (
                  <div className="py-4 text-center text-sm text-muted-foreground">
                    No audio output devices found
                  </div>
                ) : (
                  <>
                    {groupOrder.map(groupKey => (
                      deviceGroups?.[groupKey]?.length ? (
                        <div key={groupKey}>
                          <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            {groupKey === 'audiooutput' ? 'Speakers' : 
                             groupKey === 'headphones' ? 'Headphones' : 
                             groupKey === 'bluetooth' ? 'Bluetooth Devices' : 
                             'Other Devices'}
                          </div>
                          
                          {deviceGroups[groupKey].map((device) => (
                            <SelectItem 
                              key={device.deviceId} 
                              value={device.deviceId}
                              className="flex items-center"
                            >
                              {getDeviceIcon(device.label)}
                              {device.label || `Speaker ${device.deviceId.slice(0, 5)}`}
                              
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
            <p>Current audio output: {devices?.find(d => d.deviceId === selectedDevice)?.label}</p>
          ) : (
            <p>Select an audio output device</p>
          )}
        </TooltipContent>
      </Tooltip>
      
      {/* Bouton de test audio */}
      {selectedDevice && !disabled && (
        <div className="mt-2 flex justify-end">
          <button
            onClick={() => {
              // Jouer un son de test
              const audio = new Audio('/audio/notification.mp3')
              audio.play().catch(e => console.error('Audio test failed:', e))
            }}
            className="text-xs text-primary hover:underline flex items-center"
          >
            <Volume2 className="size-3 mr-1" />
            Test sound
          </button>
        </div>
      )}
    </div>
  )
}

export default CustomDeviceSelectorAudioOutput