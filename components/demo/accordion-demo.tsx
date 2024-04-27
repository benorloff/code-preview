"use client"

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { 
    Accordion, 
    AccordionContent, 
    AccordionItem, 
    AccordionTrigger 
} from "@/components/ui/accordion";

const ContentAccordionDemo = () => {
    const [active, setActive] = useState<number | null>(1);

    return (
        <div className="@container grid grid-cols-3 grid-rows-2 @3xl:grid-rows-1 items-stretch bg-background">
            <div className="relative h-auto w-auto col-span-3 @3xl:col-span-2">
                {[1, 2, 3].map((n) => (
                    <Image
                        key={n}
                        src={`/unsplash-abstract-${n}.jpeg`}
                        alt="placeholder"
                        fill
                        className={cn(
                            active === n ? "opacity-100" : "opacity-0",
                            "absolute inset-0 object-cover transition-opacity duration-500 ease-in-out",
                        )}
                    />
                ))}
            </div>
            <div className="col-span-3 @3xl:col-span-1">
                <Accordion 
                    type="single" 
                    defaultValue="1" 
                    className="flex flex-col items-stretch h-full border-t border-x"
                >
                    {[1, 2, 3].map((n) => (
                        <AccordionItem 
                            key={n}
                            value={n.toString()}
                            className={cn(
                                "relative grow flex flex-col justify-center text-lg group", 
                                "before:content[''] before:w-[2px] before:absolute before:top-0 before:left-0", 
                                "before:bg-foreground before:transition-all before:ease-in-out before:duration-500 ",
                                active === n 
                                    ? "before:h-full before:opacity-100"
                                    : "before:h-0 before:opacity-0"
                            )}
                        >
                            <AccordionTrigger
                                onClick={() => setActive(n)}
                                className="text-muted-foreground data-[state=open]:text-foreground p-6 
                                group-hover:text-foreground !no-underline transition-colors ease-in-out duration-500"
                            >
                                Accordion {n}
                            </AccordionTrigger>
                            <AccordionContent
                                className="p-6 pt-0"
                            >
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    )
}

export default ContentAccordionDemo;