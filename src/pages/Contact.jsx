
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

function ContactPage() {
  const { toast } = useToast();
  const handleSubmit = async (event) => {
    event.preventDefault();
    toast({
        title: "Success!",
        description: "Your message has been sent.",
        status: "success",
      });
  }  
  return (
    <div className="flex items-center justify-center min-h-screen py-8 bg-gray-100 dark:bg-gray-900">
      <Card className="shadow-2xl w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label>Name</Label>
              <Input type="text" placeholder="Enter your name..." required />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="Enter your email..." required />
            </div>
            <div>
              <Label>Subject</Label>
              <Input type="text" placeholder="Enter subject..." required />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea placeholder="Enter your message..." required />
            </div>
            <Button className="w-full mt-4">Send Message</Button>
          </form>
          <Toaster />
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center text-gray-700 dark:text-gray-300">We will get back to you within 24-48 hours.</p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ContactPage;