
import { useState, useEffect } from "react";
import { Bell, Heart, Calendar, MessageSquare, X, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Mock notification data
const initialNotifications = [
  {
    id: 1,
    title: "New patient referral",
    description: "Dr. Johnson shared a patient case with you",
    time: "10 minutes ago",
    unread: true,
    icon: <Heart className="h-4 w-4 text-medical-red" />,
  },
  {
    id: 2,
    title: "Meeting reminder",
    description: "Weekly department meeting in 30 minutes",
    time: "30 minutes ago",
    unread: true,
    icon: <Calendar className="h-4 w-4 text-blue-500" />,
  },
  {
    id: 3,
    title: "Message from Dr. Lee",
    description: "I've reviewed the patient's ECG results and...",
    time: "2 hours ago",
    unread: false,
    icon: <MessageSquare className="h-4 w-4 text-green-500" />,
  },
  {
    id: 4,
    title: "System update",
    description: "The system will be down for maintenance tonight",
    time: "Yesterday",
    unread: false,
    icon: <Bell className="h-4 w-4 text-amber-500" />,
  },
];

// Event bus for real-time notifications
export const notificationEvents = {
  listeners: new Set<(notification: any) => void>(),
  
  subscribe(callback: (notification: any) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  },
  
  publish(notification: any) {
    this.listeners.forEach(callback => callback(notification));
  }
};

// Function to add a new follow-up call notification
export const addFollowUpNotification = (data: {
  title: string;
  description: string;
  icon?: JSX.Element;
}) => {
  const notification = {
    id: Date.now(),
    title: data.title,
    description: data.description,
    time: "Just now",
    unread: true,
    icon: data.icon || <Phone className="h-4 w-4 text-blue-500" />,
  };
  
  notificationEvents.publish(notification);
};

export const NotificationsList = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userNotifications, setUserNotifications] = useState(initialNotifications);
  const unreadCount = userNotifications.filter(n => n.unread).length;

  // Subscribe to notification events
  useEffect(() => {
    const unsubscribe = notificationEvents.subscribe((notification) => {
      setUserNotifications(prev => [notification, ...prev]);
    });
    
    return unsubscribe;
  }, []);

  const markAsRead = (id: number) => {
    setUserNotifications(userNotifications.map(notification => 
      notification.id === id ? { ...notification, unread: false } : notification
    ));
  };

  const markAllAsRead = () => {
    setUserNotifications(userNotifications.map(notification => ({ ...notification, unread: false })));
    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read successfully."
    });
  };

  const dismissNotification = (id: number) => {
    setUserNotifications(userNotifications.filter(notification => notification.id !== id));
    toast({
      title: "Notification dismissed",
      description: "The notification has been removed from your list."
    });
  };

  const viewAllNotifications = () => {
    navigate("/notifications");
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium text-sm">Notifications</h3>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-7">
            Mark all as read
          </Button>
        )}
      </div>
      <div className="max-h-80 overflow-y-auto">
        {userNotifications.length > 0 ? (
          <div className="divide-y">
            {userNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={cn(
                  "p-4 relative hover:bg-muted",
                  notification.unread && "bg-muted/50"
                )}
              >
                <div className="flex gap-3">
                  <div className="mt-1 h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                    {notification.icon}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-medium">
                        {notification.title}
                        {notification.unread && (
                          <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700">New</Badge>
                        )}
                      </h4>
                      <button 
                        onClick={() => dismissNotification(notification.id)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X size={12} />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {notification.description}
                    </p>
                    <p className="text-xs text-muted-foreground pt-1">
                      {notification.time}
                    </p>
                  </div>
                </div>
                {notification.unread && (
                  <button 
                    onClick={() => markAsRead(notification.id)}
                    className="absolute inset-0 w-full h-full cursor-default"
                    aria-label="Mark as read"
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No notifications</p>
          </div>
        )}
      </div>
      <div className="p-4 border-t text-center">
        <Button variant="ghost" size="sm" className="text-xs w-full" onClick={viewAllNotifications}>
          View all notifications
        </Button>
      </div>
    </>
  );
};

export default NotificationsList;
