import { useState, useEffect } from "react";
import { useNavigate } from "react-router";


interface Avatar {
  id: string;
  name: string;
  images?: { url: string }[];
  generatedImagePath?: string;
  generatedText?: string;
}

interface Model {
  id: string;
  name: string;
  description: string;
}

interface VideoResult {
  id: string;
  title: string;
  videoUrl: string;
  createdAt: string;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"avatars" | "videos">("avatars");

  // Avatars State
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [avatarName, setAvatarName] = useState("");
  const [avatarPrompt, setAvatarPrompt] = useState("");
  const [creatingAvatar, setCreatingAvatar] = useState(false);

  // Videos State
  const [videos, setVideos] = useState<VideoResult[]>([]);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [selectedAvatarId, setSelectedAvatarId] = useState("");
  const [generatingVideo, setGeneratingVideo] = useState(false);

  // Models State
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState("");

  const [error, setError] = useState<string | null>(null);

  // Check login
  useEffect(() => {
    const user = localStorage.getItem("username");
    if (!user) {
      navigate("/signin");
    }
  }, [navigate]);

  // Fetch initial data
  const fetchData = async () => {
    try {
      // Fetch Avatars
      const avatarsRes = await fetch("/api/v1/avatars");
      if (avatarsRes.ok) {
        const avatarsData = await avatarsRes.json();
        setAvatars(avatarsData);
      }

      // Fetch Models
      const modelsRes = await fetch("/api/v1/models");
      if (modelsRes.ok) {
        const modelsData = await modelsRes.json();
        setModels(modelsData);
        if (modelsData.length > 0) {
          setSelectedModel(modelsData[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load initial data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Avatar Generation
  const handleCreateAvatar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatarName) return;
    setCreatingAvatar(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: avatarName,
          prompt: avatarPrompt || undefined,
          images: [],
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create avatar");

      setAvatars((prev) => [data, ...prev]);
      setAvatarName("");
      setAvatarPrompt("");
    } catch (err: any) {
      setError(err.message || "An error occurred generating avatar");
    } finally {
      setCreatingAvatar(false);
    }
  };

  // Handle Video Generation
  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle || !videoPrompt) return;
    setGeneratingVideo(true);
    setError(null);

    try {
      // Find selected avatar's image path
      const avatar = avatars.find((a) => a.id === selectedAvatarId);
      const imageUrl = avatar?.generatedImagePath || (avatar?.images && avatar.images[0]?.url) || undefined;

      const response = await fetch("/api/v1/video/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: videoTitle,
          prompt: videoPrompt,
          avatarId: selectedAvatarId || undefined,
          imageUrl,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate video");

      setVideos((prev) => [
        {
          id: data.id,
          title: data.title,
          videoUrl: data.videoUrl,
          createdAt: data.createdAt,
        },
        ...prev,
      ]);

      setVideoTitle("");
      setVideoPrompt("");
      setSelectedAvatarId("");
    } catch (err: any) {
      setError(err.message || "An error occurred generating video");
    } finally {
      setGeneratingVideo(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-mono p-6 sm:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="border-b border-gray-800 pb-6 mb-8 flex justify-between items-baseline">
          <div>
            <h1 className="text-3xl font-extrabold tracking-wider">CREATIVE STUDIO</h1>
            <p className="text-gray-500 text-sm mt-1">Generate AI Avatars & Videos natively with Higgsfield</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-950/80 border border-red-800 text-red-300 p-4 rounded-lg mb-6 text-sm">
            [ERROR]: {error}
          </div>
        )}

        {/* Studio Tabs */}
        <div className="flex gap-4 border-b border-gray-900 mb-8">
          <button
            onClick={() => setActiveTab("avatars")}
            className={`pb-3 px-4 font-bold text-sm tracking-wider transition-all border-b-2 ${
              activeTab === "avatars"
                ? "border-white text-white"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            AVATAR GENERATION
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`pb-3 px-4 font-bold text-sm tracking-wider transition-all border-b-2 ${
              activeTab === "videos"
                ? "border-white text-white"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            VIDEO CREATION (VEO)
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Sidebar */}
          <div className="lg:col-span-4 bg-gray-900/50 border border-gray-800 rounded-xl p-6 h-fit">
            {activeTab === "avatars" ? (
              <form onSubmit={handleCreateAvatar}>
                <h3 className="text-lg font-bold mb-6 tracking-wide">NEW AVATAR</h3>

                <div className="mb-4">
                  <label className="block text-xs text-gray-400 font-bold mb-2">NAME</label>
                  <input
                    type="text"
                    required
                    value={avatarName}
                    onChange={(e) => setAvatarName(e.target.value)}
                    placeholder="E.g. Neon Monk"
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-gray-700"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-xs text-gray-400 font-bold mb-2">GENERATION MODEL</label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-gray-700"
                  >
                    {models.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-xs text-gray-400 font-bold mb-2">PROMPT (OPTIONAL)</label>
                  <textarea
                    rows={4}
                    value={avatarPrompt}
                    onChange={(e) => setAvatarPrompt(e.target.value)}
                    placeholder="Describe your character..."
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-gray-700 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={creatingAvatar}
                  className="w-full bg-white text-black font-bold py-3 px-4 rounded-lg text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creatingAvatar ? "GENERATING AVATAR..." : "GENERATE AVATAR"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleCreateVideo}>
                <h3 className="text-lg font-bold mb-6 tracking-wide">NEW VIDEO</h3>

                <div className="mb-4">
                  <label className="block text-xs text-gray-400 font-bold mb-2">TITLE</label>
                  <input
                    type="text"
                    required
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="E.g. Cinematic Run"
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-gray-700"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-xs text-gray-400 font-bold mb-2">SELECT SUBJECT AVATAR</label>
                  <select
                    value={selectedAvatarId}
                    onChange={(e) => setSelectedAvatarId(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-gray-700"
                  >
                    <option value="">No Reference Avatar</option>
                    {avatars.map((avatar) => (
                      <option key={avatar.id} value={avatar.id}>
                        {avatar.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-xs text-gray-400 font-bold mb-2">PROMPT</label>
                  <textarea
                    rows={4}
                    required
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    placeholder="What should happen in the video?"
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-gray-700 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={generatingVideo}
                  className="w-full bg-white text-black font-bold py-3 px-4 rounded-lg text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generatingVideo ? "CREATING VEO VIDEO..." : "GENERATE VIDEO"}
                </button>
              </form>
            )}
          </div>

          {/* Output Display area */}
          <div className="lg:col-span-8">
            {activeTab === "avatars" ? (
              <div>
                <h3 className="text-lg font-bold mb-6 tracking-wide">GENERATED AVATARS</h3>
                {avatars.length === 0 ? (
                  <div className="border border-dashed border-gray-800 rounded-xl p-12 text-center text-gray-600">
                    No avatars generated yet. Try submitting one on the left.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {avatars.map((avatar) => {
                      const img =
                        avatar.generatedImagePath ||
                        (avatar.images && avatar.images[0]?.url) ||
                        "/fallback-avatar.png";

                      return (
                        <div
                          key={avatar.id}
                          className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
                        >
                          <div className="aspect-square bg-gray-950 flex items-center justify-center relative group overflow-hidden">
                            {avatar.generatedImagePath ? (
                              <img
                                src={img}
                                alt={avatar.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="text-gray-700 text-sm">Preview generation</div>
                            )}
                          </div>
                          <div className="p-4 border-t border-gray-800">
                            <h4 className="font-bold text-sm tracking-wide mb-1">{avatar.name}</h4>
                            <p className="text-gray-500 text-xs line-clamp-2">
                              {avatar.generatedText || "No description generated."}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold mb-6 tracking-wide">VEO VIDEO GALLERY</h3>
                {videos.length === 0 ? (
                  <div className="border border-dashed border-gray-800 rounded-xl p-12 text-center text-gray-600">
                    No videos generated yet. Trigger a Veo request on the left side to get started.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {videos.map((vid) => (
                      <div
                        key={vid.id}
                        className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
                      >
                        <div className="aspect-video bg-gray-950">
                          <video
                            src={vid.videoUrl}
                            controls
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 border-t border-gray-800">
                          <h4 className="font-bold text-sm tracking-wide mb-1">{vid.title}</h4>
                          <span className="text-[10px] text-gray-600">
                            ID: {vid.id.slice(0, 8)}... | Generated on {new Date(vid.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
