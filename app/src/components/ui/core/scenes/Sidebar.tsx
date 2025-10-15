import { PROJECTS } from "@lib/data";

export default function Sidebar({
  projects,
  activeProjectIndex,
  activeVideo,
  onSelectProject,
  onSelectVideo,
}: {
  projects: typeof PROJECTS;
  activeProjectIndex: number;
  activeVideo: string;
  onSelectProject: (idx: number) => void;
  onSelectVideo: (src: string) => void;
}) {
  return (
    <div className="absolute right-0 top-0 h-full w-72 bg-black/40 backdrop-blur-md border-l border-white/10 p-6 z-30 overflow-y-auto">
      <h2 className="text-white text-lg font-bold mb-6">Projects</h2>
      {projects.map((proj, idx) => (
        <div key={proj.id || idx} className="mb-4">
          <button
            onClick={() => onSelectProject(idx)}
            className={`w-full text-left font-semibold p-3 rounded-lg transition-all ${activeProjectIndex === idx
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
          >
            {proj.title}
          </button>
          {activeProjectIndex === idx && (
            <div className="ml-2 mt-2 space-y-1">
              {proj.videos.map((v) => (
                <button
                  key={v.src}
                  onClick={() => onSelectVideo(v.src)}
                  className={`block w-full text-left text-sm p-2 rounded transition-all ${activeVideo === v.src
                      ? "bg-purple-500/80 text-white"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
