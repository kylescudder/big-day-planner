'use client'

import * as React from 'react'
import { IconCopy, IconCheck } from '@tabler/icons-react'
import * as ColourUtils from '@/lib/colour-utils'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ColourPickerProps {
  colour?: string
  onChange?: (value: string) => void
}

type ColourMode = 'hex' | 'rgba' | 'hsla'
type CopyState = { [key in ColourMode]: boolean }

export function ColourPicker({
  colour = '#000000',
  onChange
}: ColourPickerProps) {
  const [currentColour, setCurrentColour] = React.useState(colour)
  const [colourMode, setColourMode] = React.useState<ColourMode>('hex')
  const [copied, setCopied] = React.useState<CopyState>({
    hex: false,
    rgba: false,
    hsla: false
  })
  const colourPlaneRef = React.useRef<HTMLDivElement>(null)
  const isDragging = React.useRef(false)

  // Ensure we have a valid color to start with
  React.useEffect(() => {
    setCurrentColour(colour)
  }, [colour])

  const rgb = ColourUtils.hexToRgb(currentColour) || { r: 0, g: 0, b: 0 }
  const hsl = ColourUtils.rgbToHsl(rgb)
  const rgbaString = ColourUtils.formatRgba(rgb)
  const hslaString = ColourUtils.formatHsla(hsl)

  const handleColourChange = (newColour: string) => {
    setCurrentColour(newColour)
    onChange?.(newColour)
  }

  const updateHSL = (h: number, s: number, l: number) => {
    const rgb = ColourUtils.hslToRgb({ h, s, l })
    handleColourChange(ColourUtils.rgbToHex(rgb))
  }

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true
    handleColourPlaneChange(e)
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isDragging.current) {
      handleColourPlaneChange(e)
    }
  }

  const handleColourPlaneChange = (e: React.MouseEvent | React.TouchEvent) => {
    if (!colourPlaneRef.current) return

    const rect = colourPlaneRef.current.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0]!.clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0]!.clientY : e.clientY

    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))

    updateHSL(hsl.h, Math.round(x * 100), Math.round((1 - y) * 100))
  }

  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDragging.current = false
    }

    window.addEventListener('mouseup', handleGlobalMouseUp)
    window.addEventListener('touchend', handleGlobalMouseUp)

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp)
      window.removeEventListener('touchend', handleGlobalMouseUp)
    }
  }, [])

  const copyToClipboard = (text: string, format: ColourMode) => {
    navigator.clipboard.writeText(text)
    setCopied((prev) => ({
      ...prev,
      [format]: true
    }))
    setTimeout(() => {
      setCopied((prev) => ({
        ...prev,
        [format]: false
      }))
    }, 1500)
  }

  const handleHexChange = (hex: string) => {
    // Allow typing intermediate values
    setCurrentColour(hex)

    // Only update the actual colour if it's a valid hex
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      onChange?.(hex)
    }
  }

  const handleRgbChange = (key: keyof typeof rgb, value: string) => {
    // Allow empty string or numbers
    if (value === '' || !isNaN(Number(value))) {
      const numValue =
        value === '' ? 0 : Math.min(255, Math.max(0, Number(value)))
      const newRgb = { ...rgb, [key]: numValue }
      const newHex = ColourUtils.rgbToHex(newRgb)
      setCurrentColour(newHex)
      onChange?.(newHex)
    }
  }

  const handleHslChange = (key: keyof typeof hsl, value: string) => {
    // Allow empty string or numbers
    if (value === '' || !isNaN(Number(value))) {
      const max = key === 'h' ? 360 : 100
      const numValue =
        value === '' ? 0 : Math.min(max, Math.max(0, Number(value)))
      const newHsl = { ...hsl, [key]: numValue }
      const newRgb = ColourUtils.hslToRgb(newHsl)
      const newHex = ColourUtils.rgbToHex(newRgb)
      setCurrentColour(newHex)
      onChange?.(newHex)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className='w-[240px] justify-start text-left font-normal'
        >
          <div className='w-full flex items-center gap-2'>
            <div
              className='h-4 w-4 rounded !bg-center !bg-cover transition-all border'
              style={{ backgroundColor: currentColour }}
            />
            <div className='truncate flex-1'>{currentColour}</div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80'>
        <div className='grid gap-4'>
          <div
            ref={colourPlaneRef}
            className='relative w-full h-48 rounded-lg cursor-crosshair touch-none'
            style={{
              background: `
                linear-gradient(
                  180deg,
                  #fff 0%,
                  rgba(128, 128, 128, 0) 50%,
                  #000 100%
                ),
                radial-gradient(
                  ellipse at 100% 50%,
                  /* Hue at 0%, fade to transparent by 100% */
                  hsl(${hsl.h}, 100%, 50%) 0%,
                  transparent 100%
                )
              `
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
          >
            <div
              className='absolute w-4 h-4 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none shadow-md'
              style={{
                left: `${hsl.s}%`,
                top: `${100 - hsl.l}%`,
                backgroundColor: currentColour
              }}
            />
          </div>

          <div className='grid gap-2'>
            <Label>Hue</Label>
            <div className='relative'>
              <Slider
                value={[hsl.h]}
                max={360}
                step={1}
                className='[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_.bg-primary]:bg-transparent [&_.bg-secondary]:bg-transparent'
                onValueChange={([h]) => updateHSL(h!, hsl.s, hsl.l)}
                style={{
                  backgroundImage: `linear-gradient(to right, 
                    hsl(0, 100%, 50%),
                    hsl(60, 100%, 50%),
                    hsl(120, 100%, 50%),
                    hsl(180, 100%, 50%),
                    hsl(240, 100%, 50%),
                    hsl(300, 100%, 50%),
                    hsl(360, 100%, 50%)
                  )`
                }}
              />
              <style jsx global>{`
                .slider-thumb {
                  background-color: hsl(${hsl.h}, 100%, 50%) !important;
                  border: 2px solid white !important;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
                }
              `}</style>
            </div>
          </div>

          <Tabs
            value={colourMode}
            onValueChange={(v) => setColourMode(v as ColourMode)}
          >
            <TabsList className='w-full'>
              <TabsTrigger value='hex' className='flex-1'>
                Hex
              </TabsTrigger>
              <TabsTrigger value='rgba' className='flex-1'>
                RGBA
              </TabsTrigger>
              <TabsTrigger value='hsla' className='flex-1'>
                HSLA
              </TabsTrigger>
            </TabsList>

            <TabsContent value='hex' className='mt-2'>
              <div className='flex gap-2'>
                <Input
                  value={currentColour}
                  onChange={(e) => handleHexChange(e.target.value)}
                  className='font-mono'
                />
                <Button
                  variant='ghost'
                  size='icon'
                  className='shrink-0'
                  onClick={() => copyToClipboard(currentColour, 'hex')}
                >
                  {copied.hex ? (
                    <IconCheck className='h-4 w-4' />
                  ) : (
                    <IconCopy className='h-4 w-4' />
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value='rgba' className='mt-2'>
              <div className='grid gap-4'>
                <div className='flex gap-2'>
                  <Input value={rgbaString} readOnly className='font-mono' />
                  <Button
                    variant='ghost'
                    size='icon'
                    className='shrink-0'
                    onClick={() => copyToClipboard(rgbaString, 'rgba')}
                  >
                    {copied.rgba ? (
                      <IconCheck className='h-4 w-4' />
                    ) : (
                      <IconCopy className='h-4 w-4' />
                    )}
                  </Button>
                </div>
                <div className='grid grid-cols-4 gap-2'>
                  <div>
                    <Label>R</Label>
                    <Input
                      value={rgb.r}
                      onChange={(e) => handleRgbChange('r', e.target.value)}
                      className='font-mono'
                    />
                  </div>
                  <div>
                    <Label>G</Label>
                    <Input
                      value={rgb.g}
                      onChange={(e) => handleRgbChange('g', e.target.value)}
                      className='font-mono'
                    />
                  </div>
                  <div>
                    <Label>B</Label>
                    <Input
                      value={rgb.b}
                      onChange={(e) => handleRgbChange('b', e.target.value)}
                      className='font-mono'
                    />
                  </div>
                  <div>
                    <Label>A</Label>
                    <Input value='1' readOnly className='font-mono' />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value='hsla' className='mt-2'>
              <div className='grid gap-4'>
                <div className='flex gap-2'>
                  <Input value={hslaString} readOnly className='font-mono' />
                  <Button
                    variant='ghost'
                    size='icon'
                    className='shrink-0'
                    onClick={() => copyToClipboard(hslaString, 'hsla')}
                  >
                    {copied.hsla ? (
                      <IconCheck className='h-4 w-4' />
                    ) : (
                      <IconCopy className='h-4 w-4' />
                    )}
                  </Button>
                </div>
                <div className='grid grid-cols-4 gap-2'>
                  <div>
                    <Label>H</Label>
                    <Input
                      value={hsl.h}
                      onChange={(e) => handleHslChange('h', e.target.value)}
                      className='font-mono'
                    />
                  </div>
                  <div>
                    <Label>S</Label>
                    <Input
                      value={hsl.s}
                      onChange={(e) => handleHslChange('s', e.target.value)}
                      className='font-mono'
                    />
                  </div>
                  <div>
                    <Label>L</Label>
                    <Input
                      value={hsl.l}
                      onChange={(e) => handleHslChange('l', e.target.value)}
                      className='font-mono'
                    />
                  </div>
                  <div>
                    <Label>A</Label>
                    <Input value='1' readOnly className='font-mono' />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div
            className='h-6 rounded border'
            style={{ backgroundColor: currentColour }}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
