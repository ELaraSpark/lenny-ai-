
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  Calendar, 
  Heart, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle,
  X 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import useAuthStore from "@/stores/authStore"; // Import the Zustand store

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  createdAt: string; 
  type: "message" | "meeting" | "medical" | "system";
  read: boolean;
}

const NotificationsView = () => {
  const { user } = useAuthStore(); // Use Zustand store
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock notifications data for now - will be replaced with Supabase data
  const mockNotifications: Notification[] = [
    {
      id: "1",
      title: "New patient referral",
      description: "Dr. Johnson shared a patient case with you",
      time: "10 minutes ago",
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      type: "medical",
      read: false
    },
    {
      id: "2",
      title: "Meeting reminder",
      description: "Weekly department meeting in 30 minutes",
      time: "30 minutes ago",
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      type: "meeting",
      read: false
    },
    {
      id: "3",
      title: "Message from Dr. Lee",
      description: "I've reviewed the patient's ECG results and have some concerns.",
      time: "2 hours ago",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      type: "message",
      read: true
    },
    {
      id: "4",
      title: "System update",
      description: "The system will be down for maintenance tonight from 2AM to 4AM.",
      time: "Yesterday",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      type: "system",
      read: true
    },
    {
      id: "5",
      title: "New AI insight available",
      description: "LENY-AI has detected a potential pattern in your patient's symptoms.",
      time: "2 days ago",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      type: "medical",
      read: true
    }
  ];

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        // Check if user is authenticated
        if (!user) {
          setNotifications([]);
          setLoading(false);
          return;
        }

        // TODO: Replace with actual Supabase query when notifications table is set up
        // For now, use mock data
        setNotifications(mockNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast({
          title: "Error",
          description: "Failed to load notifications. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user, toast]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "medical":
        return <Heart className="h-5 w-5 text-medical-red" />;
      case "meeting":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "message":
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case "system":
      default:
        return <Bell className="h-5 w-5 text-amber-500" />;
    }
  };

  const markAsRead = async (id: string) => {
    // Update local state immediately for responsive UI
    setNotifications(
      notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );

    // TODO: Update in Supabase when notifications table is set up
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    });
  };

  const markAllAsRead = async () => {
    // Update local state immediately for responsive UI
    setNotifications(
      notifications.map(notification => ({ ...notification, read: true }))
    );

    // TODO: Update in Supabase when notifications table is set up
    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read.",
    });
  };

  const deleteNotification = async (id: string) => {
    // Update local state immediately for responsive UI
    setNotifications(
      notifications.filter(notification => notification.id !== id)
    );

    // TODO: Delete from Supabase when notifications table is set up
    toast({
      title: "Notification deleted",
      description: "The notification has been deleted.",
    });
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    return notification.type === activeTab;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between"
        >
          <h1 className="text-3xl font-bold">Notifications</h1>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                onClick={markAllAsRead}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Mark All as Read
              </Button>
            )}
          </div>
        </motion.div>
        <motion.p 
          className="text-muted-foreground"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Stay updated with patient cases, messages, and system updates
        </motion.p>
      </header>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 md:w-[600px]">
          <TabsTrigger value="all">
            All
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-aida-100 text-aida-800">{unreadCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="message">Messages</TabsTrigger>
          <TabsTrigger value="meeting">Meetings</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="py-6">
                <p className="text-center text-muted-foreground">Loading notifications...</p>
              </CardContent>
            </Card>
          ) : filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {filteredNotifications.map(notification => (
                <Card key={notification.id} className={notification.read ? "" : "bg-aida-50/40"}>
                  <div className="flex p-6">
                    <div className="mr-4 mt-0.5 h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{notification.title}</h3>
                          {!notification.read && (
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">New</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="sr-only">Mark as read</span>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <X className="h-4 w-4 text-muted-foreground" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 flex flex-col items-center justify-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-1">No notifications</p>
                <p className="text-muted-foreground text-center max-w-md">
                  {activeTab === "all" 
                    ? "You don't have any notifications yet. When you get notifications, they'll appear here."
                    : `You don't have any ${activeTab === "unread" ? "unread" : activeTab} notifications.`
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsView;
