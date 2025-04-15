import { motion } from "framer-motion";
import { User, Award, Heart, BookOpen, Briefcase, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PublicLayout from "@/components/layout/PublicLayout";

const teamMembers = [
  {
    name: "Dr. Sarah Johnson",
    role: "Chief Medical Officer",
    bio: "With over 15 years of experience in internal medicine and digital health innovation, Dr. Johnson leads our medical strategy and ensures all AI implementations maintain the highest clinical standards.",
    image: "/placeholder.svg"
  },
  {
    name: "Michael Chen",
    role: "Chief Technology Officer",
    bio: "Former senior AI researcher at Google Health, Michael brings expertise in machine learning and healthcare data systems to drive our technological advancement.",
    image: "/placeholder.svg"
  },
  {
    name: "Dr. James Wilson",
    role: "Medical Director",
    bio: "Board-certified cardiologist with a passion for making specialized medical knowledge more accessible through technology.",
    image: "/placeholder.svg"
  },
  {
    name: "Dr. Amara Patel",
    role: "Head of Research",
    bio: "Leading our clinical validation studies and partnerships with academic medical centers to continuously improve our AI models.",
    image: "/placeholder.svg"
  }
];

const values = [
  {
    title: "Patient-Centered Care",
    description: "We design every feature with the ultimate goal of improving patient outcomes and experience.",
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    title: "Evidence-Based Practice",
    description: "Our AI recommendations are built on the latest medical research and clinical guidelines.",
    icon: BookOpen,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    title: "Clinical Excellence",
    description: "We maintain the highest standards in medical accuracy and safety throughout our platform.",
    icon: Award,
    color: "text-amber-500",
    bgColor: "bg-amber-50",
  },
  {
    title: "Ethical Innovation",
    description: "We advance healthcare technology with strong ethical principles and data privacy at the forefront.",
    icon: Briefcase,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    title: "Global Accessibility",
    description: "We strive to make quality healthcare insights available to practitioners worldwide.",
    icon: Globe,
    color: "text-green-500",
    bgColor: "bg-green-50",
  }
];

const AboutUs = () => {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h1 className="h1 mb-4">About LENY-AI Health</h1>
          <p className="p-large max-w-2xl mx-auto">
            We're on a mission to transform healthcare through intelligent AI, 
            making specialized medical knowledge more accessible and enhancing 
            the practice of medicine through advanced technology.
          </p>
        </motion.div>

        {/* Our Story Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-20"
        >
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-4xl mx-auto">
            <h2 className="h2 mb-6 text-center">Our Story</h2>
            <p className="mb-4">
              LENY-AI Health was founded in 2021 by a team of physicians and AI researchers who recognized 
              the potential for artificial intelligence to address key challenges in healthcare delivery.
            </p>
            <p className="mb-4">
              Starting with a vision to improve diagnostic accuracy and patient follow-up, our team built 
              a prototype system that could analyze patient presentations and suggest relevant follow-up questions 
              to healthcare providers based on the latest medical literature.
            </p>
            <p className="mb-4">
              Since then, we've expanded our platform to include specialized AI medical agents, collaborative 
              tools for healthcare teams, and comprehensive patient management features - all designed to augment 
              the work of healthcare professionals rather than replace the human element essential to quality care.
            </p>
            <p>
              Today, LENY-AI is used by thousands of healthcare providers across multiple specialties, 
              helping them deliver more effective, evidence-based care to their patients.
            </p>
          </div>
        </motion.section>

        {/* Our Values */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-20"
        >
          <h2 className="h2 mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index + 0.4 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className={`${value.bgColor} p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4`}>
                      <value.icon className={`${value.color} h-6 w-6`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-10"
        >
          <h2 className="h2 mb-8 text-center">Our Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index + 0.5 }}
              >
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 bg-gray-100 flex items-center justify-center p-6">
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-12 w-12 text-gray-400" />
                      </div>
                    </div>
                    <CardContent className="md:w-2/3 p-6">
                      <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                      <p className="text-aida-500 font-medium mb-3">{member.role}</p>
                      <p className="text-muted-foreground text-sm">{member.bio}</p>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-16"
        >
          <Separator className="mb-10" />
          <h2 className="h3 mb-6">Join Us in Transforming Healthcare</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals passionate about healthcare and technology.
            Check out our careers page or get in touch to learn more.
          </p>
        </motion.div>
      </div>
    </PublicLayout>
  );
};

export default AboutUs;
