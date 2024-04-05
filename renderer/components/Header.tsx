import React from "react";
import type { IUser } from "../pages/home";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { Button } from "./ui/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/Dropdown";
import { Label } from "./ui/Label";
import supabase from "./utils/supabase";

export default function Header({ user }: { user: IUser }) {
    return (
        <div className="w-screen flex justify-end">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button className="border-white py-6 m-3 flex items-center gap-2" variant="outline">
                        <Label className="text-lg hover:cursor-pointer">Hello, {user.preferred_username ?? user.full_name}</Label>
                        <Avatar>
                            <AvatarImage src={user.avatar_url} alt="avatar" />
                            <AvatarFallback>{user.preferred_username ? user.preferred_username[0] : user.full_name[0]}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border">
                    <DropdownMenuLabel onClick={() => supabase.auth.signOut()} className="hover:cursor-pointer text-red-400">
                        Logout
                    </DropdownMenuLabel>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
