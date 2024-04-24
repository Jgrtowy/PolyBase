import type { IUser } from "@/types";
import { LogOut, Maximize, Maximize2, Minus, Moon, RectangleHorizontal, Square, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import type React from "react";
import { useEffect, useState } from "react";
import { useSession } from "./providers/SessionProvider";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { Button } from "./ui/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/Dropdown";
import { Label } from "./ui/Label";
import sendIpcSignal from "./utils/sendIpcSignal";
import supabase from "./utils/supabase";

export default function Header() {
    const quit = (action: string) => {
        sendIpcSignal("window", action);
    };

    const session = useSession();
    const [user, setUser] = useState<IUser>();

    useEffect(() => {
        setUser(session.session?.user.user_metadata as IUser);
    }, [session]);
    const { setTheme } = useTheme();
    return (
        <div className="w-screen flex justify-end gap-3">
            <div style={{ WebkitAppRegion: "drag" } as React.CSSProperties} className="w-full" />
            {user && (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button className="flex items-center gap-2 h-8" variant="ghost">
                            <Label className="text-lg hover:cursor-pointer">Hello, {user.preferred_username ?? user.full_name}</Label>
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={user.avatar_url} alt="avatar" />
                                <AvatarFallback>{user.preferred_username ? user.preferred_username[0] : user.full_name[0]}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="border-0 dark:bg-[#121212] bg-white shadow-none p-0">
                        <DropdownMenuLabel className="m-0 p-0">
                            <Button variant="ghost" onClick={() => supabase.auth.signOut()} className="w-full hover:text-red-500 text-red-500 m-0 text-lg gap-2">
                                <LogOut />
                                Logout
                            </Button>
                        </DropdownMenuLabel>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-0 p-0 dark:bg-[#121212] bg-white shadow-none">
                    <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex">
                <Button variant="ghost" size="icon" className="flex justify-center items-center rounded-none" onClick={() => quit("minimize")}>
                    <Minus strokeWidth="3" className="h-[1.2rem] w-[1.2rem]" />
                </Button>
                <Button variant="ghost" size="icon" className="flex justify-center items-center rounded-none" onClick={() => quit("maximize")}>
                    <Square strokeWidth="3" className="h-[1rem] w-[1rem]" />
                </Button>
                <Button variant="ghost" size="icon" className="flex justify-center items-center rounded-none hover:bg-red-500" onClick={() => quit("quit")}>
                    <X strokeWidth="3" className="h-[1.2rem] w-[1.2rem]" />
                </Button>
            </div>
        </div>
    );
}
