"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ChevronRight, Activity, Brain, Heart, Zap, Shield, Microscope, Sparkles, Droplets, Moon, Sun, Info, X } from "lucide-react";
import Link from "next/link";

// --- Sub-components ---

function InfoModal({ isOpen, onClose, title, content, icon: Icon, color }: any) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-4">
            <div className="bg-[#1e1f20] border border-white/10 w-full max-w-xl rounded-[32px] p-8 shadow-2xl relative animate-fade-in-up">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white transition p-2 hover:bg-white/5 rounded-full">
                    <X size={24} />
                </button>

                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color || 'from-blue-500 to-blue-600'} mb-6 flex items-center justify-center text-white shadow-lg`}>
                    <Icon size={32} />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
                <div className="text-gray-300 leading-relaxed space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar text-[15px]">
                    {content}
                </div>

                <button
                    onClick={onClose}
                    className="w-full mt-8 py-4 rounded-2xl bg-white text-black font-bold text-sm tracking-wide hover:bg-gray-200 transition"
                >
                    Close Discovery
                </button>
            </div>
        </div>
    );
}

export default function UnderstandYourBody() {
    const [scrolled, setScrolled] = useState(false);
    const [activeModal, setActiveModal] = useState<{ title: string, content: React.ReactNode, icon: any, color?: string } | null>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const bodySystems = [
        {
            title: "The Brain",
            icon: Brain,
            color: "from-purple-500 to-blue-500",
            description: "The most complex structure in the universe, managing 86 billion neurons.",
            fact: "The human brain generates 23 watts of electric power—enough to power a light bulb.",
            detailed: (
                <>
                    <p>The human brain is the command center for the entire body. It processes information from our senses, controls our movements, and is the seat of our consciousness, memories, and emotions.</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Cerebrum:</strong> Handles high-level functions like thinking and reasoning.</li>
                        <li><strong>Cerebellum:</strong> Coordinates balance and precise movements.</li>
                        <li><strong>Brainstem:</strong> Controls automatic functions like breathing and heart rate.</li>
                    </ul>
                </>
            )
        },
        {
            title: "Heart & Blood",
            icon: Heart,
            color: "from-red-500 to-rose-600",
            description: "A muscular pump that circulates blood through 60,000 miles of vessels.",
            fact: "Your heart beats about 115,000 times each day to pump 2,000 gallons of blood.",
            detailed: (
                <>
                    <p>The circulatory system moves blood to all parts of the body. Blood delivers oxygen and nutrients to cells and removes waste products like carbon dioxide.</p>
                    <p>Your heart is a double pump: the right side sends blood to the lungs, while the left side sends it to the rest of the body.</p>
                </>
            )
        },
        {
            title: "Immune System",
            icon: Shield,
            color: "from-green-500 to-emerald-600",
            description: "The body's defense network against infections and diseases.",
            fact: "A single sneeze can travel at a speed of 100 miles per hour.",
            detailed: (
                <>
                    <p>Your immune system is a complex network of cells, tissues, and organs. It recognizes foreign invaders like bacteria and viruses and mobilizes to destroy them.</p>
                    <p>Key players: White blood cells, Antibodies, and the Lymphatic system.</p>
                </>
            )
        },
        {
            title: "Skeletal System",
            icon: Activity,
            color: "from-amber-400 to-orange-500",
            description: "The framework of 206 bones that protects organs and allows movement.",
            fact: "Bones are stronger than steel. A block of bone the size of a matchbox can support 9 tons.",
            detailed: (
                <>
                    <p>Bones provide structure, protect organs, and anchor muscles. They also store minerals like calcium and produce blood cells in the bone marrow.</p>
                    <p>Interesting fact: Babies are born with about 270 bones, but many fuse together as they grow, leaving adults with 206.</p>
                </>
            )
        },
        {
            title: "Metabolism",
            icon: Zap,
            color: "from-blue-400 to-cyan-500",
            description: "The chemical processes that occur within a living organism to maintain life.",
            fact: "Muscle burns more calories than fat, even when you are at rest.",
            detailed: (
                <>
                    <p>Metabolism is the process by which your body converts what you eat and drink into energy. Even at rest, your body needs energy for breathing, circulating blood, and repairing cells.</p>
                    <p>This "basal metabolic rate" accounts for 60% to 75% of the calories you burn daily.</p>
                </>
            )
        }
    ];

    const interestingFacts = [
        "The human eye can distinguish approximately 10 million different colors.",
        "Your nose can remember 50,000 different scents.",
        "A person breathes roughly 11,000 liters of air every day.",
        "The small intestine is about 20 feet long (6 meters).",
        "Humans are the only species known to blush."
    ];

    const openGeneralFacts = () => {
        setActiveModal({
            title: "Fascinating Human Facts",
            icon: Sparkles,
            color: "from-indigo-500 to-purple-600",
            content: (
                <div className="space-y-4">
                    <p>Did you know? Humans are biological marvels. Here are some extra deep dives:</p>
                    <div className="grid grid-cols-1 gap-3">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 font-medium">Humans are about 1cm taller in the morning than in the evening due to cartilage compression.</div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 font-medium">Your mouth produces enough saliva in a lifetime to fill two swimming pools.</div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 font-medium">An adult human is made of approximately 7 octillion atoms.</div>
                    </div>
                </div>
            )
        });
    };

    const openHydration = () => {
        setActiveModal({
            title: "Hydration Wisdom",
            icon: Droplets,
            color: "from-cyan-500 to-blue-600",
            content: (
                <div className="space-y-4">
                    <p>Up to 60% of the human adult body is water. Understanding hydration is key to performance.</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Brain Function:</strong> Even 2% dehydration can lead to memory loss and trouble focusing.</li>
                        <li><strong>Joint Health:</strong> Cartilage is about 80% water; staying hydrated keeps joints lubricated.</li>
                        <li><strong>Energy Levels:</strong> Dehydration is one of the most common causes of daytime fatigue.</li>
                    </ul>
                </div>
            )
        });
    };

    const openSleep = () => {
        setActiveModal({
            title: "The Science of Sleep",
            icon: Moon,
            color: "from-indigo-600 to-blue-900",
            content: (
                <div className="space-y-4">
                    <p>Sleep is when your body undergoes its most critical "software updates."</p>
                    <div className="space-y-3">
                        <div className="p-3 bg-white/5 rounded-lg border-l-4 border-blue-500">
                            <strong>Glymphatic Clearing:</strong> While you sleep, your brain literally flushes out metabolic waste (toxins).
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg border-l-4 border-purple-500">
                            <strong>Memory Consolidation:</strong> Your brain organizes and stores information from the day during REM sleep.
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg border-l-4 border-green-500">
                            <strong>Physical Repair:</strong> Growth hormones are released, repairing tissues and strengthening the immune system.
                        </div>
                    </div>
                </div>
            )
        });
    };

    const openAtlas = () => {
        setActiveModal({
            title: "3D Body Atlas",
            icon: Activity,
            color: "from-amber-500 to-orange-600",
            content: (
                <div className="text-center p-4">
                    <div className="w-24 h-24 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <Activity size={48} className="text-orange-400" />
                    </div>
                    <p className="text-lg font-bold mb-2">Interactive Atlas Loading...</p>
                    <p className="text-sm text-gray-400">Our high-fidelity 3D human model is an experimental feature showing anatomical structures in real-time. Please stay tuned for the full release!</p>
                </div>
            )
        });
    };

    const openSystemList = () => {
        setActiveModal({
            title: "Body Systems Explorer",
            icon: Microscope,
            color: "from-blue-500 to-indigo-600",
            content: (
                <div className="space-y-4">
                    <p>Your body is composed of several major systems working in perfect harmony:</p>
                    <div className="grid grid-cols-2 gap-3 text-sm font-medium">
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5">Digestive System</div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5">Nervous System</div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5">Respiratory System</div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5">Circulatory System</div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5">Endocrine System</div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5">Integumentary System</div>
                    </div>
                </div>
            )
        });
    };

    return (
        <div className="min-h-screen bg-[#131314] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden overflow-y-auto w-full">
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                }
                .glass {
                    background: rgba(30, 31, 32, 0.7);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .card-glow:hover {
                    box-shadow: 0 0 30px rgba(59, 130, 246, 0.15);
                    border-color: rgba(59, 130, 246, 0.3);
                }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}} />

            <InfoModal
                isOpen={!!activeModal}
                onClose={() => setActiveModal(null)}
                {...activeModal}
            />

            {/* Navigation Header */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "glass py-3" : "bg-transparent py-6"}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl font-semibold tracking-tight">Understand Your Body</h1>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-400 font-medium">
                        <span onClick={openSystemList} className="hover:text-blue-400 cursor-pointer transition">Systems</span>
                        <span onClick={openGeneralFacts} className="hover:text-blue-400 cursor-pointer transition">Facts</span>
                        <span onClick={openAtlas} className="hover:text-blue-400 cursor-pointer transition">Diagnostics</span>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
                <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                        <Sparkles size={14} />
                        Human Anatomy Guide
                    </div>
                    <h2 className="text-6xl font-bold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent mb-6">
                        The Masterpiece of <br /> Natural Evolution
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Explore the intricate systems that make you unique. From the neurons firing in your brain to the blood flowing in your veins, every part of your body tells a story.
                    </p>
                </div>
            </section>

            {/* Body Systems Grid */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h3 className="text-2xl font-bold text-white">Vital Systems</h3>
                        <p className="text-gray-400 text-sm mt-1">Detailed overview of your physiological framework</p>
                    </div>
                    <button onClick={openAtlas} className="text-sm font-medium text-blue-400 hover:text-blue-300 transition flex items-center gap-1 group">
                        View Atlas <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bodySystems.map((system, idx) => (
                        <div
                            key={system.title}
                            onClick={() => setActiveModal({ title: system.title, content: system.detailed, icon: system.icon, color: system.color })}
                            className="glass p-8 rounded-[28px] card-glow transition-all duration-300 group hover:-translate-y-2 animate-fade-in-up cursor-pointer"
                            style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${system.color} mb-6 flex items-center justify-center text-white shadow-lg`}>
                                <system.icon size={28} />
                            </div>
                            <h4 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{system.title}</h4>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                {system.description}
                            </p>
                            <div className="pt-6 border-t border-white/5">
                                <p className="text-[11px] text-gray-500 uppercase tracking-widest font-bold mb-2">Interesting Fact</p>
                                <p className="text-sm text-gray-300 italic">
                                    "{system.fact}"
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Facts and Stats Carousel Placeholder */}
            <section className="py-20 bg-[#171719]/50 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="flex-1 space-y-8">
                            <h3 className="text-4xl font-bold leading-tight">
                                Astonishing Facts <br />
                                <span className="text-blue-500">About You</span>
                            </h3>
                            <div className="space-y-4">
                                {interestingFacts.map((fact, i) => (
                                    <div
                                        key={i}
                                        onClick={openGeneralFacts}
                                        className="flex gap-4 items-start p-4 hover:bg-white/5 rounded-2xl transition group animate-fade-in-up cursor-pointer"
                                        style={{ animationDelay: `${i * 0.1}s` }}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all shrink-0">
                                            {i + 1}
                                        </div>
                                        <p className="text-gray-400 group-hover:text-white transition-colors">{fact}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 w-full max-w-md">
                            <div className="glass aspect-[4/5] rounded-[40px] p-8 flex flex-col justify-between overflow-hidden relative">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 blur-[60px] rounded-full" />
                                <div className="space-y-4 text-center">
                                    <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Microscope size={36} className="text-blue-400" />
                                    </div>
                                    <p className="text-xs text-blue-400 font-bold uppercase tracking-[0.2em]">Micro-Diagnostics</p>
                                    <h4 className="text-2xl font-bold">DNA Complexity</h4>
                                    <p className="text-sm text-gray-400 px-6">If uncoiled, the DNA in all your cells would reach the sun and back 60 times.</p>
                                </div>
                                <div className="bg-white/5 border border-white/5 rounded-3xl p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                                            <Zap size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xl font-bold text-white">4.5 Gb</p>
                                            <p className="text-[10px] text-gray-500">Biological Data per hr</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="text-gray-600" onClick={openAtlas} className="cursor-pointer" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive Features */}
            <section className="max-w-7xl mx-auto px-6 py-32">
                <div className="text-center mb-16">
                    <h3 className="text-3xl font-bold">Health Utilities</h3>
                    <p className="text-gray-400">Experimental tools for body awareness</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 sm:px-0">
                    <div className="glass p-1 rounded-[32px] overflow-hidden group">
                        <div className="bg-[#1e1f20] rounded-[31px] p-8 h-full flex flex-col justify-between transition group-hover:bg-transparent">
                            <div className="flex justify-between items-start mb-12">
                                <div className="p-4 bg-cyan-500/10 rounded-2xl text-cyan-400 border border-cyan-500/20">
                                    <Droplets size={24} />
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold">70%</p>
                                    <p className="text-xs text-gray-500">Optimal Hydration</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold mb-2">Hydration Wisdom</h4>
                                <p className="text-gray-400 text-sm mb-6">Even mild dehydration can impair your mood, memory, and brain performance.</p>
                                <button onClick={openHydration} className="w-full py-4 rounded-2xl bg-cyan-600/10 text-cyan-400 border border-cyan-500/20 font-bold text-sm tracking-wide hover:bg-cyan-600 hover:text-white transition">Check Hydration Stats</button>
                            </div>
                        </div>
                    </div>

                    <div className="glass p-1 rounded-[32px] overflow-hidden group">
                        <div className="bg-[#1e1f20] rounded-[31px] p-8 h-full flex flex-col justify-between transition group-hover:bg-transparent">
                            <div className="flex justify-between items-start mb-12">
                                <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/20">
                                    <Moon size={24} />
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold">8h</p>
                                    <p className="text-xs text-gray-500">Sleep Goal</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold mb-2">The Power of Rest</h4>
                                <p className="text-gray-400 text-sm mb-6">While you sleep, your brain clears out toxins and processes information from the day.</p>
                                <button onClick={openSleep} className="w-full py-4 rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 font-bold text-sm tracking-wide hover:bg-indigo-600 hover:text-white transition">Explore Sleep Science</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-white/5 bg-black/20">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-3 opacity-50">
                        <div className="w-10 h-10 flex items-center justify-center filter invert brightness-100 grayscale transition-all hover:grayscale-0">
                            <img src="/sidebar_logo.png" alt="MedGPT" className="w-full h-full object-contain" />
                        </div>
                        <span className="font-serif font-bold text-xl">MedGPT</span>
                    </div>
                    <div className="flex gap-10 text-xs text-gray-500 uppercase tracking-[0.3em] font-bold">
                        <span onClick={openSystemList} className="hover:text-white cursor-pointer transition">Anatomy</span>
                        <span onClick={openGeneralFacts} className="hover:text-white cursor-pointer transition">Biology</span>
                        <span onClick={openAtlas} className="hover:text-white cursor-pointer transition">Ethics</span>
                    </div>
                    <p className="text-xs text-gray-500">© 2025 MedGPT Human Anatomy Research</p>
                </div>
            </footer>
        </div>
    );
}
