import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { MessageSquare, Phone, Home as HomeIcon, Box, HardHat, Package } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function Messages() {
  const [workers, setWorkers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [draft, setDraft] = useState("");
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const w = await base44.entities.Worker.list("-rating", 5);
        setWorkers(w);
        setThreads(w.map((x, i) => ({
          id: x.id,
          name: x.name,
          subtitle: x.profession?.replace("_", " "),
          photo: x.photo_url,
          module: "workers",
          last: i === 0 ? "Sure, I can start tomorrow." : i === 1 ? "Thank you for the enquiry!" : "Available this weekend.",
          time: ["2m", "1h", "3h", "Yesterday", "2d"][i] || "now",
        })));
      } catch (e) {}
    })();
  }, []);

  const send = () => {
    if (!draft.trim() || !activeChat) return;
    setDraft("");
  };

  const moduleIcon = (m) => (m === "workers" ? HardHat : m === "materials" ? Package : m === "designs" ? Box : HomeIcon);

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-4 lg:py-8">
      <h1 className="font-heading font-extrabold text-2xl lg:text-4xl mb-4">Messages</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[70vh]">
        {/* Thread list */}
        <div className="lg:col-span-1 rounded-2xl border border-border bg-card overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <MessageSquare className="w-4 h-4 text-clay" />
            <span className="font-semibold text-sm">Conversations</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {threads.map((t) => (
              <button key={t.id} onClick={() => setActiveChat(t)} className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-border hover:bg-muted ${activeChat?.id === t.id ? "bg-muted" : ""}`}>
                <div className="w-11 h-11 rounded-full overflow-hidden bg-muted shrink-0">
                  {t.photo ? <Image src={t.photo} fittingType="fill" className="w-full h-full" alt={t.name} /> : <div className="w-full h-full flex items-center justify-center"><HardHat className="w-5 h-5 text-secondary-foreground" /></div>}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm truncate">{t.name}</h3>
                    <span className="text-[10px] text-secondary-foreground">{t.time}</span>
                  </div>
                  <p className="text-xs text-secondary-foreground truncate">{t.last}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat pane */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden flex flex-col">
          {activeChat ? (
            <>
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                  {activeChat.photo && <Image src={activeChat.photo} fittingType="fill" className="w-full h-full" alt={activeChat.name} />}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{activeChat.name}</h3>
                  <p className="text-xs text-secondary-foreground capitalize">{activeChat.subtitle}</p>
                </div>
                <a href="tel:+919876543210" className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-muted"><Phone className="w-4 h-4 text-secondary-foreground" /></a>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
                <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-card border border-border px-4 py-2.5 text-sm">Hi, I saw your profile on Gruham. Are you available for a project?</div>
                <div className="max-w-[75%] ml-auto rounded-2xl rounded-tr-sm bg-clay text-white px-4 py-2.5 text-sm">{activeChat.last}</div>
                <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-card border border-border px-4 py-2.5 text-sm">What's the scope and location?</div>
              </div>
              <div className="flex items-center gap-2 p-3 border-t border-border">
                <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type a message…" className="flex-1 rounded-xl bg-muted border border-border px-4 py-2.5 text-sm outline-none" />
                <button onClick={send} className="inline-flex items-center justify-center rounded-xl bg-clay text-white px-5 py-2.5 text-sm font-semibold">Send</button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-secondary-foreground gap-2">
              <MessageSquare className="w-10 h-10" />
              <p className="text-sm">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}