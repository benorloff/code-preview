"use client"

import { useEffect, useRef, useState } from "react";

import { useDebounceCallback, useResizeObserver } from "usehooks-ts";
import { 
    ImperativePanelGroupHandle, 
    PanelResizeHandle,
    PanelGroup, 
    Panel, 
} from "react-resizable-panels";

import { Button } from "@/components/ui/button";
import { 
    Card, 
    CardContent, 
    CardHeader 
} from "@/components/ui/card";
import { 
    Laptop, 
    Smartphone, 
    Tablet 
} from "lucide-react";

interface Device {
    name: "desktop" | "tablet" | "smartphone" | undefined;
    layout: [number, number, number];
    icon: React.ReactNode;
    disabled: boolean;
}[]

interface Size {
    width?: number;
    height?: number;
}

const devices: {[key: string]: Device} = {
    desktop: {
        name: "desktop",
        layout: [0,100,0],
        icon: <Laptop className="h-4 w-4" />,
        disabled: false,
    },
    tablet: {
        name: "tablet",
        layout: [20,60,20],
        icon: <Tablet className="h-4 w-4" />,
        disabled: false,
    },
    smartphone: {
        name: "smartphone",
        layout: [30,40,30],
        icon: <Smartphone className="h-4 w-4" />,
        disabled: false,
    },
} 

export const DemoPreview = ({
    children,
}: {
    children: React.ReactNode,
}) => { 
    
    const [device, setDevice] = useState<Device["name"]>(undefined);
    const [panelSize, setPanelSize] = useState<Size>({
        width: undefined,
        height: undefined,
    });
    const [containerSize, setContainerSize] = useState<Size>({
        width: undefined,
        height: undefined,
    });
    
    const panelGroupRef = useRef<ImperativePanelGroupHandle>(null)
    const panelRef = useRef<HTMLDivElement>(null)
    const previewContainerRef = useRef<HTMLDivElement>(null)

    const onContainerResize = useDebounceCallback(setContainerSize, 10);
    const onPanelResize = ({ width, height }: Size) => {
        setPanelSize({ 
            width: Math.ceil(width!), 
            height: Math.ceil(height!) 
        });
    }
    
    useResizeObserver({
        ref: previewContainerRef,
        box: 'content-box',
        onResize: onContainerResize,
    })

    useResizeObserver({
        ref: panelRef,
        box: 'content-box',
        onResize: onPanelResize,
    })

    useEffect(() => {
        const { width, height } = containerSize;
        if (!width || !height) return;
        switch (true) {
            case ( width <= ( 512 + 24 ) ):
                devices["tablet"].disabled = true;
                devices["desktop"].disabled = true;
                break;
            case ( width > ( 512 + 24 ) && width <= ( 768 + 24 ) ):
                devices["tablet"].disabled = false;
                devices["desktop"].disabled = true;
                break;
            case ( width > ( 768 + 24 ) ):
                devices["tablet"].disabled = false;
                devices["desktop"].disabled = false;
            default:
                break;
        }
    }, [containerSize])

    const resetLayout = (layout: number[]) => {
        const panelGroup = panelGroupRef.current;
        if (!panelGroup) return;
        panelGroup.setLayout(layout)
    }

    const handleClick = (device: Exclude<Device["name"], undefined>) => {
        const layout = devices[device].layout || [0,100,0];
        resetLayout(layout);
        setDevice(device);
    }

    return (
        <Card className="bg-dot-grid bg-top">
            <CardHeader className="border-b py-4 px-10 bg-background rounded-t-lg">
                <div className="flex items-center justify-between">
                    <div className="space-x-2">  
                        {Object.keys(devices).map((d) => {
                            const { name, icon, disabled } = devices[d];
                            return (
                                <Button 
                                    key={name}
                                    size="icon"
                                    variant={device === name ? "default" : "outline"}
                                    onClick={() => handleClick(name!)}
                                    disabled={disabled}
                                >
                                    {icon}
                                </Button>
                            )
                        })}
                    </div>
                    <div>
                        <p>{panelSize.width} x {panelSize.height}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent 
                ref={previewContainerRef}
                className="py-8 h-[600px] bg-foreground/5"
            >
                <PanelGroup
                    ref={panelGroupRef}
                    direction="horizontal"
                    className="items-center"
                    onLayout = {() => setDevice(undefined)}
                >
                    <Panel defaultSize={0} />
                    <PanelResizeHandle 
                        className="w-1.5 h-8 mr-1.5 my-auto 
                        bg-muted-foreground rounded-full" 
                    />
                    <Panel defaultSize={100} className="min-w-96">
                        <div 
                            ref={panelRef} 
                            className="max-h-[500px] flex flex-col justify-center 
                            overflow-auto bg-[url('/dot-grid.svg')] bg-center"
                        >
                            <div 
                                className="@container grow border rounded-md 
                                bg-background max-h-full overflow-auto"
                            >
                                {children}
                            </div>
                        </div>
                    </Panel>
                    <PanelResizeHandle 
                        className="w-1.5 h-8 ml-1.5 my-auto 
                        bg-muted-foreground rounded-full" 
                    />
                    <Panel defaultSize={0} />
                </PanelGroup>
            </CardContent>
        </Card>
    )
}