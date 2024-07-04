/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";

import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Header() {
  const loggedInUser = {username: "baba"}
  const { logout } = useContext(AuthContext);
  return (
    <header className="bg-white/5 px-4 flex justify-between items-center h-14">
    <div className="flex items-center gap-2">
      <Link className="text-primary font-bold text-xl flex items-center" to="/">
        <img className="h-8 w-8 mr-2 rounded-lg" src="src\assets\logo.jpeg" alt="Logo" />
        NoteNimbus
      </Link>
    </div>
      <nav>
        <ul className="flex gap-4">
          <li>
            <Link to="/task">Notes</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
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
            <DropdownMenuLabel>
              <Link>My Account</Link>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {loggedInUser && (
              <DropdownMenuItem onClick={() => logout()}>
                Logout
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <ModeToggle />
      </div>
    </header>
  );
}

export default Header;
