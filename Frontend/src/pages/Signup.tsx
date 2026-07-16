import { useState } from "react";
import { useNavigate } from "react-router";

export function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch("/api/v1/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/signin");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div
        style={{
          border: "1.5px solid #d1d5db",
          borderRadius: "16px",
          backgroundColor: "#f8f9fb",
          padding: "48px 40px",
          width: "100%",
          maxWidth: "520px",
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontFamily: "monospace",
            fontWeight: 800,
            fontSize: "2rem",
            textAlign: "center",
            letterSpacing: "0.08em",
            marginBottom: "8px",
          }}
        >
          SIGNUP
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            fontFamily: "monospace",
            fontSize: "0.95rem",
            marginBottom: "36px",
          }}
        >
          Create your account
        </p>

        {error && (
          <div
            style={{
              padding: "12px",
              marginBottom: "20px",
              backgroundColor: "#fee2e2",
              color: "#b91c1c",
              borderRadius: "8px",
              fontFamily: "monospace",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              padding: "12px",
              marginBottom: "20px",
              backgroundColor: "#dcfce7",
              color: "#15803d",
              borderRadius: "8px",
              fontFamily: "monospace",
              fontSize: "0.9rem",
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSignup}>
          {/* Username */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontFamily: "monospace",
                fontWeight: 700,
                fontSize: "0.8rem",
                letterSpacing: "0.1em",
                marginBottom: "8px",
              }}
            >
              USERNAME
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "1.5px solid #d1d5db",
                borderRadius: "10px",
                backgroundColor: "#fff",
                fontFamily: "monospace",
                fontSize: "0.95rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "28px" }}>
            <label
              style={{
                display: "block",
                fontFamily: "monospace",
                fontWeight: 700,
                fontSize: "0.8rem",
                letterSpacing: "0.1em",
                marginBottom: "8px",
              }}
            >
              PASSWORD
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  width: "100%",
                  padding: "14px 48px 14px 16px",
                  border: "1.5px solid #d1d5db",
                  borderRadius: "10px",
                  backgroundColor: "#fff",
                  fontFamily: "monospace",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  color: "#374151",
                }}
              >
                {showPassword ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Signup button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              backgroundColor: "#000",
              color: "#fff",
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: "0.1em",
              border: "none",
              borderRadius: "10px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              marginBottom: "24px",
            }}
          >
            {loading ? "CREATING..." : "SIGNUP"}
          </button>
        </form>

        {/* Signin link */}
        <p
          style={{
            textAlign: "center",
            fontFamily: "monospace",
            fontSize: "0.9rem",
            color: "#374151",
          }}
        >
          Already have an account?{" "}
          <button
            onClick={() => navigate("/signin")}
            style={{ fontWeight: 700, color: "#000", textDecoration: "none", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            LOGIN
          </button>
        </p>
      </div>
    </div>
  );
}
