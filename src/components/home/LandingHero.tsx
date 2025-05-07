import React from "react";
import { Search, Paperclip, Lightbulb, ArrowRight, FlaskConical, Edit, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

const quickActions = [
	{
		icon: FileSearch,
		label: "Latest Research?",
		color: "border-l-4 border-pink-400 rotate-[-1deg]",
		iconColor: "text-primary",
	},
	{
		icon: FlaskConical,
		label: "Interpret Labs?",
		color: "bg-primary/10 border-none rotate-[1deg]",
		iconColor: "text-pink-500",
	},
	{
		icon: Edit,
		label: "Draft a note",
		color: "border-l-4 border-teal-400 rotate-[-0.5deg]",
		iconColor: "text-teal-500",
	},
];

export default function LandingHero() {
	return (
		<section className="relative overflow-hidden py-16 md:py-24 bg-neutral-50">
			{/* Decorative Blobs */}
			<div
				className="absolute top-[-5%] right-[-10%] w-[30vw] h-[30vw] bg-teal-300 opacity-15 rounded-[40%_60%_65%_35%/40%_45%_55%_60%] z-0 pointer-events-none"
				style={{ filter: "blur(8px)" }}
			/>
			<div
				className="absolute bottom-[-5%] left-[-10%] w-[25vw] h-[25vw] bg-yellow-300 opacity-10 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] z-0 pointer-events-none"
				style={{ filter: "blur(8px)" }}
			/>

			<div className="container relative z-10 mx-auto px-4 max-w-4xl flex flex-col items-center">
				{/* Logo and Sign Up */}
				<div className="w-full flex justify-between items-center mb-8">
					<a
						href="/"
						className="flex items-center text-2xl font-bold text-neutral-900 tracking-tight rotate-[-1deg] font-sans"
					>
						<span className="inline-block w-3 h-3 bg-pink-400 rounded-full mr-2 -translate-y-1"></span>
						Leny<span className="text-primary ml-1">.ai</span>
					</a>
					<a href="/register">
						<Button className="bg-[#F59571] hover:bg-[#F5856A] text-white font-medium rounded-md px-5 py-2 text-sm relative rotate-[1deg]">
							Sign up
							<span className="absolute top-[-6px] right-[-6px] w-3 h-3 bg-yellow-300 rounded-full -z-10"></span>
						</Button>
					</a>
				</div>

				{/* Tagline */}
				<h1 className="font-serif text-4xl md:text-5xl font-semibold text-center text-neutral-800 mb-2 relative rotate-[-0.5deg]">
					Get Answers Quickly
					<span className="block absolute left-1/2 -translate-x-1/2 bottom-[-10px] w-40 h-1 bg-gradient-to-r from-transparent via-primary to-pink-400 rounded-full"></span>
				</h1>
				<p className="text-base md:text-lg text-neutral-600 text-center mb-8 font-normal rotate-[0.5deg]">
					Go Home Early
				</p>

				{/* Search Box */}
				<div className="w-full max-w-xl mb-8 relative">
					<div className="absolute top-2 left-2 w-full h-full bg-teal-200 opacity-10 rounded-md z-0 pointer-events-none" />
					<div className="relative z-10 bg-white border border-neutral-200 rounded-md shadow-lg flex flex-col">
						<div className="flex items-center px-5 py-4">
							<input
								type="text"
								className="flex-1 bg-transparent outline-none text-lg text-neutral-800 placeholder:text-neutral-400"
								placeholder="Ask me anything medical..."
								aria-label="Ask me anything medical"
							/>
						</div>
						{/* Search Actions */}
						<div className="flex items-center justify-between px-5 pb-3">
							{/* Left: Icon buttons */}
							<div className="flex gap-3">
								<button
									className="text-neutral-500 hover:text-primary p-2 rounded transition-colors"
									title="Attach file"
									aria-label="Attach file"
								>
									<Paperclip className="w-5 h-5" />
								</button>
								<button
									className="text-neutral-500 hover:text-pink-400 p-2 rounded transition-colors"
									title="Get ideas"
									aria-label="Get ideas"
								>
									<Lightbulb className="w-5 h-5" />
								</button>
							</div>
							{/* Right: Mode dropdown and send */}
							<div className="flex items-center gap-3">
								<div className="flex items-center gap-2 bg-neutral-100 px-3 py-1 rounded-sm text-sm font-medium text-neutral-700 cursor-pointer hover:bg-neutral-200 transition-all rotate-[-1deg]">
									Clinical Mode
									<ArrowRight className="w-4 h-4 text-neutral-500" />
								</div>
								<button
									className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-all rotate-[5deg]"
									title="Send query"
									aria-label="Send query"
								>
									<ArrowRight className="w-5 h-5" />
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="flex flex-wrap gap-4 justify-center w-full max-w-xl mb-4">
					{quickActions.map((action, idx) => (
						<button
							key={action.label}
							className={`flex items-center gap-2 px-5 py-3 bg-white border border-neutral-200 rounded-md font-medium text-neutral-700 text-sm shadow-sm transition-all hover:scale-105 hover:border-primary ${action.color}`}
							style={{ minWidth: 140 }}
						>
							<action.icon className={`w-5 h-5 ${action.iconColor}`} />
							{action.label}
						</button>
					))}
				</div>
			</div>
		</section>
	);
}
