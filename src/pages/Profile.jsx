import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

function ProfilePage() {
  const { loggedInUser } = useContext(AuthContext);
  console.log(loggedInUser);

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
            <img
              className="h-24 w-24 rounded-full object-cover"
              src={loggedInUser.username[0].toUpperCase()} 
              alt="User Avatar"
            />
            <h2 className="text-xl font-semibold">{loggedInUser.firstName} {loggedInUser.lastName}</h2>
            <p className="text-sm text-gray-600">@{loggedInUser.username}</p>
            <div className="flex space-x-2">
              <Button className="flex-1">Edit Profile</Button>
              <Button className="flex-1">Change Password</Button>
            </div>
            <div className="w-full mt-4 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Bio</h3>
              <p className="text-sm text-gray-600">{loggedInUser.bio}</p>
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