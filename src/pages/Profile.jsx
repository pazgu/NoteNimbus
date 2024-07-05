/* eslint-disable react/no-unescaped-entities */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import api from "@/services/api.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function ProfilePage() {
  const { loggedInUser } = useContext(AuthContext);
  const userId = loggedInUser.userId;
  const [userDetails, setUserDetails] = useState(null);
  
  async function getUserDetails () {
    try {
        const response = await api.get(`/users/${userId}`);
        setUserDetails(response.data);
    } catch (error) {
        console.error(error);
    }
  }

  useEffect(() => {
    getUserDetails();
  }, [userDetails])

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="shadow-2xl w-full md:w-2/3 lg:w-1/2 xl:w-1/3">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Profile</span> <User />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-20 w-20">
              <AvatarImage src={userDetails?.imgUrl} />
              <AvatarFallback>
                {userDetails?.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold">{userDetails?.firstName} {userDetails?.lastName}</h2>
            <p className="text-sm text-gray-600">{userDetails?.username}@gmail.com</p>
            <div className="flex space-x-2">
              <Button className="flex-1">Edit Profile</Button>
              <Button className="flex-1">Change Password</Button>
            </div>
            <div className="w-full mt-4 p-4 bg-gray-400 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Bio</h3>
              <p className="text-sm text-gray-600">👋 Hello! I'm a demo user exploring this awesome app. Tech enthusiast, learner, and always curious about new things.</p>
            </div>
          </div>
        </CardContent>
        <div className="flex items-center justify-center p-4">
          <Link to="/auth/login" className="text-xs text-red-600 hover:text-red-800">Logout</Link>
        </div>
      </Card>
    </div>
  );
}

export default ProfilePage;