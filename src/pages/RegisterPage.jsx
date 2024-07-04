
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";

function RegisterPage() {
  return (
    <Card className="shadow-2xl min-w-96">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Register</span> <LogIn />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4">
          <div>
            <Label>Username:</Label>
            <Input placeholder="Enter username..." />
          </div>
          <div>
            <Label>Password:</Label>
            <Input type="password" placeholder="Enter password..." />
          </div>
          <div>
            <Label>First name:</Label>
            <Input placeholder="Enter first name..." />
          </div>
          <div>
            <Label>Last name:</Label>
            <Input placeholder="Enter last name..." />
          </div>

          <Button>Register</Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-xs">
          Already have an account?{" "}
          <Link className="underline font-bold" to="/auth/login">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default RegisterPage;
