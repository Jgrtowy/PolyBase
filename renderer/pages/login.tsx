import { useSession } from "@/components/providers/SessionProvider";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/InputOTP";
import { toast } from "@/components/ui/UseToast";
import supabase from "@/lib/utils/supabase";
import { faDiscord, faGithub, faGitlab, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import type { Provider } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function login() {
    const signInWithProvider = async (provider: Provider) => {
        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: process.env.NODE_ENV !== "production" ? "http://localhost:8888/home" : "app://.home/",
            },
        });
    };
    const [otpForm, setOtpForm] = useState(false);
    const FormSchema = z.object({
        email: z.string().min(1, { message: "This field has to be filled." }).email("This is not a valid email."),
    });

    const OtpFormSchema = z.object({
        otp: z.string().min(6, {
            message: "Your one-time password must be 6 characters.",
        }),
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
        },
    });

    const otpFormHandler = useForm<z.infer<typeof OtpFormSchema>>({
        resolver: zodResolver(OtpFormSchema),
        defaultValues: {
            otp: "",
        },
    });

    const [email, setEmail] = useState("");
    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        setEmail(data.email);
        await supabase.auth.signInWithOtp({ email: data.email });
        setOtpForm(true);
        toast({
            title: "Magic link sent!",
        });
    };

    const router = useRouter();

    const onSubmitOtp = async (data: z.infer<typeof OtpFormSchema>) => {
        const { error } = await supabase.auth.verifyOtp({ email, token: data.otp, type: "email", options: { redirectTo: "http://localhost:8888/home" } });
        if (error) {
            toast({
                title: "Invalid OTP",
                description: "The OTP you entered is invalid.",
            });
            return;
        }
        toast({
            title: "Signed in!",
        });
        router.push("/home");
    };

    return (
        <div className="dark flex justify-center items-center">
            <Card>
                <CardHeader>
                    <CardTitle>Sign in to Polybase</CardTitle>
                    <CardDescription>
                        Sync all of your databases to other devices you own.
                        <br />
                        Don't worry, your password won't be stored anywhere.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2 flex-col">
                    <div className="grid grid-cols-2 gap-3">
                        <Button onClick={() => signInWithProvider("github")} className="gap-2" type="button" variant="outline">
                            <FontAwesomeIcon icon={faGithub} className="h-5" />
                            Login with GitHub
                        </Button>
                        <Button onClick={() => signInWithProvider("discord")} className="gap-2" type="button" variant="outline">
                            <FontAwesomeIcon icon={faDiscord} className="h-5" />
                            Login with Discord
                        </Button>
                        <Button onClick={() => signInWithProvider("google")} className="gap-2" type="button" variant="outline">
                            <FontAwesomeIcon icon={faGoogle} className="h-5" />
                            Login with Google
                        </Button>
                        <Button onClick={() => signInWithProvider("gitlab")} className="gap-2" type="button" variant="outline">
                            <FontAwesomeIcon icon={faGitlab} className="h-5" />
                            Login with GitLab
                        </Button>
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                        <div className="h-px bg-gray-500 w-full" />
                        <div className="text-gray-500">or</div>
                        <div className="h-px bg-gray-500 w-full" />
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <FontAwesomeIcon icon={faEnvelope} className="h-5" />
                                Send me a one time password
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Sign in with One time password</DialogTitle>
                            </DialogHeader>
                            <DialogDescription>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>E-mail</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Your e-mail goes here" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit">Submit</Button>
                                    </form>
                                </Form>
                            </DialogDescription>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={otpForm} onOpenChange={setOtpForm}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Input your OTP</DialogTitle>
                            </DialogHeader>
                            <DialogDescription>
                                <Form {...otpFormHandler}>
                                    <form onSubmit={otpFormHandler.handleSubmit(onSubmitOtp)} className="w-2/3 space-y-6">
                                        <FormField
                                            control={otpFormHandler.control}
                                            name="otp"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>One-Time Password</FormLabel>
                                                    <FormControl>
                                                        <InputOTP maxLength={6} {...field}>
                                                            <InputOTPGroup>
                                                                <InputOTPSlot index={0} />
                                                                <InputOTPSlot index={1} />
                                                                <InputOTPSlot index={2} />
                                                                <InputOTPSlot index={3} />
                                                                <InputOTPSlot index={4} />
                                                                <InputOTPSlot index={5} />
                                                            </InputOTPGroup>
                                                        </InputOTP>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit">Submit</Button>
                                    </form>
                                </Form>
                            </DialogDescription>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </div>
    );
}
