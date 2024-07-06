/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */

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
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { formatJWTTokenToUser } from "@/utils/utils";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import api from "@/services/api.service";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: ""});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { toast } = useToast();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await api.post("auth/login", formData);
      localStorage.setItem('token', response.data.token); // Store the JWT token
      const { token } = response.data;
      const user = formatJWTTokenToUser(token);
      if (user) {
        login({ ...user, token });
        navigate(`/notes/${user.userId}`);
      } else {
        throw new Error('Invalid token received');
      } 
    } catch (error) {
      console.error("Error during login:", error.message);
      let errorMessage = "An error occurred during login. Please try again.";
      if (error.response && error.response.status === 401) {
        errorMessage = "Authentication failed. Please check your username and password.";
      }
      toast({
        variant: "destructive",
        title: "Authentication failed.",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-2xl min-w-96">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Login</span> <LogIn />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center">
        <form className="flex flex-col gap-4 items-center" onSubmit={handleSubmit}>
          <div className="w-full">
            <Label>Username:</Label>
            <Input placeholder="Enter username..." name="username" value={formData.username} onChange={handleChange} required/>
          </div>
          <div className="w-full">
            <Label>Password:</Label>
            <Input type="password" placeholder="Enter password..."  name="password" value={formData.password} onChange={handleChange} required/>
          </div>

          <Button className="w-full">Login</Button>
        </form>
        <Toaster />
      </CardContent>
      <CardFooter>
        <p className="text-xs">
          Don't have an account?{" "}
          <Link className="underline font-bold" to="/auth/register">
            Register
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default LoginPage;
