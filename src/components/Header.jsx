import React from "react";
import { Link } from "react-router-dom";

import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";

const loggedInUser = { username: "baba" };

function Header() {
  return (
    <header className="bg-white/5 px-4 flex justify-between items-center h-14">
      <div>
        <Link className="text-primary uppercase font-bold text-xl" to="/">
          Logo
        </Link>
      </div>
      <nav>
        <ul className="flex gap-2">
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <Link to="/task">Tasks</Link>
          </li>
        </ul>
      </nav>

      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-8 w-8">
              <AvatarImage src={loggedInUser.imgUrl} />
              <AvatarFallback>
                {loggedInUser.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ModeToggle />
      </div>
    </header>
  );
}

export default Header;
