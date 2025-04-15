import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Star, Zap, CheckCircle, Sparkles, PartyPopper } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import confetti from 'canvas-confetti';

const Referrals = () => {
  const { toast } = useToast();
  const [isSparkleAnimating, setIsSparkleAnimating] = useState(false);
  const referralCode = "REF123XYZ";
  const referralLink = `https://leny.ai/register?ref=${referralCode}`;
  const creditsEarned = 0;
  const successfulReferrals = 0;
  
  // Trigger confetti effect when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Function to trigger sparkle animation
  const triggerSparkleAnimation = () => {
    setIsSparkleAnimating(true);
    setTimeout(() => setIsSparkleAnimating(false), 1000);
  };

  const rewardTiers = [
    { threshold: 1, reward: "10 Credits", icon: Gift },
    { threshold: 3, reward: "+30 Bonus Credits", icon: Gift },
    { threshold: 5, reward: "Unlock Advanced Summarization", icon: Zap },
    { threshold: 10, reward: "1 Month Pro Plan Free", icon: Star },
  ];

  // Function to show a success message
  const showSuccess = (message: string) => {
    toast({
      title: "Success!",
      description: message,
      duration: 3000,
    });
    
    // Trigger animations
    triggerSparkleAnimation();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });
  };
  
  // Simple copy function
  const copyToClipboard = (text: string, type: string) => {
    // Try to use the clipboard API
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => {
          showSuccess(`${type} copied to clipboard!`);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          alert(`Please copy this ${type} manually: ${text}`);
        });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          showSuccess(`${type} copied to clipboard!`);
        } else {
          alert(`Please copy this ${type} manually: ${text}`);
        }
      } catch (err) {
        console.error('Failed to copy: ', err);
        alert(`Please copy this ${type} manually: ${text}`);
      }
      
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 flex items-center gap-2">
        <span>✨ Rewards & Referrals ✨</span>
        <Sparkles 
          size={28} 
          className={`text-yellow-500 ${isSparkleAnimating ? 'animate-ping' : ''}`} 
        />
      </h1>

      {/* Referral Card */}
      <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 relative"> 
          <div className="flex items-center gap-3 mb-2">
            <PartyPopper size={28} className="text-pink-500" />
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              Invite Friends, Get Amazing Rewards!
            </h2>
          </div>
          <p className="text-base mb-8">
            Share Leny.ai and you both get <span className="font-bold text-pink-500">10 free credits</span> when they sign up!
          </p>
          
          {/* Code Section */}
          <div className="mb-6">
            <p className="text-center text-purple-700 mb-2">Your Magic Code 🪄</p>
            <div className="bg-white/80 rounded-lg p-4 mb-2 text-center">
              <p className="text-xl font-mono font-bold text-purple-700">{referralCode}</p>
            </div>
            <p className="text-xs text-center text-purple-500 mb-2">👇 Click the button below to copy your code 👇</p>
            <button 
              onClick={() => copyToClipboard(referralCode, 'Code')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-4 rounded-lg"
            >
              COPY CODE
            </button>
          </div>
          
          {/* Link Section */}
          <div className="mb-6">
            <p className="text-center text-purple-700 mb-2">Your Magic Link ✨</p>
            <div className="bg-white/80 rounded-lg p-4 mb-2 overflow-auto">
              <p className="text-sm text-purple-700 break-all">{referralLink}</p>
            </div>
            <p className="text-xs text-center text-purple-500 mb-2">👇 Click the button below to copy your link 👇</p>
            <button 
              onClick={() => copyToClipboard(referralLink, 'Link')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-4 rounded-lg"
            >
              COPY LINK
            </button>
          </div>
          
          {/* Share Buttons */}
          <div className="text-center">
            <p className="text-lg font-bold text-purple-700 mb-4">Share the Magic! 🎉</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Check out Leny.ai!',
                      text: `I'm using Leny.ai to streamline my clinical workflow. Sign up with my code ${referralCode} or link and we both get free credits!`,
                      url: referralLink,
                    }).catch(err => {
                      if (err.name !== 'AbortError') {
                        copyToClipboard(referralLink, 'Link');
                      }
                    });
                  } else {
                    copyToClipboard(referralLink, 'Link');
                  }
                }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-full"
              >
                SHARE NOW
              </button>
              
              <button 
                onClick={() => {
                  window.location.href = `mailto:?subject=${encodeURIComponent('Check out Leny.ai! ✨')}&body=${encodeURIComponent(`Hey! I'm using Leny.ai and it's amazing! Sign up with my code ${referralCode} and we both get free credits! 🎉`)}`;
                  triggerSparkleAnimation();
                }}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 px-6 rounded-full"
              >
                EMAIL
              </button>
              
              <button 
                onClick={() => {
                  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Just discovered Leny.ai and it\'s amazing! Join me with my referral code and we both get rewards! ✨')}`, '_blank', 'noopener,noreferrer');
                  triggerSparkleAnimation();
                }}
                className="bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold py-3 px-6 rounded-full"
              >
                TWEET
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Card */}
      <Card className="shadow-lg border-primary/20 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-orange-100 opacity-70"></div>
        
        <CardHeader className="relative z-10">
          <div className="flex items-center gap-2">
            <Sparkles size={24} className="text-yellow-500 animate-pulse" />
            <CardTitle className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-500">
              Your Reward Journey! 🏆
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="relative z-10 space-y-6">
          {/* Progress Display */}
          <div className="bg-white/80 rounded-xl p-4 shadow-md border border-yellow-100 text-center">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-3 rounded-lg">
                <p className="text-3xl font-extrabold text-orange-500">{successfulReferrals}</p>
                <p className="text-sm font-medium text-orange-700">Friends Invited</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-3 rounded-lg">
                <p className="text-3xl font-extrabold text-orange-500">{creditsEarned}</p>
                <p className="text-sm font-medium text-orange-700">Credits Earned</p>
              </div>
            </div>
            
            {/* Milestones */}
            <div className="space-y-3">
              {rewardTiers.map((tier, index) => (
                <div key={index} className={`flex items-center gap-3 p-2 rounded-lg ${successfulReferrals >= tier.threshold ? 'bg-green-50 border border-green-100' : 'bg-white/60'}`}>
                  <div className={`flex h-8 w-8 rounded-full items-center justify-center shrink-0 ${successfulReferrals >= tier.threshold ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-500'}`}>
                    {successfulReferrals >= tier.threshold ? <CheckCircle size={16} /> : <tier.icon size={16} />}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium">{tier.threshold} Friend{tier.threshold > 1 ? 's' : ''}</span>
                    <span className="block text-sm font-bold text-orange-600">{tier.reward}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Referrals;
