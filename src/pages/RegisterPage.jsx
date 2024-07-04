/* eslint-disable no-unused-vars */

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
import { useState } from "react";
import api from "@/services/api.service";

function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      setLoading(true);
      const newUser = {
        username: formData.username,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        firstName: formData.firstName,
        lastName: formData.lastName,
      };
      await api.post(`auth/register`, newUser);
      navigate('/auth/login')
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError("User already exists. Please choose a different username.");
      } else {
        setError("An error occurred during registration. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Card className="shadow-2xl min-w-96">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Register</span> <LogIn />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <Label>Username:</Label>
            <Input 
              placeholder="Enter username..." 
              name="username"
              value={formData.username}
              onChange={handleChange}/>
          </div>
          <div>
            <Label>Password:</Label>
            <Input type="password" 
              placeholder="Enter password..." 
              name="password"
              value={formData.password}
              onChange={handleChange}/>
          </div>
          <div>
            <Label>Password:</Label>
            <Input type="password" 
              placeholder="Enter password again..." 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}/>
          </div>
          <div>
            <Label>First name:</Label>
            <Input 
              placeholder="Enter first name..." 
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}/>
          </div>
          <div>
            <Label>Last name:</Label>
            <Input 
              placeholder="Enter last name..." 
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}/>
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
