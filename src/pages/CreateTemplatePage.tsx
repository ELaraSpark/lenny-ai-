import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const CreateTemplatePage = () => {
  const navigate = useNavigate();

  // TODO: Implement actual form for template creation

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Button variant="ghost" onClick={() => navigate('/my-templates')} className="mb-4 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to My Templates
      </Button>
      <h1 className="text-2xl font-semibold text-foreground mb-4">Create New Template</h1>
      <p className="text-muted-foreground">
        Template creation form will go here.
      </p>
      {/* Placeholder for form elements */}
    </div>
  );
};

export default CreateTemplatePage;
