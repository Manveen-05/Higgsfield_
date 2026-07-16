import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { GrainyVideoCarousel } from "../components/Video";
import { Button } from "../components/ui/button";
import { 
  ArrowRight, 
  ChevronLeft,
  ChevronRight,
  User,
  Volume2,
  Tv,
  Check,
  MousePointer,
  X,
  Upload
} from "lucide-react";

// Real SVG Logos for capabilities feature cards
const HiggsfieldLogo = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#a3e635" />
    <path d="M7 6v12h3v-4.5h4V18h3V6h-3v4.5h-4V6H7z" fill="#09090b" />
  </svg>
);

const GoogleLogo = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

const GeminiLogo = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
    <path d="M12 2a1 1 0 00-1 1c0 4.418-3.582 8-8 8a1 1 0 000 2c4.418 0 8 3.582 8 8a1 1 0 002 0c0-4.418 3.582-8 8-8a1 1 0 000-2c-4.418 0-8-3.582-8-8a1 1 0 00-1-1z" fill="url(#gemini-sparkle-grad)" />
    <path d="M19 5a0.5 0 00-0.5 0.5c0 1.657-1.343 3-3 3a0.5 0 000 1c1.657 0 3 1.343 3 3a0.5 0 001 0c0-1.657 1.343-3 3-3a0.5 0 000-1c-1.657 0-3-1.343-3-3A0.5 0 0019 5z" fill="url(#gemini-sparkle-grad)" opacity="0.8" />
    <defs>
      <linearGradient id="gemini-sparkle-grad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8AB4F8" />
        <stop offset="1" stopColor="#C2E7FF" />
      </linearGradient>
    </defs>
  </svg>
);

const ClaudeLogo = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#E08B5C" />
    <path d="M8 8.5c0-.828.672-1.5 1.5-1.5h5c.828 0 1.5.672 1.5 1.5v7c0 .828-.672 1.5-1.5 1.5h-5c-.828 0-1.5-.672-1.5-1.5v-7z" fill="#3D3430" />
    <circle cx="10.5" cy="11" r="0.75" fill="#FFFFFF" />
    <circle cx="13.5" cy="11" r="0.75" fill="#FFFFFF" />
    <path d="M10 14h4" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />
  </svg>
);

const SeedanceLogo = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="#a3e635" strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3a9 9 0 016.36 15.36M12 21a9 9 0 01-6.36-15.36" />
    <circle cx="12" cy="12" r="3" fill="#a3e635" />
  </svg>
);

const CinemaLogo = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
    <path d="M23 7l-7 5 7 5V7z" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    <circle cx="5" cy="10" r="1" fill="#a3e635" />
    <circle cx="9" cy="10" r="1" fill="#a3e635" />
  </svg>
);

// Original horizontal video links
const VIDEOS = [
  { url: "https://cdn.higgsfield.ai/card/e74330e3-39d7-470b-817a-483cce45c255.mp4", title: "Unlimited Seedance", prompt: "A cinematic loop showing a creative container box falling by parachute." },
  { url: "https://cdn.higgsfield.ai/card/7f5704c9-77bd-416a-8d7f-8f7e8baf6a21.mp4", title: "Visual Posing", prompt: "A stylized girl in a pink dress posing on a city street, color wheel editor overlay." },
  { url: "https://cdn.higgsfield.ai/job_set_chain_preset/d06fe04e-9a74-4ef3-94f3-a8a9916ba249.mp4", title: "Drift Racing Red Car", prompt: "A close-up shot of a red car drifting sideways at night with smoke billowing from tires." }
];

// Registering all 16 CDN videos provided by the user
const VIDEOS_LIST = [
  "https://cdn.higgsfield.ai/job_set_chain_preset/d06fe04e-9a74-4ef3-94f3-a8a9916ba249.mp4",
  "https://cdn.higgsfield.ai/job_set_chain_preset/06c6fff7-3244-42be-b0ba-ac26919f4143.mp4",
  "https://cdn.higgsfield.ai/job_set_chain_preset/508c2da7-2f1d-4109-8090-d300feac8c73.mp4",
  "https://cdn.higgsfield.ai/job_set_chain_preset/9342e910-75cf-4df5-aaec-379cbb9eaa73.mp4",
  "https://cdn.higgsfield.ai/job_set_chain_preset/af43f527-9aef-455d-85c2-56e96ef5dbcd.mp4",
  "https://cdn.higgsfield.ai/job_set_chain_preset/8e7f6c7c-7ef3-40f2-aefa-39dc216fa94a.mp4",
  "https://cdn.higgsfield.ai/job_set_chain_preset/f06e8c62-8805-4485-9747-ee3fd190ede9.mp4",
  "https://cdn.higgsfield.ai/job_set_chain_preset/4ce95288-d551-489d-879c-f4ff4ad678e3.mp4",
  "https://cdn.higgsfield.ai/superhero-gen-preset/73b1818b-3f2d-495f-9a10-e9cd565b18ea.mp4",
  "https://cdn.higgsfield.ai/superhero-gen-preset/dbb3da84-bc3d-481d-a535-556e84c1f7f6.mp4",
  "https://cdn.higgsfield.ai/superhero-gen-preset/6b1f33ae-23c3-4ee7-a419-ebe6af659b0d.mp4",
  "https://cdn.higgsfield.ai/job_set_chain_preset/ad89a601-bdb8-42d1-aab9-662e904cd208.mp4",
  "https://higgsfield.ai/academy/incubator-hero.mp4",
  "https://static.higgsfield.ai/feed/step-3.mp4",
  "https://d8j0ntlcm91z4.cloudfront.net/user_3CIjqzTsrKEUr8OzFBaYO4ux3nG/hf_20260413_121933_7dfa9582-a536-4a83-9041-ee5aa102ff8c.mp4",
  "https://cdn.higgsfield.ai/user_3AvFCf0aoS6DTSHhwoX3QgsDzIR/hf_20260409_094601_f698d8f7-c96a-42c6-ad0c-8e830417201e_min.mp4"
];

// Single global source of truth for individual video prompts matching the CDN list indexes
const VIDEO_PROMPTS = [
  "A close-up shot of a red car drifting sideways at night with smoke billowing from its tires.", // 0 (Red car drifting)
  "A wireframe CGI model inside animation software showing rigging nodes, joints, and motion track channels.", // 1 (CGI rigging)
  "A close-up of a man holding a motorcycle helmet under a street lamp with a neon blue circular hologram overlay.", // 2 (Hologram helmet)
  "A giant hand touching/covering the globe of Earth from space with realistic stars and atmospheric glare.", // 3 (Giant hand)
  "A model in a dark dress walking out of a building entrance flanked by security guards and flashing cameras.", // 4 (Paparazzi entry)
  "A high-fidelity close-up of a young spiky-haired anime character looking forward with neon-lit details.", // 5 (Anime face)
  "A sketch-style animation of a young girl holding a glowing flashlight and walking through a dark space.", // 6 (Monochrome flashlight)
  "An astronaut walking slowly past a parked formula race car on a professional racetrack under stadium lights.", // 7 (Astronaut formula car)
  "A fantasy gothic/medieval castle built on volcanic rock cliffs with detailed glowing lava flows.", // 8 (Lava castle)
  "Two martial artists sparring in a concrete industrial warehouse setting, demonstrating precise choreography.", // 9 (Warehouse fight)
  "A high-speed camera motion zooming through a glowing blue digital particle tunnel with circular light arrays.", // 10 (Digital particle tunnel)
  "A video game start menu screen featuring a white-haired anime girl holding a weapon under interactive options.", // 11 (Game menu)
  "A red-haired girl wearing glowing headphones and round glasses, floating peacefully in outer space.", // 12 (Space girl)
  "A fast motion-blurred tracking shot gliding down a busy neon-lit city street at night.", // 13 (Motion city street)
  "A woman holding a light-purple tumbler cup, showing detailed hand garment textures and facial expressions.", // 14 (Purple tumbler cup)
  "A red-haired character casting blue energy blast at a massive magma/lava rock monster on a broken street." // 15 (Girl vs lava monster)
];

interface PresetItem {
  id: string;
  name: string;
  videos: { url: string; filter: string; prompt: string }[];
}

const PRESETS: PresetItem[] = [
  {
    id: "drift",
    name: "DRIFT CARS",
    videos: [
      { url: VIDEOS_LIST[0], filter: "contrast-110 brightness-105", prompt: VIDEO_PROMPTS[0] },
      { url: VIDEOS_LIST[7], filter: "contrast-115", prompt: VIDEO_PROMPTS[7] },
      { url: VIDEOS_LIST[13], filter: "saturate-125", prompt: VIDEO_PROMPTS[13] },
      { url: VIDEOS_LIST[10], filter: "brightness-105", prompt: VIDEO_PROMPTS[10] },
      { url: VIDEOS_LIST[0], filter: "contrast-105", prompt: VIDEO_PROMPTS[0] }
    ]
  },
  {
    id: "cgi",
    name: "CGI & RIGGING",
    videos: [
      { url: VIDEOS_LIST[1], filter: "saturate-200 contrast-125 brightness-95", prompt: VIDEO_PROMPTS[1] },
      { url: VIDEOS_LIST[2], filter: "saturate-175 contrast-120", prompt: VIDEO_PROMPTS[2] },
      { url: VIDEOS_LIST[6], filter: "saturate-200 contrast-130", prompt: VIDEO_PROMPTS[6] },
      { url: VIDEOS_LIST[10], filter: "saturate-150 contrast-115", prompt: VIDEO_PROMPTS[10] },
      { url: VIDEOS_LIST[1], filter: "saturate-180 contrast-120", prompt: VIDEO_PROMPTS[1] }
    ]
  },
  {
    id: "scifi",
    name: "SCI-FI & FANTASY",
    videos: [
      { url: VIDEOS_LIST[7], filter: "invert grayscale contrast-200 opacity-80", prompt: VIDEO_PROMPTS[7] },
      { url: VIDEOS_LIST[8], filter: "grayscale brightness-90 contrast-150", prompt: VIDEO_PROMPTS[8] },
      { url: VIDEOS_LIST[12], filter: "invert grayscale brightness-125 opacity-70", prompt: VIDEO_PROMPTS[12] },
      { url: VIDEOS_LIST[3], filter: "grayscale sepia opacity-90", prompt: VIDEO_PROMPTS[3] },
      { url: VIDEOS_LIST[12], filter: "invert grayscale contrast-200 opacity-80", prompt: VIDEO_PROMPTS[12] }
    ]
  },
  {
    id: "anime",
    name: "ANIME SHOWCASE",
    videos: [
      { url: VIDEOS_LIST[5], filter: "hue-rotate-[180deg] saturate-125", prompt: VIDEO_PROMPTS[5] },
      { url: VIDEOS_LIST[11], filter: "hue-rotate-[190deg] brightness-105", prompt: VIDEO_PROMPTS[11] },
      { url: VIDEOS_LIST[6], filter: "hue-rotate-[170deg] contrast-110", prompt: VIDEO_PROMPTS[6] },
      { url: VIDEOS_LIST[5], filter: "hue-rotate-[180deg] saturate-150", prompt: VIDEO_PROMPTS[5] },
      { url: VIDEOS_LIST[11], filter: "hue-rotate-[200deg]", prompt: VIDEO_PROMPTS[11] }
    ]
  },
  {
    id: "action",
    name: "ACTION CINEMA",
    videos: [
      { url: VIDEOS_LIST[9], filter: "sepia saturate-150 hue-rotate-[10deg] brightness-110", prompt: VIDEO_PROMPTS[9] },
      { url: VIDEOS_LIST[15], filter: "sepia saturate-125 hue-rotate-[5deg]", prompt: VIDEO_PROMPTS[15] },
      { url: VIDEOS_LIST[4], filter: "sepia saturate-160 hue-rotate-[15deg] contrast-95", prompt: VIDEO_PROMPTS[4] },
      { url: VIDEOS_LIST[9], filter: "sepia saturate-140 hue-rotate-[10deg]", prompt: VIDEO_PROMPTS[9] },
      { url: VIDEOS_LIST[15], filter: "sepia saturate-135 hue-rotate-[8deg] brightness-105", prompt: VIDEO_PROMPTS[15] }
    ]
  }
];

interface Project {
  id: string;
  title: string;
  author: string;
  videoUrl: string;
  prompt: string;
}

const PROJECTS: Project[] = [
  {
    id: "p-1",
    title: "Gothic Lava Castle Breakdown",
    author: "adilint",
    videoUrl: VIDEOS_LIST[8],
    prompt: "A fantasy gothic castle built on volcanic rock cliffs with detailed glowing lava flows."
  },
  {
    id: "p-2",
    title: "Anime Neon character close-up",
    author: "Claude",
    videoUrl: VIDEOS_LIST[5],
    prompt: "A high-fidelity close-up of a young spiky-haired anime character looking forward with neon-lit details."
  },
  {
    id: "p-3",
    title: "High speed digital particle tunnel",
    author: "Higgsfield Creative",
    videoUrl: VIDEOS_LIST[10],
    prompt: "A high-speed camera motion zooming through a glowing blue digital particle tunnel with circular light arrays."
  },
  {
    id: "p-4",
    title: "Dojo combat - Heads Drop",
    author: "Higgsfield Creative",
    videoUrl: VIDEOS_LIST[15],
    prompt: "A red-haired character casting blue energy blast at a massive magma/lava rock monster on a broken street."
  }
];

interface ModalState {
  videoUrl: string;
  title: string;
  prompt: string;
}

export function LandingPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePreset, setActivePreset] = useState<PresetItem>(PRESETS[0]);
  
  // Remix Modal State
  const [modalData, setModalData] = useState<ModalState | null>(null);
  const [activeRatio, setActiveRatio] = useState<"16:9" | "1:1" | "9:16">("16:9");

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("username"));
  }, []);

  const handleCTA = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  const handleNextPreset = () => {
    const currentIndex = PRESETS.findIndex((p) => p.id === activePreset.id);
    const nextIndex = (currentIndex + 1) % PRESETS.length;
    setActivePreset(PRESETS[nextIndex]);
  };

  const handlePrevPreset = () => {
    const currentIndex = PRESETS.findIndex((p) => p.id === activePreset.id);
    const prevIndex = (currentIndex - 1 + PRESETS.length) % PRESETS.length;
    setActivePreset(PRESETS[prevIndex]);
  };

  const openModal = (videoUrl: string, title: string, prompt: string) => {
    setModalData({ videoUrl, title, prompt });
  };

  const closeModal = () => {
    setModalData(null);
  };

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen selection:bg-white/10 selection:text-white font-sans relative">
      
      {/* Infinite Video Showcase */}
      <div className="pt-2 border-b border-zinc-900 bg-gradient-to-b from-black to-zinc-950">
        <GrainyVideoCarousel 
          videos={VIDEOS.map((v) => ({ url: v.url, title: v.title }))} 
          height={250} 
          cardWidth={330} 
          fadeColor="#09090b" 
          onVideoClick={(url) => {
            const matched = VIDEOS.find(v => v.url === url);
            if (matched) {
              openModal(matched.url, matched.title, matched.prompt);
            }
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-16 max-w-6xl mx-auto text-center overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lime-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter uppercase leading-none">
            Direct the <span className="bg-clip-text text-transparent bg-gradient-to-r from-lime-400 to-emerald-400">Scene.</span>
            <br />
            Define the <span className="text-white font-black">Motion.</span>
          </h1>

          <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={handleCTA}
              className="bg-white hover:bg-zinc-200 text-black font-semibold h-12 px-8 rounded-full shadow-lg shadow-white/5 flex items-center gap-2 group transition-all duration-300 cursor-pointer"
            >
              <span>{isLoggedIn ? "Open Studio" : "Start Directing"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => openModal(VIDEOS_LIST[12], "Cinematic Reel", "A compilation showcase of the highest fidelity directable motion sequences generated on the Veo engine.")}
              className="bg-transparent border-zinc-800 text-zinc-300 hover:bg-zinc-900/60 hover:text-white h-12 px-8 rounded-full transition-all duration-300 cursor-pointer"
            >
              Watch Reel
            </Button>
          </div>
        </div>
      </section>

      {/* Supercomputer glowing Lime/Green section */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <div className="relative rounded-3xl border-2 border-lime-400 bg-zinc-950 p-8 md:p-12 overflow-hidden shadow-[0_0_60px_-10px_rgba(163,230,53,0.25)] flex flex-col items-center justify-center min-h-[420px]">
          
          {/* Tech Grid Background inside the box */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none" 
            style={{
              backgroundImage: `radial-gradient(circle, rgba(163,230,53,0.15) 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}
          />

          {/* Floating UI Elements on Large Screens */}
          <div className="hidden lg:block">
            {/* UGC Creator Card (Left) */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 w-64 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-2xl backdrop-blur-sm space-y-4">
              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  UGC Creator
                </span>
                <span>● 2/2</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="aspect-[3/4] bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-[3/4] bg-zinc-800 rounded-lg overflow-hidden border border-lime-400/80 ring-2 ring-lime-400/30">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-[3/4] bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex justify-center">
                <span className="bg-zinc-850 px-3 py-1 rounded-full border border-zinc-700/80 text-[10px] font-mono flex items-center gap-1 text-zinc-300">
                  <Check className="w-3 h-3 text-lime-400" />
                  UGC
                </span>
              </div>
            </div>

            {/* Marketing Card (Right Top) */}
            <div className="absolute right-8 top-10 w-64 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-2xl backdrop-blur-sm space-y-3">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
                <Volume2 className="w-3.5 h-3.5" />
                Marketing
              </div>
              <div className="flex items-center gap-2 border-t border-zinc-800 pt-2">
                <div className="w-6 h-6 rounded-full bg-lime-500" />
                <div className="text-[10px]">
                  <div className="font-bold text-white flex items-center gap-1">
                    Ms. Higgs
                    <span className="w-2.5 h-2.5 bg-lime-500 rounded-full flex items-center justify-center text-[6px] text-zinc-950 font-bold">✓</span>
                  </div>
                  <div className="text-zinc-500 text-[8px]">480M subscribers • 970 videos</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <div className="aspect-[4/3] bg-zinc-855 rounded border border-zinc-800 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=100&q=80" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-[4/3] bg-zinc-850 rounded border border-zinc-800 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&w=100&q=80" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Cursor Visualizing Badge */}
              <div className="absolute -left-12 bottom-6 bg-white text-zinc-950 font-bold px-3 py-1 rounded-full border border-zinc-300 text-[10px] flex items-center gap-1 shadow-lg pointer-events-none select-none">
                <MousePointer className="w-3 h-3 rotate-[-90deg] fill-current" />
                Visualizing
              </div>

              {/* Analyzing Hooks Badge */}
              <div className="absolute -left-4 -bottom-4 bg-lime-400 text-zinc-950 font-bold px-3 py-1 rounded-full text-[10px] shadow-lg pointer-events-none select-none">
                Analyzing hooks
              </div>
            </div>

            {/* Production Card (Right Bottom) */}
            <div className="absolute right-24 bottom-6 w-56 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-2xl backdrop-blur-sm space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
                <Tv className="w-3.5 h-3.5" />
                Production
              </div>
              <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500 border-t border-zinc-800 pt-1.5">
                <span>Scene 04 Skatepark</span>
                <span>11 shots</span>
              </div>
              <div className="grid grid-cols-2 gap-1 pt-1">
                <div className="aspect-video bg-zinc-800 rounded overflow-hidden">
                  <video src="https://cdn.higgsfield.ai/card/7f5704c9-77bd-416a-8d7f-8f7e8baf6a21.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
                </div>
                <div className="aspect-video bg-zinc-800 rounded overflow-hidden">
                  <video src="https://cdn.higgsfield.ai/card/e74330e3-39d7-470b-817a-483cce45c255.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>

          {/* Central content */}
          <div className="relative z-10 text-center space-y-6 max-w-lg mx-auto flex flex-col items-center">
            
            {/* Apps/Features Floating Row */}
            <div className="flex gap-2 justify-center items-center pb-2">
              <div className="w-9 h-9 rounded-xl bg-lime-600 flex items-center justify-center text-sm shadow-md">🎬</div>
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-sm shadow-md">✈️</div>
              <div className="w-9 h-9 rounded-xl bg-lime-700 flex items-center justify-center text-sm shadow-md">👩‍🎨</div>
              
              {/* Central Higgsfield green emblem */}
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-lg shadow-xl relative scale-110">
                <span className="text-lime-400 font-extrabold text-2xl tracking-tighter">S</span>
              </div>
              
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-sm shadow-md">🌌</div>
              <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-sm shadow-md">🎮</div>
            </div>

            <div className="space-y-2">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-lime-400 uppercase">
                SUPERCOMPUTER
              </h2>
              <p className="text-zinc-400 text-sm md:text-base font-medium">
                One superagent for your entire creative stack
              </p>
            </div>

            <Button
              onClick={handleCTA}
              className="bg-white hover:bg-zinc-200 text-black font-semibold h-11 px-8 rounded-full shadow-lg transition-all cursor-pointer text-xs"
            >
              Try Supercomputer
            </Button>
          </div>

        </div>
      </section>

      {/* Higgsfield Viral Presets Section with looping portrait video gallery */}
      <section className="px-6 py-12 max-w-6xl mx-auto space-y-8">
        
        {/* Header block */}
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-lime-400 uppercase tracking-tight">
            HIGGSFIELD VIRAL PRESETS
          </h2>
          <p className="text-zinc-500 text-sm">
            Big-budget visual effects, from explosions to surreal transformations.
          </p>
        </div>

        {/* Scrollable list of categories */}
        <div className="flex items-center gap-4 border-t border-zinc-900 pt-6">
          <div className="flex-1 overflow-x-auto no-scrollbar scroll-smooth flex gap-3 pb-2">
            {PRESETS.map((preset) => {
              const isActive = activePreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => setActivePreset(preset)}
                  className={`flex-shrink-0 font-mono text-[10px] tracking-wider px-4 py-2.5 rounded-full transition-all cursor-pointer uppercase ${
                    isActive 
                      ? "bg-lime-400 text-zinc-950 border border-lime-400 font-bold" 
                      : "bg-transparent border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white"
                  }`}
                >
                  {preset.name}
                </button>
              );
            })}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-2">
            <button 
              onClick={handlePrevPreset}
              className="w-9 h-9 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={handleNextPreset}
              className="w-9 h-9 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Portrait Video Deck Grid - matching reference layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-2">
          {activePreset.videos.map((vid, idx) => (
            <div 
              key={`${activePreset.id}-vid-${idx}`}
              onClick={() => openModal(vid.url, activePreset.name, vid.prompt)}
              className="relative aspect-[9/16] bg-zinc-900 border border-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:border-zinc-800 transition-all duration-300 group cursor-pointer"
            >
              <video
                src={vid.url}
                autoPlay
                loop
                muted
                playsInline
                className={`w-full h-full object-cover transition-all duration-500 ${vid.filter}`}
              />

              {/* Bottom tag identifier */}
              <div className="absolute bottom-3 inset-x-3 p-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/5 text-[8px] font-mono text-zinc-400 tracking-wider text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                CHANNEL_0{idx + 1} // {activePreset.name.split(" ")[0]}
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* Upgraded layout (Third Image Integration) replacing old gallery text areas */}
      <section className="px-6 py-12 max-w-6xl mx-auto space-y-16 border-t border-zinc-900/50">
        
        {/* Sign Up Banner and 6 Capabilities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Sign Up and Discount Banner (Left) - styled green/black gradient */}
          <div className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-emerald-950/30 via-zinc-900/50 to-zinc-950 border border-lime-500/25 p-8 flex flex-col justify-between relative overflow-hidden group shadow-xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-lime-500/10 blur-[60px] rounded-full pointer-events-none" />
            
            <div className="space-y-4">
              <span className="inline-block bg-lime-400/10 border border-lime-400/30 text-lime-400 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
                Extra Discount
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight leading-none text-white">
                SIGN UP AND GET <br />
                YOUR <span className="text-lime-400 font-extrabold">EXTRA DISCOUNT</span>
              </h2>
              <p className="text-zinc-400 text-xs font-light">
                Create an account and unlock additional discount benefits across visual generations.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden border border-zinc-800">
                <video src={VIDEOS_LIST[15]} autoPlay loop muted playsInline className="w-full h-full object-cover" />
              </div>
              <Button 
                onClick={handleCTA}
                className="bg-white hover:bg-zinc-200 text-zinc-950 font-bold h-11 w-full rounded-xl transition-all text-xs cursor-pointer"
              >
                Sign up and get your discount
              </Button>
            </div>
          </div>

          {/* 6 Capabilities Feature Grid (Right) - Font and icon colors set to green/white */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Card 1: Higgsfield Academy */}
            <div className="bg-zinc-900/40 hover:bg-zinc-900/60 border border-zinc-900 hover:border-zinc-800 rounded-2xl p-6 transition-all flex flex-col justify-between relative group">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <HiggsfieldLogo />
                  <span className="bg-lime-400/10 border border-lime-400/20 text-lime-400 text-[8px] font-bold px-2 py-0.5 rounded-full">LEARN FOR FREE</span>
                </div>
                <h3 className="text-sm font-bold text-white tracking-wide">Higgsfield Academy</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Generate and learn how to use Higgsfield with tutorials.
                </p>
              </div>
              <div className="pt-4 flex justify-between items-center text-[10px] text-zinc-400 group-hover:text-white transition-colors">
                <span>Go to academy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 2: Nano Banana Pro */}
            <div className="bg-zinc-900/40 hover:bg-zinc-900/60 border border-zinc-900 hover:border-zinc-800 rounded-2xl p-6 transition-all flex flex-col justify-between relative group">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <GoogleLogo />
                  <span className="bg-lime-400/10 border border-lime-400/20 text-lime-400 text-[8px] font-bold px-2 py-0.5 rounded-full">IMAGE</span>
                </div>
                <h3 className="text-sm font-bold text-white tracking-wide">Nano Banana Pro</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Generate high-quality static visuals with lighting.
                </p>
              </div>
              <div className="pt-4 flex justify-between items-center text-[10px] text-zinc-400 group-hover:text-white transition-colors">
                <span>Start generation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 3: Seedance 2.0 */}
            <div className="bg-zinc-900/40 hover:bg-zinc-900/60 border border-zinc-900 hover:border-zinc-800 rounded-2xl p-6 transition-all flex flex-col justify-between relative group">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <SeedanceLogo />
                  <span className="bg-lime-400/10 border border-lime-400/20 text-lime-400 text-[8px] font-bold px-2 py-0.5 rounded-full">VIDEO</span>
                </div>
                <h3 className="text-sm font-bold text-white tracking-wide">Seedance 2.0</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Create high-quality cinematic videos in seconds.
                </p>
              </div>
              <div className="pt-4 flex justify-between items-center text-[10px] text-zinc-400 group-hover:text-white transition-colors">
                <span>Launch model</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 4: MCP & CLI */}
            <div className="bg-zinc-900/40 hover:bg-zinc-900/60 border border-zinc-900 hover:border-zinc-800 rounded-2xl p-6 transition-all flex flex-col justify-between relative group">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <ClaudeLogo />
                  <span className="bg-lime-400/10 border border-lime-400/20 text-lime-400 text-[8px] font-bold px-2 py-0.5 rounded-full font-mono">TRENDING</span>
                </div>
                <h3 className="text-sm font-bold text-white tracking-wide">MCP & CLI</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Turn Claude and other agents into full creative production tools.
                </p>
              </div>
              <div className="pt-4 flex justify-between items-center text-[10px] text-zinc-400 group-hover:text-white transition-colors">
                <span>Read docs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 5: Gemini Omni Flash */}
            <div className="bg-zinc-900/40 hover:bg-zinc-900/60 border border-zinc-900 hover:border-zinc-800 rounded-2xl p-6 transition-all flex flex-col justify-between relative group">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <GeminiLogo />
                  <span className="bg-lime-400/10 border border-lime-400/20 text-lime-400 text-[8px] font-bold px-2 py-0.5 rounded-full font-mono">NEW</span>
                </div>
                <h3 className="text-sm font-bold text-white tracking-wide">Gemini Omni Flash</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Generate and edit video from any input text.
                </p>
              </div>
              <div className="pt-4 flex justify-between items-center text-[10px] text-zinc-400 group-hover:text-white transition-colors">
                <span>Use tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 6: Cinema Studio 3.5 */}
            <div className="bg-zinc-900/40 hover:bg-zinc-900/60 border border-zinc-900 hover:border-zinc-800 rounded-2xl p-6 transition-all flex flex-col justify-between relative group">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <CinemaLogo />
                  <span className="bg-lime-400/10 border border-lime-400/20 text-lime-400 text-[8px] font-bold px-2 py-0.5 rounded-full font-mono">PREMIUM</span>
                </div>
                <h3 className="text-sm font-bold text-white tracking-wide">Cinema Studio 3.5</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Create cinematic scenes effortlessly.
                </p>
              </div>
              <div className="pt-4 flex justify-between items-center text-[10px] text-zinc-400 group-hover:text-white transition-colors">
                <span>Enter studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>

        </div>

        {/* Explore The Inside Of Every Project Section */}
        <div className="space-y-8">
          
          <div className="space-y-2 border-b border-zinc-900 pb-6">
            <h2 className="text-3xl font-black text-lime-400 uppercase tracking-tight">
              EXPLORE THE INSIDE OF EVERY PROJECT
            </h2>
            <p className="text-zinc-500 text-sm">
              See all prompts, assets, and how each project was created.
            </p>
          </div>

          {/* Full Grid of projects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROJECTS.map((project) => (
              <div 
                key={project.id}
                onClick={() => openModal(project.videoUrl, project.title, project.prompt)}
                className="bg-zinc-900/30 border border-zinc-900 hover:border-zinc-800 rounded-2xl overflow-hidden cursor-pointer group shadow-lg transition-all duration-300"
              >
                <div className="aspect-[16/10] w-full bg-black overflow-hidden relative">
                  <video 
                    src={project.videoUrl} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" 
                  />
                  <div className="absolute top-3 left-3 bg-zinc-900/90 border border-zinc-800 text-[10px] font-mono text-zinc-300 p-1.5 rounded-lg flex items-center gap-1.5 shadow-md">
                    <span className="w-2.5 h-2.5 bg-lime-400 rounded-full flex items-center justify-center text-[6px] text-zinc-950 font-bold">⚡</span>
                    Higgsfield Project
                  </div>
                </div>
                
                <div className="p-4 border-t border-zinc-900/80 space-y-2">
                  <h3 className="font-bold text-sm text-zinc-100 line-clamp-1 leading-snug group-hover:text-white transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                    <span>by {project.author}</span>
                    <span className="bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700 text-zinc-300 uppercase">
                      Public
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </section>

      {/* Dialogue / Remix Modal Overlay (Image 2) */}
      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all">
          <div className="relative bg-zinc-950 border border-zinc-800/80 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl transition-transform scale-100 flex flex-col md:grid md:grid-cols-12">
            
            {/* Close Button X */}
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left side: Video Viewport & Thumbnail */}
            <div className="md:col-span-7 bg-black p-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-900 min-h-[300px] md:min-h-0">
              
              {/* Active Video Screen */}
              <div className="flex-1 flex items-center justify-center overflow-hidden rounded-xl bg-zinc-950 border border-zinc-900 relative">
                <video
                  src={modalData.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Mini video thumbnail row below the screen */}
              <div className="flex gap-2 pt-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-lime-400 bg-zinc-900">
                  <video src={modalData.videoUrl} muted playsInline className="w-full h-full object-cover" />
                </div>
              </div>

            </div>

            {/* Right side: Settings, Prompt, Ratio and Trigger */}
            <div className="md:col-span-5 p-6 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
                    Powered by Buralqy
                  </span>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">
                    {modalData.title}
                  </h3>
                </div>

                {/* Dojo/Sensei Combat scene details */}
                <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-4 font-mono text-xs text-zinc-400 leading-relaxed max-h-[120px] overflow-y-auto">
                  {modalData.prompt}
                </div>

                {/* Upload Media Card Block */}
                <div className="border border-dashed border-zinc-800 hover:border-zinc-700/80 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-zinc-900/10">
                  <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-2">
                    <Upload className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-zinc-300">Upload media</span>
                  <span className="text-[10px] text-zinc-500 mt-1">Drag & drop or click to upload</span>
                </div>

                {/* Aspect Ratio Buttons (16:9, 1:1, 9:16) */}
                <div className="space-y-2">
                  <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider block">Aspect Ratio</span>
                  <div className="grid grid-cols-3 gap-2">
                    {(["16:9", "1:1", "9:16"] as const).map((ratio) => {
                      const isSelected = activeRatio === ratio;
                      return (
                        <button
                          key={ratio}
                          onClick={() => setActiveRatio(ratio)}
                          className={`py-2 rounded-xl text-xs font-bold font-mono transition-all border cursor-pointer ${
                            isSelected 
                              ? "bg-zinc-900 border-lime-400/80 text-lime-400 shadow-sm" 
                              : "bg-transparent border-zinc-900 hover:border-zinc-800 text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span className={`w-3.5 h-2.5 border rounded-sm ${isSelected ? "border-lime-400" : "border-zinc-600"} ${ratio === "1:1" ? "aspect-square" : ratio === "9:16" ? "w-2.5 h-3.5" : "w-4 h-2.5"}`} />
                            <span>{ratio}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Generate button */}
              <div className="pt-2">
                <Button 
                  onClick={() => {
                    alert(`Initiating scene generation in aspect ratio ${activeRatio}!`);
                    closeModal();
                  }}
                  className="w-full bg-lime-400 hover:bg-lime-500 text-zinc-950 font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-lime-400/10 cursor-pointer"
                >
                  <span>Generate ✦ 53</span>
                </Button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black py-12 px-6 text-zinc-600 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-white flex items-center justify-center text-black font-bold text-xs">H</div>
            <span className="font-bold text-zinc-300 text-sm tracking-wider">HIGGSFIELD</span>
          </div>

          <div className="flex gap-6 text-zinc-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>

          <div>
            &copy; {new Date().getFullYear()} Higgsfield. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}