import React, { useState, useEffect, useCallback } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { useCallStateHooks } from '@stream-io/video-react-sdk'
import { 
  Mic, 
  MicOff, 
  Headphones, 
  Bluetooth, 
  Webcam, 
  Loader2,
  Volume2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'

interface Props {
  disabled: boolean
  className?: string
}

// Catégoriser les microphones par type basé sur leur nom
const getDeviceCategory = (label: string): string => {
  const lowerLabel = label.toLowerCase()
  
  if (/(headset|earphone|earphones|headphone)/.test(lowerLabel)) return 'headset'
  if (/(bluetooth|bt|wireless)/.test(lowerLabel)) return 'bluetooth'
  if (/(webcam|camera|logitech|hd pro)/.test(lowerLabel)) return 'webcam'
  if (/(external|usb|audio interface|focusrite)/.test(lowerLabel)) return 'external'
  return 'built-in'
}

// Obtenir l'icône appropriée pour chaque catégorie
const getDeviceIcon = (category: string) => {
  switch (category) {
    case 'headset': return <Headphones className="size-4 mr-2" />
    case 'bluetooth': return <Bluetooth className="size-4 mr-2" />
    case 'webcam': return <Webcam className="size-4 mr-2" />
    default: return <Mic className="size-4 mr-2" />
  }
}

const CustomDeviceSelectorAudio = ({ disabled, className }: Props) => {
  const { useMicrophoneState } = useCallStateHooks()
  const { microphone, devices, selectedDevice } = useMicrophoneState()
  const [isLoading, setIsLoading] = useState(false)
  const [lastSelected, setLastSelected] = useState(selectedDevice || '')
  const [testVolume, setTestVolume] = useState(0)
  const [isTesting, setIsTesting] = useState(false)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const [source, setSource] = useState<MediaStreamAudioSourceNode | null>(null)
  
  // Garder une trace du dernier appareil sélectionné
  useEffect(() => {
    if (selectedDevice) {
      setLastSelected(selectedDevice)
    }
  }, [selectedDevice])

  const handleSelect = async (value: string) => {
    setIsLoading(true)
    try {
      await microphone.select(value)
    } catch (error) {
      console.error('Failed to select microphone:', error)
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
  const categoryOrder = ['headset', 'bluetooth', 'webcam', 'external', 'built-in']

  // Démarrer le test du microphone
  const startMicTest = useCallback(async () => {
    if (!selectedDevice || isTesting) return
    
    try {
      setIsTesting(true)
      setTestVolume(0)
      
      // Créer un nouveau contexte audio si nécessaire
      if (!audioContext) {
        const newAudioContext = new (
          window.AudioContext ||
          (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
        )()
        setAudioContext(newAudioContext)
        
        const newAnalyser = newAudioContext.createAnalyser()
        newAnalyser.fftSize = 32
        setAnalyser(newAnalyser)
      }
      
      // Obtenir l'accès au microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: selectedDevice }
      })
      
      // Créer une source audio à partir du flux
      if (audioContext && analyser) {
        if (source) source.disconnect()
        
        const newSource = audioContext.createMediaStreamSource(stream)
        newSource.connect(analyser)
        setSource(newSource)
        
        // Analyser le volume
        const dataArray = new Uint8Array(analyser.frequencyBinCount)
        
        const checkVolume = () => {
          if (!isTesting) return
          
          analyser.getByteFrequencyData(dataArray)
          let sum = 0
          for (const amplitude of dataArray) {
            sum += amplitude
          }
          const average = sum / dataArray.length
          setTestVolume(Math.min(100, Math.round(average * 1.5)))
          
          requestAnimationFrame(checkVolume)
        }
        
        checkVolume()
      }
    } catch (error) {
      console.error('Microphone test failed:', error)
      setIsTesting(false)
    }
  }, [selectedDevice, isTesting, audioContext, analyser, source])

  // Arrêter le test
  const stopMicTest = useCallback(() => {
    setIsTesting(false)
    setTestVolume(0)
    if (source) {
      source.disconnect()
      setSource(null)
    }
    // Arrêter toutes les pistes audio
    if (source?.mediaStream) {
      source.mediaStream.getTracks().forEach(track => track.stop())
    }
  }, [source])

  // Nettoyer à la destruction du composant
  useEffect(() => {
    return () => {
      stopMicTest()
      if (audioContext) {
        audioContext.close()
      }
    }
  }, [stopMicTest, audioContext])

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
                    <div className="relative">
                      <Mic className={cn(
                        "size-4 mr-2"
                      )} />
                    </div>
                  ) : (
                    <MicOff className="size-4 mr-2" />
                  )}
                  
                  {selectedDevice ? (
                    devices?.find(d => d.deviceId === selectedDevice)?.label?.split('(')[0] || 'Selected mic'
                  ) : (
                    <span>Select microphone</span>
                  )}
                </div>
              </SelectTrigger>
              
              <SelectContent className="max-h-80 overflow-y-auto">
                {devices?.length === 0 ? (
                  <div className="py-4 text-center text-sm text-muted-foreground">
                    No microphones found
                  </div>
                ) : (
                  <>
                    {categoryOrder.map(category => (
                      deviceGroups?.[category]?.length ? (
                        <div key={category}>
                          <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            {category === 'headset' ? 'Headset' : 
                             category === 'bluetooth' ? 'Bluetooth' : 
                             category === 'webcam' ? 'Webcam' : 
                             category === 'external' ? 'External Mics' : 
                             'Built-in Microphones'}
                          </div>
                          
                          {deviceGroups[category].map((device) => (
                            <SelectItem 
                              key={device.deviceId} 
                              value={device.deviceId}
                              className="flex items-center"
                            >
                              {getDeviceIcon(category)}
                              {device.label || `Mic ${device.deviceId.slice(0, 5)}`}
                              
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
            <p>Current microphone: {devices?.find(d => d.deviceId === selectedDevice)?.label}</p>
          ) : (
            <p>Select a microphone</p>
          )}
        </TooltipContent>
      </Tooltip>
      
      {/* Contrôles de test du microphone */}
      {selectedDevice && !disabled && (
        <div className="mt-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Volume2 className="size-4 mr-2" />
              <span className="text-xs">Mic test</span>
            </div>
            
            {isTesting ? (
              <Button 
                variant="destructive"
                size="sm"
                onClick={stopMicTest}
                disabled={isLoading}
              >
                Stop test
              </Button>
            ) : (
              <Button 
                variant="secondary"
                size="sm"
                onClick={startMicTest}
                disabled={isLoading}
              >
                Start test
              </Button>
            )}
          </div>
          
          {isTesting && (
            <div className="space-y-2">
              <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-100"
                  style={{ width: `${testVolume}%` }}
                />
                <div className="absolute inset-0 flex items-center">
                  <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                </div>
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Silent</span>
                <span className={testVolume > 70 ? "text-red-500 font-medium" : ""}>
                  {testVolume > 70 ? "Too loud!" : "Speak now..."}
                </span>
                <span>Loud</span>
              </div>
              
              <div className="text-xs text-muted-foreground mt-2">
                <p className={testVolume < 20 ? "text-yellow-500" : ""}>
                  {testVolume < 20 
                    ? "Speak louder or move closer to the mic" 
                    : testVolume > 90
                      ? "Reduce microphone sensitivity or move away"
                      : "Good microphone level"}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CustomDeviceSelectorAudio