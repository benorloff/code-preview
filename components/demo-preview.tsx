"use client"

import { useEffect, useRef, useState } from "react";

import { useResizeObserver } from "usehooks-ts";
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
import { cn } from "@/lib/utils";

type Layout = [number, number, number];

interface Size {
    width?: number;
    height?: number;
}

interface Device {
    name: "desktop" | "tablet" | "smartphone" | undefined;
    size: Size;
    layout: Layout;
    icon: React.ReactNode;
    disabled: boolean;
}

const devices: {[key: string]: Device} = {
    desktop: {
        name: "desktop",
        size: { width: 1024 },
        layout: [0,100,0],
        icon: <Laptop className="h-4 w-4" />,
        disabled: false,
    },
    tablet: {
        name: "tablet",
        size: { width: 768 },
        layout: [20,60,20],
        icon: <Tablet className="h-4 w-4" />,
        disabled: false,
    },
    smartphone: {
        name: "smartphone",
        size: { width: 384 },
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
    
    useResizeObserver({
        ref: previewContainerRef,
        box: 'content-box',
        onResize: setContainerSize,
    })

    useResizeObserver({
        ref: panelRef,
        box: 'content-box',
        onResize: setPanelSize,
    })

    const calculateLayouts = (containerWidth: number) => {
        type Width = Size["width"];
        const smartphonePanel: Width = devices["smartphone"].size.width! / containerWidth * 100;
        const tabletPanel: Width = devices["tablet"].size.width! / containerWidth * 100
        const smartphoneLayout: Layout = [
            (100 - smartphonePanel) / 2,
            smartphonePanel,
            (100 - smartphonePanel) / 2,
        ];
        const tabletLayout: Layout = [
            (100 - tabletPanel) / 2,
            tabletPanel,
            (100 - tabletPanel) / 2,
        ];
        devices["smartphone"].layout = smartphoneLayout;
        devices["tablet"].layout = tabletLayout;
    }

    useEffect(() => {
        const { width, height } = containerSize;
        if (!width || !height) return;
        setDevice(undefined);
        calculateLayouts(width);
        switch (true) {
            case ( width <= ( 768 + 24 ) ):
                devices["tablet"].disabled = true;
                devices["desktop"].disabled = true;
                break;
            case ( width > ( 768 + 24 ) && width <= ( 1024 + 24 ) ):
                devices["tablet"].disabled = false;
                devices["desktop"].disabled = true;
                break;
            case ( width > ( 1024 + 24 ) ):
                devices["tablet"].disabled = false;
                devices["desktop"].disabled = false;
            default:
                break;
        }
    }, [containerSize])

    const resetLayout = (layout: Layout) => {
        const panelGroup = panelGroupRef.current;
        if (!panelGroup) return;
        panelGroup.setLayout(layout)
    }

    const handleClick = (device: Exclude<Device["name"], undefined>) => {
        const layout = devices[device].layout;        
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
                        { ( panelSize.width && panelSize.height ) && (
                            <p>{Math.round(panelSize.width)} x {Math.round(panelSize.height)}</p>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent 
                ref={previewContainerRef}
                className="py-8 h-[600px] bg-foreground/5"
            >
                <PanelGroup
                    id="panel-group"
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
                    <Panel 
                        id="main-panel"
                        defaultSize={100} 
                        className={cn(
                            "min-w-96",
                            device === "tablet" && "min-w-[770px]",
                        )}
                    >
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