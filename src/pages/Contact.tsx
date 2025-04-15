import React from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, MessageSquare } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import PublicLayout from "@/components/layout/PublicLayout";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

const ContactInfoCard = ({ icon: Icon, title, content, link = "" }) => (
  <Card className="h-full">
    <CardContent className="flex flex-col items-center text-center p-6">
      <div className="w-12 h-12 rounded-full bg-aida-50 flex items-center justify-center mb-4">
        <Icon className="h-5 w-5 text-aida-500" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {link ? (
        <a href={link} className="text-muted-foreground hover:text-aida-500 transition-colors">
          {content}
        </a>
      ) : (
        <p className="text-muted-foreground">{content}</p>
      )}
    </CardContent>
  </Card>
);

const Contact = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Message Sent",
      description: "Thank you for your message. We will respond shortly.",
    });
    form.reset();
  }

  return (
    <PublicLayout showFooter={false}>
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions or need more information about LENY-AI? Our team is here to help.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ContactInfoCard
              icon={Mail}
              title="Email"
              content="contact@leny-ai.com"
              link="mailto:contact@leny-ai.com"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ContactInfoCard
              icon={Phone}
              title="Phone"
              content="+1 (555) 123-4567"
              link="tel:+15551234567"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ContactInfoCard
              icon={MapPin}
              title="Office"
              content="123 Medical Center Dr, San Francisco, CA 94107"
            />
          </motion.div>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="How can we help?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please provide details about your inquiry..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full md:w-auto">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>

      <footer className="bg-gray-50 py-8 mt-16">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} LENY-AI Health Technologies. All rights reserved.
          </p>
        </div>
      </footer>
    </PublicLayout>
  );
};

export default Contact;
