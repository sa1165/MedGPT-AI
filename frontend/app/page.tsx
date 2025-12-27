"use client";

import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { SendHorizontal, ShieldAlert, Plus, PanelLeftClose, PanelLeftOpen, Search, Sparkles, Paperclip, ChevronUp, Mic, Compass, Image as ImageIcon, PenTool, Lightbulb, Zap, Book, MapPin, Activity, X, Brain, Square, Info, User, Calendar, Smile, LogOut } from "lucide-react";
import Image from "next/image";

// --- Types ---
type MessageRole = "user" | "assistant";
type Urgency = "Low" | "Moderate" | "High";

interface Message {
    id: string;
    role: MessageRole;
    content: string;
    urgency?: Urgency;
    stage?: string;
    timestamp: number;
    image?: string;
    data?: any; // Structured data
}

interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    timestamp: number;
}

// --- Components ---

function ToolModal({ isOpen, onClose, title, icon: Icon, description, onSubmit, placeholder, inputType = "text" }: any) {
    if (!isOpen) return null;
    const [value, setValue] = useState("");

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-[#1e1f20] border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl transform transition-all scale-100 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-[#2a2b2d] rounded-xl text-blue-400 border border-white/5">
                            <Icon size={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-white">{title}</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition p-1 hover:bg-white/5 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed">{description}</p>

                {inputType === "textarea" ? (
                    <textarea
                        className="w-full bg-[#2a2b2d] border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 outline-none focus:border-blue-500/50 transition min-h-[120px] resize-none text-[15px]"
                        placeholder={placeholder}
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        autoFocus
                    />
                ) : (
                    <input
                        type="text"
                        className="w-full bg-[#2a2b2d] border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 outline-none focus:border-blue-500/50 transition text-[15px]"
                        placeholder={placeholder}
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        autoFocus
                        onKeyDown={e => { if (e.key === 'Enter') { onSubmit(value); onClose(); setValue(""); } }}
                    />
                )}

                <div className="flex gap-3 pt-2">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl font-medium text-gray-300 hover:bg-white/5 hover:text-white transition text-sm">
                        Cancel
                    </button>
                    <button
                        onClick={() => { onSubmit(value); onClose(); setValue(""); }}
                        disabled={!value.trim()}
                        className="flex-1 py-3 rounded-xl font-medium bg-blue-600 hover:bg-blue-500 text-white transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        Run Analysis
                    </button>
                </div>
            </div>
        </div>
    );
}


function UrgencyBadge({ level }: { level: Urgency }) {
    const colors = {
        Low: "text-green-400 border-green-500/20 bg-green-500/10",
        Moderate: "text-yellow-400 border-yellow-500/20 bg-yellow-500/10",
        High: "text-red-500 border-red-500/20 bg-red-500/10 animate-pulse",
    };
    return (
        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${colors[level] || colors.Low}`}>
            {level}
        </span>
    );
}

function AboutModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-[#1e1f20] border border-white/10 w-full max-w-2xl rounded-2xl p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col gap-6">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white transition p-1 hover:bg-white/5 rounded-lg">
                    <X size={20} />
                </button>

                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-blue-600/20 rounded-2xl text-blue-400 border border-blue-500/20">
                        <Brain size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white leading-tight">About MedGPT</h2>
                        <p className="text-blue-400/80 text-sm font-medium">Independent Research Project</p>
                    </div>
                </div>

                <div className="space-y-6 text-[15px] text-gray-300 leading-relaxed">
                    <p>
                        MedGPT is a Clinical Decision Support and Triage Assistant designed to help users better understand health concerns before seeking professional medical care.
                    </p>

                    <p>
                        MedGPT is not a medical advice or diagnostic system. It does not provide diagnoses, prescriptions, or treatment plans. Instead, it is intended as a preliminary, educational tool that guides users through a structured, human-like medical intake conversation—similar to what happens during an initial consultation with a doctor.
                    </p>

                    <div>
                        <p className="text-white font-semibold mb-3 flex items-center gap-2">
                            <Zap size={16} className="text-yellow-400" />
                            The purpose of MedGPT is to:
                        </p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <li className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                <span>Help users clearly describe symptoms and health concerns</span>
                            </li>
                            <li className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                <span>Provide general medical context in simple, understandable language</span>
                            </li>
                            <li className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                <span>Assess urgency and highlight potential warning signs</span>
                            </li>
                            <li className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                <span>Support informed decisions about when to seek medical care</span>
                            </li>
                        </ul>
                    </div>

                    <p>
                        MedGPT is designed to support awareness and preparedness, not to replace healthcare professionals. It encourages timely and appropriate medical consultation, especially when urgent symptoms are identified.
                    </p>

                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                        <p className="text-red-400 font-bold text-sm mb-1 flex items-center gap-2">
                            <ShieldAlert size={16} />
                            ⚠️ Important Disclaimer
                        </p>
                        <p className="text-red-300/80 text-[13px]">
                            MedGPT is an AI-based informational tool. It does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns or emergencies.
                        </p>
                    </div>

                    <div className="pt-2 border-t border-white/5">
                        <p className="text-white font-semibold mb-1">Developer</p>
                        <p className="text-deep-subtext text-sm">Developed by <span className="text-blue-400">Sanjeev A</span></p>
                        <p className="text-gray-500 text-xs mt-1 italic">Built as an independent project focused on ethical AI, healthcare triage, and human-centered system design.</p>
                    </div>
                </div>

                <div className="pt-2 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition text-sm">
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
}

import ReactMarkdown from 'react-markdown';

// --- Typewriter Hook ---
function useTypewriter(text: string, speed = 10, isEnabled = false) {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        // Disable typewriter if it's already "streaming" in from the network
        // or just disable it entirely for better performance with large blocks
        setDisplayedText(text);
    }, [text]);

    return displayedText;
}

function MessageBubble({ message, isLast }: { message: Message, isLast: boolean }) {
    const isUser = message.role === "user";
    // Only animate if it's the assistant, it's the last message, and it's not a historical load (simplification: assume 'timestamp' check or just isLast for now)
    const shouldAnimate = !isUser && isLast;

    // Use hook
    const content = useTypewriter(message.content, 10, shouldAnimate);

    return (
        <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"} mb-6 animate-fade-in group`}>
            <div className={`flex gap-4 max-w-3xl ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                {/* Avatar */}
                {!isUser && (
                    <div className="w-8 h-8 flex items-center justify-center shrink-0 overflow-hidden rounded-full bg-[#101014]">
                        <img src="/sidebar_logo.png" alt="AI" className="w-full h-full object-contain filter invert-[1] hue-rotate-180 brightness-[1.1] contrast-125 mix-blend-screen scale-110" />
                    </div>
                )}

                {/* Content */}
                <div className={`flex flex-col gap-1 min-w-[200px] ${isUser ? "items-end" : "items-start"} max-w-full overflow-hidden`}>
                    {!isUser && (
                        <div className="flex gap-2 items-center mb-1 opacity-50 group-hover:opacity-100 transition-opacity">
                            <span className="font-bold text-xs text-deep-subtext">MedGPT</span>
                        </div>
                    )}

                    {message.image && (
                        <div className="mb-2 rounded-xl overflow-hidden border border-white/10 max-w-[200px]">
                            <Image src={message.image} alt="User Upload" width={200} height={200} className="w-full h-auto object-cover" />
                        </div>
                    )}

                    <div className={`text-md leading-relaxed rounded-2xl px-4 py-3 ${isUser ? "bg-deep-input text-deep-text" : "text-deep-text pl-0"}`}>
                        {isUser ? (
                            <span className="whitespace-pre-wrap">{message.content}</span>
                        ) : (
                            // Render Markdown for AI response
                            <div className="markdown-body">
                                <ReactMarkdown>
                                    {content}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>

                    {/* Hospital Cards Rendering */}
                    {message.data && message.data.type === 'hospital_list' && Array.isArray(message.data.hospitals) && (
                        <div className="mt-3 grid grid-cols-1 gap-3 w-full max-w-[600px]">
                            {message.data.hospitals.map((hospital: any, idx: number) => (
                                <div key={idx} className="bg-[#1e1f20] p-4 rounded-xl border border-white/10 hover:border-blue-500/50 transition flex justify-between items-center group">
                                    <div>
                                        <h3 className="text-gray-200 font-semibold text-sm">{hospital.name}</h3>
                                        <p className="text-gray-500 text-xs mt-1">{hospital.category}</p>
                                    </div>
                                    {hospital.maps_query && (
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.maps_query)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-blue-600/20 text-blue-400 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition flex gap-2 items-center text-xs font-medium"
                                        >
                                            <MapPin size={14} />
                                            <span>Map</span>
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Sidebar({ isOpen, toggle, onNewChat, history, loadSession, onShowAbout, userData }: { isOpen: boolean, toggle: () => void, onNewChat: () => void, history: ChatSession[], loadSession: (s: ChatSession) => void, onShowAbout: () => void, userData: any }) {
    return (
        <div
            className={`fixed inset-y-0 left-0 z-50 bg-deep-sidebar transform transition-transform duration-300 ease-in-out border-r border-white/5 
        ${isOpen ? "translate-x-0 w-[260px]" : "-translate-x-full w-[260px]"}`}
        >
            <div className="p-4 flex flex-col h-full relative">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 flex items-center justify-center bg-transparent overflow-hidden">
                            <img
                                src="/sidebar_logo.png"
                                alt="MedGPT Logo"
                                className="w-full h-full object-contain filter invert-[1] hue-rotate-180 brightness-[1.1] mix-blend-screen scale-110"
                            />
                        </div>
                        <span className="font-serif text-2xl font-bold tracking-tight bg-gradient-to-r from-[#00bcd4] to-[#3f51b5] bg-clip-text text-transparent">MedGPT</span>
                    </div>
                    <button onClick={toggle} className="text-deep-subtext hover:text-white p-1 rounded hover:bg-white/5 transition">
                        <PanelLeftClose size={18} />
                    </button>
                </div>

                <button
                    onClick={onNewChat}
                    className="flex items-center gap-2 w-full bg-deep-button hover:bg-white/10 text-white px-4 py-3 rounded-full transition-all duration-200 border border-white/5 shadow-sm mb-6 font-medium text-sm group"
                >
                    <div className="bg-white/10 rounded-full p-0.5 group-hover:rotate-90 transition-transform">
                        <Plus size={16} />
                    </div>
                    New chat
                </button>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <p className="text-xs font-semibold text-deep-subtext mb-2 px-3">Recent</p>
                    <div className="space-y-1">
                        {history.length === 0 && <p className="text-xs text-deep-subtext px-3 italic">No history yet</p>}
                        {history.map((session) => (
                            <button
                                key={session.id}
                                onClick={() => loadSession(session)}
                                className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white transition truncate block"
                            >
                                {session.title}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-auto flex flex-col gap-1">
                    <button
                        onClick={onShowAbout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-white/5 hover:text-white transition w-full group"
                    >
                        <Info size={18} className="group-hover:text-blue-400 transition-colors" />
                        <span className="font-medium">About MedGPT</span>
                    </button>

                    {/* User Profile Footer */}
                    <div className="flex items-center gap-3 px-3 py-3 cursor-pointer hover:bg-white/5 rounded-lg transition border-t border-white/5 mt-1 group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {userData.name ? userData.name[0].toUpperCase() : "U"}
                        </div>
                        <div className="flex-1 truncate">
                            <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors truncate">{userData.name || "User Profile"}</p>
                            <p className="text-[10px] text-gray-500 truncate">
                                {userData.age ? `${userData.age} yrs • ` : ""}
                                {userData.gender || "Standard Plan"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function OnboardingFlow({ userData, setUserData, onComplete }: { userData: any, setUserData: any, onComplete: () => void }) {
    const [step, setStep] = useState(1); // 1: Info, 2: Disclaimer

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (userData.name && userData.age && userData.gender) {
            setStep(2);
        }
    };

    const handleGuestSignIn = () => {
        setUserData({ name: "Guest", age: "N/A", gender: "Not specified" });
        setStep(2);
    };

    if (step === 1) {
        return (
            <div className="fixed inset-0 z-[200] bg-[#131314] flex flex-col items-center justify-center p-6 animate-fade-in">
                <div className="w-full max-w-md space-y-8 text-center animate-fade-in-up">
                    <div className="flex flex-col items-center gap-4 mb-2">
                        <div className="w-20 h-20 flex items-center justify-center bg-transparent overflow-hidden">
                            <img src="/sidebar_logo.png" alt="MedGPT" className="w-full h-full object-contain filter invert-[1] hue-rotate-180 brightness-[1.1] mix-blend-screen scale-110 animate-pulse-slow" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-[#00bcd4] to-[#3f51b5] bg-clip-text text-transparent">Welcome to MedGPT</h1>
                        <p className="text-gray-400 font-medium">Your personal health triage assistant. <br />Let's start by getting to know you.</p>
                    </div>

                    <form onSubmit={handleNext} className="bg-[#1e1f20] border border-white/10 rounded-[32px] p-8 shadow-2xl space-y-5 text-left">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter your name"
                                    className="w-full bg-[#131314] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                    value={userData.name}
                                    onChange={e => setUserData({ ...userData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Age</label>
                                <div className="relative group">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                                    <input
                                        type="number"
                                        required
                                        placeholder="Age"
                                        className="w-full bg-[#131314] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                        value={userData.age}
                                        onChange={e => setUserData({ ...userData, age: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Gender</label>
                                <div className="relative group">
                                    <Smile className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                                    <select
                                        required
                                        className="w-full bg-[#131314] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                                        value={userData.gender}
                                        onChange={e => setUserData({ ...userData, gender: e.target.value })}
                                    >
                                        <option value="" disabled>Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 pt-2">
                            <button
                                type="submit"
                                className="w-full py-4 rounded-2xl bg-white text-black font-bold text-sm tracking-wide hover:bg-blue-50 hover:scale-[1.02] transition active:scale-[0.98]"
                            >
                                Continue to MedGPT
                            </button>

                            <div className="flex items-center gap-4 py-1">
                                <div className="h-[1px] flex-1 bg-white/5"></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">OR</span>
                                <div className="h-[1px] flex-1 bg-white/5"></div>
                            </div>

                            <button
                                type="button"
                                onClick={handleGuestSignIn}
                                className="w-full py-4 rounded-2xl bg-[#131314] border border-white/10 text-gray-400 font-bold text-[13px] tracking-wide hover:bg-white/5 hover:text-white transition active:scale-[0.98]"
                            >
                                Sign in as Guest
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-[#1e1f20] border border-white/10 w-full max-w-xl rounded-[40px] p-10 shadow-3xl animate-fade-in-up flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-red-500/10 rounded-2xl text-red-500 border border-red-500/20">
                        <ShieldAlert size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Medical Disclaimer</h2>
                        <p className="text-red-400/80 text-sm font-medium">Please read carefully before proceeding</p>
                    </div>
                </div>

                <div className="space-y-4 text-gray-300 leading-relaxed text-[15px] bg-white/5 p-6 rounded-[24px] border border-white/5">
                    <p>MedGPT is an <strong>experimental AI-based informational tool</strong> and is NOT a substitute for professional medical advice, diagnosis, or treatment.</p>
                    <div className="space-y-3">
                        <div className="flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                            <span>This AI can make mistakes or provide inaccurate clinical info.</span>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                            <span>In case of an emergency, call your local emergency services (e.g. 911) immediately.</span>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                            <span>By clicking agree, you acknowledge that you will not use this tool as medical advice.</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mt-2">
                    <button
                        onClick={() => setStep(1)}
                        className="flex-1 py-4 rounded-2xl border border-white/10 text-gray-400 font-bold text-sm hover:bg-white/5 hover:text-white transition"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={onComplete}
                        className="flex-[2] py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-red-900/20 hover:scale-[1.02] transition active:scale-[0.98]"
                    >
                        I Understand & Agree
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Home() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState("");
    const [isEmergency, setIsEmergency] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [history, setHistory] = useState<ChatSession[]>([]);
    const [currentMode, setCurrentMode] = useState("quick_triage");
    const [showTools, setShowTools] = useState(false);
    const [showFast, setShowFast] = useState(false);
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isAutoScroll, setIsAutoScroll] = useState(true);
    const [userData, setUserData] = useState({ name: "", age: "", gender: "" });
    const [isOnboarding, setIsOnboarding] = useState(true);
    const [onboardingStep, setOnboardingStep] = useState(1); // 1: Details, 2: Disclaimer
    const [isAgreed, setIsAgreed] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const [isListening, setIsListening] = useState(false);
    const [sttStatus, setSttStatus] = useState<string | null>(null);
    const [volume, setVolume] = useState(0);
    const [showTroubleshooter, setShowTroubleshooter] = useState(false);
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const recognitionRef = useRef<any>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const startVolumeMonitor = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.fftSize = 256;

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const updateVolume = () => {
                if (!analyserRef.current) return;
                analyserRef.current.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i];
                }
                const average = sum / bufferLength;
                setVolume(average);

                // Silence detection: if listening but volume is 0 for 3 seconds
                if (average > 1) {
                    if (silenceTimerRef.current) {
                        clearTimeout(silenceTimerRef.current);
                        silenceTimerRef.current = null;
                        if (sttStatus === "No sound detected?") setSttStatus("Listening...");
                    }
                } else if (!silenceTimerRef.current && isListening) {
                    silenceTimerRef.current = setTimeout(() => {
                        setSttStatus("No sound detected?");
                    }, 4000);
                }

                animationFrameRef.current = requestAnimationFrame(updateVolume);
            };

            updateVolume();
        } catch (err) {
            console.error("Volume monitor error:", err);
            setSttStatus("Mic Access Denied");
        }
    };

    const stopVolumeMonitor = () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
        if (audioContextRef.current) audioContextRef.current.close();
        audioContextRef.current = null;
        analyserRef.current = null;
        setVolume(0);
    };

    useEffect(() => {
        const savedOnboarding = localStorage.getItem("medgpt_onboarded");
        const savedUserData = localStorage.getItem("medgpt_user_data");
        if (savedOnboarding === "true" && savedUserData) {
            setIsOnboarding(false);
            setUserData(JSON.parse(savedUserData));
            setIsAgreed(true);
        }
    }, []);

    const completeOnboarding = () => {
        localStorage.setItem("medgpt_onboarded", "true");
        localStorage.setItem("medgpt_user_data", JSON.stringify(userData));
        setIsAgreed(true);
        setIsOnboarding(false);
    };

    const handleSignOut = () => {
        localStorage.removeItem("medgpt_onboarded");
        localStorage.removeItem("medgpt_user_data");
        setUserData({ name: "", age: "", gender: "" });
        setIsAgreed(false);
        setIsOnboarding(true);
        startNewSession();
    };

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.lang = 'en-US';
            recognitionRef.current.continuous = false; // Simplified
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onstart = () => {
                setIsListening(true);
                setSttStatus("Listening...");
                startVolumeMonitor();
            };

            recognitionRef.current.onresult = (event: any) => {
                let finalTranscript = "";
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }

                if (finalTranscript) {
                    setInput(prev => {
                        const newText = prev.trim() + (prev.trim() === "" ? "" : " ") + finalTranscript.trim();
                        return newText;
                    });
                    setTimeout(() => {
                        if (textareaRef.current) {
                            textareaRef.current.style.height = "auto";
                            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
                        }
                    }, 0);
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("STT Error:", event.error);
                if (event.error === 'not-allowed') setSttStatus("Mic blocked");
                else if (event.error === 'no-speech') setSttStatus("No speech detected");
                else setSttStatus("Mic error");
                setIsListening(false);
                stopVolumeMonitor();
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
                setSttStatus(null);
                stopVolumeMonitor();
            };
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            if (!recognitionRef.current) {
                alert("Speech recognition is not supported.");
                return;
            }
            try {
                setSttStatus("Requesting Mic...");
                recognitionRef.current.start();
            } catch (err) {
                setIsListening(false);
                setSttStatus("Error starting");
            }
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith("image/")) {
                alert("Please select an image file.");
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target?.result as string;
                // Remove prefix data:image/...;base64, for backend
                // But keep full string for UI preview
                setSelectedImage(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setSelectedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const scrollToBottom = (force = false) => {
        if (force || isAutoScroll) {
            messagesEndRef.current?.scrollIntoView({ behavior: isLoading ? "auto" : "smooth" });
        }
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const isBottom = Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) < 50;
        setIsAutoScroll(isBottom);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load history from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem("medgpt_history");
        if (saved) {
            setHistory(JSON.parse(saved));
        }
        startNewSession(); // Initialize a session
    }, []);

    // Save history whenever it changes
    useEffect(() => {
        localStorage.setItem("medgpt_history", JSON.stringify(history));
    }, [history]);

    const startNewSession = () => {
        const newId = uuidv4();
        setSessionId(newId);
        setMessages([]);
        setIsEmergency(false);
    };

    const saveCurrentSession = (msgs: Message[]) => {
        if (msgs.length === 0) return;

        const title = msgs[0].content.slice(0, 30) + (msgs[0].content.length > 30 ? "..." : "");

        setHistory(prev => {
            const existing = prev.findIndex(s => s.id === sessionId);
            if (existing >= 0) {
                const updated = [...prev];
                updated[existing] = { ...updated[existing], messages: msgs };
                return updated;
            } else {
                return [{ id: sessionId, title, messages: msgs, timestamp: Date.now() }, ...prev];
            }
        });
    };

    const loadSession = (session: ChatSession) => {
        setSessionId(session.id);
        setMessages(session.messages);
        // Check if emergency existed in this session
        const hasEmergency = session.messages.some(m => m.stage === "emergency");
        setIsEmergency(hasEmergency);
    };

    const stopGeneration = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setIsLoading(false);
        }
    };

    const sendMessage = async (content: string, modeOverride?: string) => {
        if (!content.trim() || isLoading || isEmergency) return;

        const userMsg: Message = { id: uuidv4(), role: "user", content, timestamp: Date.now(), image: selectedImage || undefined };
        setMessages(prev => [...prev, userMsg]);
        setInput("");

        const imageToSend = selectedImage ? selectedImage.split(",")[1] : null;
        const mimeType = selectedImage ? selectedImage.split(";")[0].split(":")[1] : null;
        setSelectedImage(null);

        if (textareaRef.current) textareaRef.current.style.height = "auto";

        setIsLoading(true);

        const aiMsgId = uuidv4();
        const initialAiMsg: Message = {
            id: aiMsgId,
            role: "assistant",
            content: "",
            urgency: "Low",
            stage: "interview",
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, initialAiMsg]);

        // Create new AbortController
        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            const apiUrl = process.env.NODE_ENV === 'development' ? "http://localhost:8000" : "";
            const response = await fetch(`${apiUrl}/chat/stream`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                signal: controller.signal,
                body: JSON.stringify({
                    message: content,
                    session_id: sessionId,
                    mode: modeOverride || currentMode,
                    image: imageToSend,
                    mime_type: mimeType
                })
            });

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullContent = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });

                // Check for metadata at the end of stream
                if (chunk.includes("METADATA:")) {
                    const parts = chunk.split("METADATA:");
                    const mainText = parts[0];
                    const metadataStr = parts[1];

                    fullContent += mainText;

                    try {
                        const metadata = JSON.parse(metadataStr);
                        setMessages(prev => prev.map(m => m.id === aiMsgId ? {
                            ...m,
                            content: fullContent,
                            urgency: metadata.urgency,
                            stage: metadata.stage,
                            data: metadata.data
                        } : m));

                        if (metadata.stage === "emergency") setIsEmergency(true);
                    } catch (e) {
                        console.error("Metadata parse error", e);
                        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: fullContent } : m));
                    }
                } else {
                    fullContent += chunk;
                    setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: fullContent } : m));
                }
            }

            // Final save to history
            const finalMessages = [...messages, userMsg, { ...initialAiMsg, content: fullContent }];
            saveCurrentSession(finalMessages);

        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log("Generation stopped by user");
            } else {
                console.error("Chat Error:", error);
                setMessages(prev => prev.map(m => m.id === aiMsgId ? {
                    ...m,
                    content: "I'm having trouble connecting to the server. Please check your connection.",
                    urgency: "High"
                } : m));
            }
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    };

    return (
        <main className="flex h-screen w-full bg-deep-bg text-deep-text overflow-hidden relative font-sans">
            <Sidebar
                isOpen={isSidebarOpen}
                toggle={() => setSidebarOpen(false)}
                onNewChat={startNewSession}
                history={history}
                loadSession={loadSession}
                onShowAbout={() => setIsAboutOpen(true)}
                userData={userData}
            />

            <div className={`flex-1 flex flex-col h-full transition-all duration-300 ${isSidebarOpen ? "ml-[260px]" : "ml-0"}`}>

                {!isSidebarOpen && (
                    <div className="absolute top-4 left-4 z-20">
                        <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg text-deep-subtext hover:text-white transition bg-deep-sidebar/50 backdrop-blur">
                            <PanelLeftOpen size={24} />
                        </button>
                    </div>
                )}

                <div className="absolute top-4 right-4 z-20">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-deep-subtext hover:text-white transition bg-deep-sidebar/50 backdrop-blur border border-white/5 hover:bg-white/5"
                    >
                        <LogOut size={14} />
                        <span className="text-xs font-medium">Sign Out</span>
                    </button>
                </div>

                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto flex flex-col items-center custom-scrollbar"
                >
                    {messages.length === 0 ? (
                        // GEMINI-STYLE LANDING
                        <div className="flex-1 flex flex-col justify-center w-full max-w-3xl px-8 animate-fade-in pb-20">

                            <div className="mb-8">
                                <h1 className="text-5xl font-medium mb-2">
                                    <span className="bg-gradient-to-r from-blue-400 via-pink-500 to-red-500 text-transparent bg-clip-text">Hi {userData.name || 'User'}</span>
                                </h1>
                                <h2 className="text-5xl font-medium text-[#444746] tracking-tight">How can I help you?</h2>
                            </div>

                            {/* Suggestion Chips */}
                            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                                <button onClick={() => sendMessage("I have symptoms I want to discuss")} className="flex items-center gap-2 bg-[#1e1f20] hover:bg-[#2a2b2d] px-5 py-3 rounded-xl transition whitespace-nowrap">
                                    <Image src="/logo.png" alt="icon" width={20} height={20} className="opacity-80" />
                                    <span className="text-sm font-medium text-gray-300">Discuss Symptoms</span>
                                </button>
                                <button onClick={() => sendMessage("Help me understand what I’m feeling")} className="flex items-center gap-2 bg-[#1e1f20] hover:bg-[#2a2b2d] px-5 py-3 rounded-xl transition whitespace-nowrap">
                                    <div className="w-5 h-5 rounded bg-green-900/50 flex items-center justify-center"><Lightbulb size={14} className="text-green-400" /></div>
                                    <span className="text-sm font-medium text-gray-300">Understand Feelings</span>
                                </button>
                                <button onClick={() => sendMessage("Can you explain this simply?", "detailed_explanation")} className="flex items-center gap-2 bg-[#1e1f20] hover:bg-[#2a2b2d] px-5 py-3 rounded-xl transition whitespace-nowrap">
                                    <div className="w-5 h-5 rounded bg-purple-900/50 flex items-center justify-center"><Zap size={14} className="text-purple-400" /></div>
                                    <span className="text-sm font-medium text-gray-300">Can you explain this simply?</span>
                                </button>
                            </div>

                        </div>
                    ) : (
                        <div className="w-full max-w-3xl px-4 py-10 pb-40">
                            {messages.map((msg, i) => (
                                <div key={msg.id}>
                                    <MessageBubble message={msg} isLast={i === messages.length - 1} />
                                    {msg.stage === "emergency" && (
                                        <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-4 my-4 flex gap-3 text-red-200 animate-pulse">
                                            <ShieldAlert className="shrink-0" />
                                            <div><p className="font-bold text-sm">EMERGENCY DETECTED</p></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="w-full max-w-3xl px-4 mb-6 flex gap-3 animate-fade-in">
                                    <div className="flex items-center gap-2 text-blue-400">
                                        <Brain size={18} className="animate-pulse" />
                                        <span className="text-sm font-medium text-gray-400 animate-pulse">Thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* GEMINI-STYLE FLOATING INPUT */}
                <div className="w-full flex justify-center pb-8 px-4">
                    <div className={`w-full max-w-[800px] relative bg-[#1e1f20] rounded-[24px] transition-all border border-transparent flex flex-col ${isEmergency ? "opacity-50 pointer-events-none" : ""}`}>

                        {/* Input Textarea */}
                        <div className="flex flex-col p-4">

                            {/* Image Preview */}
                            {selectedImage && (
                                <div className="relative mb-3 w-fit">
                                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10 group">
                                        <Image src={selectedImage} alt="Preview" fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                            <button onClick={clearImage} className="text-white hover:text-red-400">
                                                <X size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                />
                                <div className="mt-1 mr-3 flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 cursor-pointer transition"
                                    onClick={() => fileInputRef.current?.click()}>
                                    <Plus size={20} className="text-gray-400 group-hover:text-white" />
                                </div>

                                <textarea
                                    id="chat-textarea"
                                    ref={textareaRef}
                                    className="flex-1 bg-transparent text-gray-200 placeholder-gray-500 resize-none outline-none text-[16px] leading-6 min-h-[24px] max-h-40 overflow-y-auto custom-scrollbar font-normal"
                                    placeholder="Ask MedGPT"
                                    rows={1}
                                    value={input}
                                    onChange={(e) => {
                                        setInput(e.target.value);
                                        e.target.style.height = "auto";
                                        e.target.style.height = `${e.target.scrollHeight}px`;
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage(input);
                                        }
                                    }}
                                />

                                <div className="mt-1 ml-2 flex flex-col items-center relative">
                                    <div
                                        className={`relative flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 cursor-pointer transition ${isListening ? "text-red-500" : "text-gray-400"}`}
                                        onClick={toggleListening}
                                    >
                                        {/* Volume Visualizer Ring */}
                                        {isListening && (
                                            <div
                                                className="absolute inset-0 rounded-full bg-red-500/20"
                                                style={{ transform: `scale(${1 + (volume / 100) * 1.5})`, transition: 'transform 0.1s ease-out' }}
                                            />
                                        )}
                                        <Mic size={20} className="relative z-10" />
                                    </div>
                                    {sttStatus && sttStatus !== "Listening..." && (
                                        <button
                                            onClick={() => sttStatus === "No sound detected?" && setShowTroubleshooter(true)}
                                            className={`absolute top-10 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border shadow-lg backdrop-blur-sm animate-fade-in transition-colors
                                                ${sttStatus === "No sound detected?"
                                                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 cursor-pointer"
                                                    : "bg-red-500/10 text-red-500 border-red-500/20"
                                                }`}
                                        >
                                            {sttStatus}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Bar within Input */}
                        <div className="flex justify-between items-center px-4 pb-3">
                            <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
                                <div className="relative">
                                    <button onClick={() => { setShowTools(!showTools); setShowFast(false); }} className={`flex items-center gap-1.5 hover:text-white transition ${showTools ? "text-white" : ""}`}>
                                        <Compass size={16} />
                                        Tools
                                    </button>
                                    {showTools && (
                                        <div className="absolute bottom-full mb-2 left-0 bg-[#2a2b2d] border border-white/10 rounded-xl p-2 min-w-[200px] shadow-xl z-50 flex flex-col gap-1">
                                            <button onClick={() => { setShowTools(false); setActiveTool("dictionary"); }} className="text-left px-3 py-2 hover:bg-white/5 rounded text-sm text-gray-200">Medical Dictionary</button>
                                            <button onClick={() => { setShowTools(false); setActiveTool("hospital"); }} className="text-left px-3 py-2 hover:bg-white/5 rounded text-sm text-gray-200">Find Hospitals</button>
                                            <button onClick={() => { setShowTools(false); window.open('/body', '_blank'); }} className="text-left px-3 py-2 hover:bg-white/5 rounded text-sm text-gray-200">Understand Your Body</button>
                                        </div>
                                    )}
                                </div>


                            </div>

                            {isLoading ? (
                                <button
                                    onClick={stopGeneration}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-black hover:bg-gray-200 transition-all duration-200"
                                >
                                    <Square size={16} fill="black" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => sendMessage(input)}
                                    id="send-button"
                                    disabled={!input.trim() || isLoading}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 ${input.trim() && !isLoading ? "bg-white text-black" : "bg-transparent text-gray-600"}`}
                                >
                                    <SendHorizontal size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <p className="pb-6 text-[12px] text-gray-500 font-medium text-center">MedGPT can make mistakes, so double-check it</p>

                {/* --- Tool Modals --- */}
                <ToolModal
                    isOpen={activeTool === "dictionary"}
                    onClose={() => setActiveTool(null)}
                    title="Medical Dictionary"
                    icon={Book}
                    description="Enter a medical term to get a simple, jargon-free definition."
                    placeholder="e.g. Hypertension, Lymph Node, Tachycardia..."
                    onSubmit={(val: string) => sendMessage(`What does '${val}' mean? (Simple Dictionary Definition)`)}
                />

                <ToolModal
                    isOpen={activeTool === "hospital"}
                    onClose={() => setActiveTool(null)}
                    title="Find Nearby Hospitals"
                    icon={MapPin}
                    description="Enter your city or location to see a list of major hospitals and emergency centers."
                    placeholder="e.g. New York, London, Mumbai..."
                    onSubmit={(val: string) => sendMessage(`List major hospitals and emergency centers in ${val}.`, "hospital_search")}
                />

                <AboutModal
                    isOpen={isAboutOpen}
                    onClose={() => setIsAboutOpen(false)}
                />

                {/* --- Troubleshooter Modal --- */}
                <ToolModal
                    isOpen={showTroubleshooter}
                    onClose={() => setShowTroubleshooter(false)}
                    title="Mic Troubleshooter"
                    icon={ShieldAlert}
                    description="It looks like the browser isn't receiving any sound. Please follow these steps: 
                    1. Ensure your physical mic is not muted. 
                    2. Click the 'Lock' icon in the address bar and set Microphone to 'Allow'. 
                    3. Ensure MedGPT has permission in Windows Settings (Privacy > Microphone)."
                    onSubmit={() => { }}
                    placeholder="Steps to fix"
                    inputType="text"
                />

                {/* --- Onboarding / Disclaimer --- */}
                {isOnboarding && (
                    <OnboardingFlow
                        userData={userData}
                        setUserData={setUserData}
                        onComplete={completeOnboarding}
                    />
                )}

            </div>
        </main>
    );
}
