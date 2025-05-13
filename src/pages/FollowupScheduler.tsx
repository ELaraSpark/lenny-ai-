
import PublicLayout from "@/components/layout/PublicLayout";
import FollowupSchedulerView from "@/components/followup/FollowupSchedulerView";
import { useState, useEffect } from "react";

const FollowupScheduler = () => {
  // Loading state to prevent the spinner from showing repeatedly
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Mark as loaded after initial render
    setIsLoading(false);
  }, []);
  
  return (
    <PublicLayout showHeader={true} showFooter={false}>
      <FollowupSchedulerView />
    </PublicLayout>
  );
};

export default FollowupScheduler;
