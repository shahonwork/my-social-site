import { useState, useRef } from "react";
import { Upload, Camera, Film, X, Copyright, Clock } from "lucide-react";

const ACCENT = "#C9A227";
const RUST = "#B5533C";
const TEAL = "#3E6E64";
const INK = "#1B1A17";
const PAPER = "#EFE9DD";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatStamp(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  return `${d} ${months[parseInt(m, 10) - 1]} ${y}`;
}

export default function SocialTimeline() {
  const [posts, setPosts] = useState([]);
  const [pendingFile, setPendingFile] = useState(null);
  const [pendingType, setPendingType] = useState(null);
  const [displayDate, setDisplayDate] = useState(todayISO());
  const [caption, setCaption] = useState("");
  const [ownerName, setOwnerName] = useState("Your Name");
  const fileInput = useRef(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const type = file.type.startsWith("video") ? "video" : "photo";
    const reader = new FileReader();
    reader.onload = () => {
      setPendingFile(reader.result);
      setPendingType(type);
      setCaption(`© ${new Date(displayDate).getFullYear()} ${ownerName}. All rights reserved.`);
    };
    reader.readAsDataURL(file);
  }

  function publish() {
    if (!pendingFile) return;
    const newPost = {
      id: crypto.randomUUID(),
      media: pendingFile,
      type: pendingType,
      displayDate,
      caption,
      uploadedAt: new Date().toISOString(),
    };
    setPosts((p) => [newPost, ...p].sort((a, b) => (a.displayDate < b.displayDate ? 1 : -1)));
    setPendingFile(null);
    setPendingType(null);
    setCaption("");
    setDisplayDate(todayISO());
    if (fileInput.current) fileInput.current.value = "";
  }

  function removePost(id) {
    setPosts((p) => p.filter((post) => post.id !== id));
  }

  return (
    <div style={{ background: INK, minHeight: "100%", color: PAPER, fontFamily: "'Georgia', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600&family=Space+Mono:wght@400;700&display=swap');
        .display-font { font-family: 'Fraunces', serif; }
        .mono-font { font-family: 'Space Mono', monospace; }
        .frame-card { border: 1px solid rgba(239,233,221,0.15); background: #232019; }
        .sprocket { position: absolute; width: 10px; height: 10px; border-radius: 50%; background: ${INK}; border: 1px solid rgba(239,233,221,0.2); }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.8); }
        .upload-zone:hover { border-color: ${ACCENT} !important; }
        textarea, input[type="text"], input[type="date"] {
          background: #232019; color: ${PAPER}; border: 1px solid rgba(239,233,221,0.2);
          padding: 8px 10px; border-radius: 4px; outline: none; width: 100%;
        }
        input[type="text"]:focus, textarea:focus, input[type="date"]:focus { border-color: ${ACCENT}; }
        button.primary { background: ${ACCENT}; color: ${INK}; border: none; font-weight: 700; }
        button.primary:hover { filter: brightness(1.08); }
        button.primary:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>

      <header style={{ padding: "28px 24px 18px", borderBottom: "1px solid rgba(239,233,221,0.12)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Film size={22} color={ACCENT} />
          <h1 className="display-font" style={{ fontSize: 26, margin: 0, letterSpacing: 0.5 }}>
            Contact Sheet
          </h1>
        </div>
        <p className="mono-font" style={{ fontSize: 11, opacity: 0.6, margin: "6px 0 0 32px" }}>
          every frame gets the date you give it
        </p>
      </header>

      <section style={{ padding: 24, maxWidth: 640, margin: "0 auto" }}>
        <div
          className="frame-card upload-zone"
          style={{ borderRadius: 6, padding: 20, borderStyle: "dashed", cursor: "pointer" }}
          onClick={() => fileInput.current?.click()}
        >
          <input ref={fileInput} type="file" accept="image/*,video/*" onChange={handleFile} style={{ display: "none" }} />
          {!pendingFile ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <Upload size={26} color={ACCENT} />
              <p className="mono-font" style={{ fontSize: 12, marginTop: 10, opacity: 0.7 }}>
                click to choose a photo or video
              </p>
            </div>
          ) : pendingType === "photo" ? (
            <img src={pendingFile} alt="preview" style={{ width: "100%", borderRadius: 4, maxHeight: 260, objectFit: "cover" }} />
          ) : (
            <video src={pendingFile} controls style={{ width: "100%", borderRadius: 4, maxHeight: 260 }} />
          )}
        </div>

        {pendingFile && (
          <div style={{ marginTop: 16, display: "grid", gap: 12 }} onClick={(e) => e.stopPropagation()}>
            <label className="mono-font" style={{ fontSize: 11, opacity: 0.6 }}>
              your name (for the copyright line)
              <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} style={{ marginTop: 4 }} />
            </label>

            <label className="mono-font" style={{ fontSize: 11, opacity: 0.6 }}>
              date this shows under (can be any date — it's yours to set)
              <input type="date" value={displayDate} onChange={(e) => setDisplayDate(e.target.value)} style={{ marginTop: 4 }} />
            </label>

            <label className="mono-font" style={{ fontSize: 11, opacity: 0.6 }}>
              caption
              <textarea rows={3} value={caption} onChange={(e) => setCaption(e.target.value)} style={{ marginTop: 4, resize: "vertical" }} />
            </label>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="primary" style={{ padding: "10px 18px", borderRadius: 4, fontSize: 13 }} onClick={publish}>
                Post
              </button>
              <button
                style={{ padding: "10px 18px", borderRadius: 4, fontSize: 13, background: "transparent", color: PAPER, border: "1px solid rgba(239,233,221,0.25)" }}
                onClick={() => { setPendingFile(null); setPendingType(null); setCaption(""); }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      <section style={{ padding: "0 24px 60px", maxWidth: 640, margin: "0 auto", display: "grid", gap: 22 }}>
        {posts.length === 0 && (
          <p className="mono-font" style={{ textAlign: "center", opacity: 0.4, fontSize: 12, marginTop: 20 }}>
            nothing posted yet — your feed starts above
          </p>
        )}
        {posts.map((post) => (
          <article key={post.id} className="frame-card" style={{ position: "relative", borderRadius: 6, overflow: "hidden" }}>
            {[0, 1].map((side) => (
              <div key={side} style={{ position: "absolute", top: 0, bottom: 0, [side ? "right" : "left"]: 6, display: "flex", flexDirection: "column", justifyContent: "space-around", padding: "6px 0", zIndex: 2 }}>
                {Array.from({ length: 6 }).map((_, i) => <span key={i} className="sprocket" />)}
              </div>
            ))}

            <div style={{ padding: "10px 26px 0" }}>
              {post.type === "photo" ? (
                <img src={post.media} alt="post" style={{ width: "100%", maxHeight: 380, objectFit: "cover", borderRadius: 3 }} />
              ) : (
                <video src={post.media} controls style={{ width: "100%", maxHeight: 380, borderRadius: 3 }} />
              )}

              <div
                className="mono-font"
                style={{
                  position: "absolute", bottom: 54, right: 34, background: "rgba(0,0,0,0.55)",
                  color: RUST, fontSize: 13, padding: "3px 8px", borderRadius: 2, letterSpacing: 1,
                }}
              >
                {formatStamp(post.displayDate)}
              </div>
            </div>

            <div style={{ padding: "12px 26px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
              <p style={{ fontSize: 14, margin: 0, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{post.caption}</p>
              <button onClick={() => removePost(post.id)} style={{ background: "none", border: "none", color: PAPER, opacity: 0.4, cursor: "pointer", flexShrink: 0 }}>
                <X size={16} />
              </button>
            </div>

            <div className="mono-font" style={{ padding: "0 26px 14px", fontSize: 10, opacity: 0.35, display: "flex", alignItems: "center", gap: 5 }}>
              <Clock size={11} /> actually uploaded {new Date(post.uploadedAt).toLocaleString()}
            </div>
          </article>
        ))}
      </section>

      <footer className="mono-font" style={{ textAlign: "center", fontSize: 10, opacity: 0.35, padding: "0 24px 30px" }}>
        <Copyright size={11} style={{ verticalAlign: -1, marginRight: 4 }} />
        demo runs only in this browser tab — wire up a backend to keep posts across visits and users
      </footer>
    </div>
  );
}
