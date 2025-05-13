import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paperclip, AtSign, SendHorizonal, UserPlus, Bot, ClipboardList } from 'lucide-react'; // Added ClipboardList
import PublicLayout from '@/components/layout/PublicLayout'; 
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { agents as allAgents } from '@/components/agents/data/agentsData'; 
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; 
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; 
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"; 
import { Progress } from "@/components/ui/progress"; 
import { Badge } from "@/components/ui/badge"; 

// Basic message type
interface Message {
  id: string;
  sender: 'user' | 'ai' | 'expert'; 
  senderName: string; 
  text: string;
  timestamp: string;
  avatar?: string; 
}

// Participant type
interface Participant {
    id: string;
    name: string;
    type: 'ai' | 'expert';
    avatar?: string;
}

// Consensus Item Type
type ConsensusStatus = 'Confirmed' | 'Agreed' | 'Pending' | 'Discussing' | 'Default';
interface ConsensusItemData {
    id: string;
    topic: string;
    status: ConsensusStatus;
    details: string;
    specialists: { id: string; name: string; color: string }[]; 
}

const CollaborationHub: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState<string>('');
    const [participants, setParticipants] = useState<Participant[]>([
        { id: 'cardio', name: 'CardioAssist', type: 'ai', avatar: '/agents/cardio.jpg' },
        { id: 'user', name: 'You', type: 'expert', avatar: '/placeholder.svg' }, 
    ]); 
    const { toast } = useToast();
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null); 
    const [isTaggingPopoverOpen, setIsTaggingPopoverOpen] = useState(false); 
    const [showConsensus, setShowConsensus] = useState<boolean>(false); 
    const [consensusData, setConsensusData] = useState<ConsensusItemData[]>([]); 
    const [consensusProgress, setConsensusProgress] = useState<number>(0);
    // Loading state to prevent the spinner from showing repeatedly
    const [isLoading, setIsLoading] = useState(true);

    // Scroll chat to bottom
    useEffect(() => {
        if (!showConsensus && scrollAreaRef.current) { 
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages, showConsensus]);

    // --- Handlers ---
    const handleSendMessage = () => {
        const text = inputText.trim();
        if (!text) return;

        const taggedParticipants = participants.filter(p => text.includes(`@${p.name}`));
        if (taggedParticipants.length > 0) {
            console.log("Message tagged for:", taggedParticipants.map(p => p.name).join(', '));
            toast({ title: `Message directed to: ${taggedParticipants.map(p => p.name).join(', ')} (Simulation)` });
        }

        const newMessage: Message = {
            id: Date.now().toString(), sender: 'user', senderName: 'You', text: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            avatar: '/placeholder.svg' 
        };
        setMessages(prev => [...prev, newMessage]);
        setInputText('');
        setIsTaggingPopoverOpen(false); 

        // Simulate AI response
        setTimeout(() => {
            const aiParticipant = participants.find(p => p.type === 'ai');
            if (aiParticipant && (taggedParticipants.length === 0 || taggedParticipants.some(p => p.id === aiParticipant.id))) {
                const responseText = taggedParticipants.some(p => p.id === aiParticipant.id) 
                    ? `Responding to your tag: "${text}". (Simulated response)`
                    : `Acknowledged: "${text}". Analyzing context... (Simulated response)`;
                const aiResponse: Message = {
                    id: (Date.now() + 1).toString(), sender: 'ai', senderName: aiParticipant.name,
                    text: responseText,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    avatar: aiParticipant.avatar || '/placeholder.svg'
                };
                setMessages(prev => [...prev, aiResponse]);
            }
        }, 1000);
    };

    const handleAddParticipant = (id: string, name: string, type: 'ai' | 'expert') => {
        const newParticipant: Participant = { id, name, type, avatar: type === 'ai' ? `/agents/${id}.jpg` : '/placeholder.svg' };
        if (!participants.some(p => p.id === newParticipant.id)) {
            setParticipants(prev => [...prev, newParticipant]);
            toast({ title: `${name} added to collaboration.` });
        } else {
            toast({ title: `${name} is already participating.`, variant: "default" });
        }
    };
    
    const handleTagExpert = () => { /* Placeholder */ toast({ title: "Add Human Expert feature not implemented." }); };
    const handleAttachFileClick = () => { fileInputRef.current?.click(); };
    const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) { toast({ title: `Selected file: ${file.name}` }); }
        if (fileInputRef.current) { fileInputRef.current.value = ''; }
    };
    const handleTagSelection = (name: string) => {
        setInputText(prev => prev + `@${name} `); 
        setIsTaggingPopoverOpen(false); 
    };

    const handleGenerateConsensus = () => {
        const sampleConsensus: ConsensusItemData[] = [
             { id: 'diag1', topic: 'Diagnosis', status: 'Confirmed', details: 'Pancreatic adenocarcinoma, moderate-poorly differentiated.', specialists: [{id: 'path', name: 'PA', color: 'bg-purple-500'}, {id: 'onco', name: 'ON', color: 'bg-blue-500'}, {id: 'surg', name: 'SU', color: 'bg-cyan-500'}] },
             { id: 'stag1', topic: 'Staging', status: 'Agreed', details: 'Borderline resectable disease (SMV encasement), clinical T3NXM0.', specialists: [{id: 'onco', name: 'ON', color: 'bg-blue-500'}, {id: 'surg', name: 'SU', color: 'bg-cyan-500'}, {id: 'rad', name: 'RA', color: 'bg-green-500'}] },
             { id: 'resect1', topic: 'Resectability', status: 'Discussing', details: 'Consensus favors neoadjuvant therapy first, but surgery requires further imaging (CTA/MRI) to assess vascular detail for potential upfront resection.', specialists: [{id: 'surg', name: 'SU', color: 'bg-cyan-500'}, {id: 'onco', name: 'ON', color: 'bg-blue-500'}, {id: 'rad', name: 'RA', color: 'bg-green-500'}] },
             { id: 'neoadj1', topic: 'Neoadjuvant Plan', status: 'Agreed', details: 'If neoadjuvant path is chosen, recommend FOLFIRINOX regimen (pending patient fitness) followed by restaging. Consider chemoradiation post-chemo.', specialists: [{id: 'onco', name: 'ON', color: 'bg-blue-500'}, {id: 'radio_onco', name: 'RO', color: 'bg-pink-500'}, {id: 'surg', name: 'SU', color: 'bg-cyan-500'}] },
             { id: 'img1', topic: 'Additional Imaging', status: 'Pending', details: 'Requires dedicated Pancreatic Protocol CTA/MRI for detailed vascular assessment.', specialists: [{id: 'surg', name: 'SU', color: 'bg-cyan-500'}, {id: 'rad', name: 'RA', color: 'bg-green-500'}] },
        ];
        setConsensusData(sampleConsensus);
        setConsensusProgress(65); 
        setShowConsensus(true);
        toast({ title: "Consensus view generated (simulation)." });
    };

    return (
        <PublicLayout showHeader={true} showFooter={false}> 
            <div className="flex flex-col h-[calc(100vh-80px)] p-4 gap-4"> 
                {/* Header/Participants Area */}
                <Card className="flex-shrink-0">
                     <CardHeader className="flex flex-row justify-between items-center"> 
                        <CardTitle className="text-lg">Collaboration Session</CardTitle>
                        <Button variant="outline" size="sm" onClick={handleGenerateConsensus}>
                            <ClipboardList size={16} className="mr-1.5" />
                            Generate Consensus
                        </Button>
                    </CardHeader>
                    <CardContent className="pt-2 pb-3 px-4 border-t"> 
                        <div className="flex items-center flex-wrap gap-2"> 
                            <span className="text-sm text-muted-foreground mr-1">Participants:</span> 
                            {participants.map(p => (
                                <div key={p.id} className="flex items-center gap-1.5 bg-secondary/10 px-2 py-0.5 rounded-full">
                                    <Avatar className="h-5 w-5"><AvatarImage src={p.avatar} alt={p.name} /><AvatarFallback className="text-xs">{p.type === 'ai' ? <Bot size={12}/> : p.name.substring(0,1)}</AvatarFallback></Avatar>
                                    <span className="text-xs font-medium text-gray-900">{p.name}</span> {/* Changed text color */}
                                </div>
                            ))}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="ml-auto"><UserPlus size={16} className="mr-1" /> Add Participant</Button></DropdownMenuTrigger>
                                <DropdownMenuContent align="end"> 
                                    <DropdownMenuLabel>Add AI Agent</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {allAgents.filter(agent => !participants.some(p => p.id === agent.id)).map(agent => (<DropdownMenuItem key={agent.id} onSelect={() => handleAddParticipant(agent.id, agent.name, 'ai')}>{agent.name} ({agent.specialty})</DropdownMenuItem>))}
                                    {allAgents.filter(agent => !participants.some(p => p.id === agent.id)).length === 0 && (<DropdownMenuItem disabled>No more AI agents to add</DropdownMenuItem>)}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onSelect={handleTagExpert}>Add Human Expert...</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardContent>
                </Card>

                {/* Conditionally Render Consensus View OR Chat Area */}
                {showConsensus ? (
                    <Card className="flex-grow flex flex-col overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-lg">Consensus & Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow p-4 overflow-y-auto">
                            <div className="space-y-4">
                                {consensusData.map((item, index) => (
                                    <ConsensusItem key={item.id} item={item} index={index} />
                                ))}
                            </div>
                            <div className="mt-8 pt-5 border-t">
                                <h3 className="text-sm font-medium text-center text-muted-foreground mb-2">Progress to Final Recommendation</h3>
                                <Progress value={consensusProgress} className="w-full h-2" />
                                <div className="flex justify-between text-xs text-muted-foreground mt-1 px-1"><span>Initial</span><span>Consensus</span><span>Final</span></div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="flex-grow flex flex-col overflow-hidden">
                        <CardContent className="flex-grow p-0">
                            <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                                {messages.length === 0 && (<div className="flex items-center justify-center h-full text-muted-foreground">Start the collaboration by sending a message.</div>)}
                                {messages.map((msg) => (
                                    <div key={msg.id} className={cn("flex items-start gap-3 mb-4", msg.sender === 'user' ? 'justify-end' : '')}>
                                        {msg.sender !== 'user' && (<Avatar className="h-8 w-8"><AvatarImage src={msg.avatar} /><AvatarFallback>{msg.sender === 'ai' ? <Bot size={16}/> : msg.senderName.substring(0,1)}</AvatarFallback></Avatar>)}
                                        <div className={cn("max-w-[70%] p-3 rounded-lg", msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                            <p className="text-sm font-semibold mb-1">{msg.senderName}</p>
                                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                            <p className="text-xs text-muted-foreground/80 mt-1 text-right">{msg.timestamp}</p>
                                        </div>
                                        {msg.sender === 'user' && (<Avatar className="h-8 w-8"><AvatarImage src={msg.avatar} /><AvatarFallback>{msg.senderName.substring(0,1)}</AvatarFallback></Avatar>)}
                                    </div>
                                ))}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                )}

                {/* Input Area */}
                <Card className="flex-shrink-0">
                    <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                            <Textarea
                                id="collaboration-textarea" 
                                placeholder="Type your message or query... Use @ to tag participants."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                                rows={1}
                                className="flex-grow resize-none max-h-24 overflow-y-auto"
                            />
                            <input type="file" ref={fileInputRef} onChange={handleFileSelected} style={{ display: 'none' }} />
                            <Button variant="ghost" size="icon" onClick={handleAttachFileClick} title="Attach File"><Paperclip size={18} /></Button>
                            <Popover open={isTaggingPopoverOpen} onOpenChange={setIsTaggingPopoverOpen}>
                                <PopoverTrigger asChild><Button variant="ghost" size="icon" title="Tag Participant"><AtSign size={18} /></Button></PopoverTrigger>
                                <PopoverContent className="w-60 p-0">
                                    <Command>
                                        <CommandInput placeholder="Tag participant..." />
                                        <CommandList>
                                            <CommandEmpty>No participants found.</CommandEmpty>
                                            <CommandGroup>
                                                {participants.filter(p => p.id !== 'user').map((participant) => (
                                                    <CommandItem key={participant.id} value={participant.name} onSelect={() => handleTagSelection(participant.name)}>
                                                        <Avatar className="mr-2 h-5 w-5"><AvatarImage src={participant.avatar} /><AvatarFallback className="text-xs">{participant.type === 'ai' ? <Bot size={12}/> : participant.name.substring(0,1)}</AvatarFallback></Avatar>
                                                        {participant.name}
                                                        <span className="ml-auto text-xs text-muted-foreground">{participant.type === 'ai' ? 'AI' : 'Expert'}</span>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <Button onClick={handleSendMessage} title="Send Message"><SendHorizonal size={18} /></Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PublicLayout>
    );
};

// Sub-component for rendering a single consensus item
const ConsensusItem: React.FC<{ item: ConsensusItemData; index: number }> = ({ item, index }) => {
    
    // Map status to Tailwind background/text colors based on CSS variables (approximation)
    const getStatusClassNames = (status: ConsensusStatus): string => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-800'; 
            case 'Agreed': return 'bg-blue-100 text-blue-800'; 
            case 'Pending': return 'bg-yellow-100 text-yellow-800'; 
            case 'Discussing': return 'bg-red-100 text-red-800'; 
            default: return 'bg-gray-100 text-gray-600'; 
        }
    };

    return (
        <div 
            className="bg-muted/50 border rounded-lg p-4 animate-fadeInUp" // Use animation class directly if defined globally
            style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }} // Initial state for animation
        >
            <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-base">{item.topic}</span>
                <Badge className={cn("text-xs uppercase px-2.5 py-0.5", getStatusClassNames(item.status))}>
                    {item.status}
                </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{item.details}</p>
            <div className="flex flex-wrap gap-1.5">
                {item.specialists.map(spec => (
                    <Avatar key={spec.id} className="h-7 w-7" title={spec.name}> 
                        <AvatarFallback className={cn("text-xs font-bold text-white", spec.color)}> 
                            {spec.name} {/* Display initials */}
                        </AvatarFallback>
                    </Avatar>
                ))}
            </div>
        </div>
    );
};

// Add fadeInUp animation to global styles or Tailwind config if needed
// @keyframes fadeInUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

export default CollaborationHub;
