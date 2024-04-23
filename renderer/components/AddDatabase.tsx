import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Plus } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSession } from "./providers/SessionProvider";
import { Button } from "./ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "./ui/Dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/Form";
import { Input } from "./ui/Input";
import { toast } from "./ui/UseToast";
import supabase from "./utils/supabase";

const ColorPicker = ({ onChange, value }: { onChange: (color: string) => void; value: string | null }) => {
    const colors = ["bg-orange-600", "bg-green-600", "bg-blue-600", "bg-purple-600", "bg-pink-600"];

    return colors.map((color) => (
        <Button type="button" key={color} className={`${color} w-8 h-8 rounded-full hover:cursor-pointer flex items-center justify-center`} onClick={() => onChange(color)}>
            {color === value ? <Check className="min-w-4 min-h-4 " /> : null}
        </Button>
    ));
};

export default function AddDatabase() {
    const session = useSession();

    const FormSchema = z.object({
        connectionString: z
            .string()
            .min(1, {
                message: "This field has to be filled.",
            })
            .regex(/^[^:/?#\s]+:\/\/([^:]+)(?::)([^@]+)?@([^:/]+)/),
        customName: z.string().optional(),
        accentColor: z.string().nullable().optional(),
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            connectionString: "",
            customName: "",
            accentColor: null,
        },
    });

    const [dialogOpen, setDialogOpen] = useState(false);
    const router = useRouter();
    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        const dialect = data.connectionString.split(":" || "+")[0];

        const { error } = await supabase.from("connections").insert({
            dialect,
            connection_string: data.connectionString,
            user_id: session.session?.user.id,
            name: data.customName === "" ? null : data.customName,
            accent_color: data.accentColor,
        });

        if (error) {
            toast({
                title: "Error",
                description: "An error occurred while adding the database. Please try again later.",
            });
            return;
        }

        toast({
            title: "Success",
            description: "Database added successfully.",
        });
        setDialogOpen(false);
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
                <Button variant="outline" className="dark:border-white flex items-center gap-2">
                    <Plus />
                    Add Database
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>Add database</DialogHeader>
                <DialogDescription>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                            <FormField
                                control={form.control}
                                name="connectionString"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Connection String</FormLabel>
                                        <FormControl>
                                            <Input placeholder="for example mysql://..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="customName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Custom name (optional)</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="accentColor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Accent Color</FormLabel>
                                        <FormControl>
                                            <div className="flex gap-2">
                                                <ColorPicker onChange={(value: string) => field.onChange(value)} value={field.value ?? null} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" variant="outline">
                                Submit
                            </Button>
                        </form>
                    </Form>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
}
