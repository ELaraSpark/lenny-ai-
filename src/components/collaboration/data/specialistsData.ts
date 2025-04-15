
import { Heart, Brain, Stethoscope, Microscope, Activity, Pill, Bone, Eye, UserCog } from "lucide-react";
import { Agent } from "../types/consultationTypes";

export const specialists: Agent[] = [
  {
    id: "cardio",
    name: "Dr. Harper Cardiology",
    specialty: "Cardiology",
    description: "Specialist in cardiovascular conditions and heart health",
    icon: Heart,
    color: "text-red-500",
    availability: true,
    rating: 4.9
  },
  {
    id: "neuro",
    name: "Dr. Morgan Neurology",
    specialty: "Neurology",
    description: "Expert in neurological disorders and brain function",
    icon: Brain,
    color: "text-purple-500",
    availability: true,
    rating: 4.8
  },
  {
    id: "internal",
    name: "Dr. Taylor Internal Medicine",
    specialty: "Internal Medicine",
    description: "General internist with broad diagnostic expertise",
    icon: Stethoscope,
    color: "text-blue-500",
    availability: true,
    rating: 4.7
  },
  {
    id: "patho",
    name: "Dr. Riley Pathology",
    specialty: "Pathology",
    description: "Specialist in disease diagnosis through laboratory tests",
    icon: Microscope,
    color: "text-green-500",
    availability: true,
    rating: 4.9
  },
  {
    id: "pulmo",
    name: "Dr. Avery Pulmonology",
    specialty: "Pulmonology",
    description: "Expert in respiratory system and lung conditions",
    icon: Activity,
    color: "text-sky-500",
    availability: true,
    rating: 4.6
  },
  {
    id: "pharma",
    name: "Dr. Casey Pharmacology",
    specialty: "Pharmacology",
    description: "Specialist in medication interactions and drug therapy",
    icon: Pill,
    color: "text-amber-500",
    availability: true,
    rating: 4.8
  },
  {
    id: "ortho",
    name: "Dr. Jordan Orthopedics",
    specialty: "Orthopedics",
    description: "Expert in musculoskeletal conditions and bone health",
    icon: Bone,
    color: "text-orange-500",
    availability: true,
    rating: 4.7
  },
  {
    id: "ophtho",
    name: "Dr. Quinn Ophthalmology",
    specialty: "Ophthalmology",
    description: "Specialist in eye conditions and vision disorders",
    icon: Eye,
    color: "text-indigo-500",
    availability: false,
    rating: 4.9
  },
  {
    id: "psych",
    name: "Dr. Blake Psychiatry",
    specialty: "Psychiatry",
    description: "Mental health specialist with focus on diagnostic assessment",
    icon: UserCog,
    color: "text-teal-500",
    availability: true,
    rating: 4.6
  }
];
