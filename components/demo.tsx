import fs from "fs";
import path from "path";
import { lazy, useMemo } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import { DemoCode } from "@/components/demo-code";
import { DemoPreview } from "@/components/demo-preview";
import { DemoToolbar } from "@/components/demo-toolbar";

interface DemoProps{
    name: string,
}

export const Demo = async ({
    name,
}: DemoProps) => {
    
    const Preview = useMemo(() => {
        const Component = lazy(() => import("@/components/demo/accordion-demo"))

        if (!Component) {
            return (
                <p className="text-muted-foreground">
                    Component{" "}
                    <code className="relative rounded bg-muted p-1 font-mono">
                        {name}
                    </code>{" "}
                    not found.
                </p>
            )
        }

        return <Component />
    }, [name])

    let Code;

    try {
        const src = "components/demo/accordion-demo.tsx"
        const filePath = path.join(process.cwd(), src)
        Code = fs.readFileSync(filePath, "utf8")
    } catch (error) {
        console.error(error)
    }

    return (
        <div className="flex h-full w-full py-10 m-auto items-start justify-start">
            <Tabs defaultValue="preview" className="w-full">
                <div className="flex items-center justify-between gap-4">
                    <TabsList>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                        <TabsTrigger value="code">Code</TabsTrigger>
                    </TabsList>
                    <DemoToolbar copyText={Code || ""} />
                </div>
                <TabsContent value="preview">
                    <DemoPreview>
                        {Preview}
                    </DemoPreview>
                </TabsContent>
                <TabsContent value="code" className="w-full border rounded-md max-h-[500px] overflow-y-auto">
                    <DemoCode
                        title={`${name}.tsx`}
                        lang="tsx"
                        code={Code || "Failed to load code"}
                        lineNumbers={true}
                        className="!my-0"
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
