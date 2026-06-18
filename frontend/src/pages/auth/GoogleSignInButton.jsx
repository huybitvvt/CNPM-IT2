import React, { useEffect, useRef, useState } from "react";

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function GoogleSignInButton({ onSuccess, onError, text = "signin_with" }) {
  const buttonRef = useRef(null);
  const [scriptReady, setScriptReady] = useState(Boolean(window.google?.accounts?.id));

  useEffect(() => {
    if (!googleClientId) {
      return;
    }

    if (window.google?.accounts?.id) {
      setScriptReady(true);
      return;
    }

    const existingScript = document.querySelector("script[src='https://accounts.google.com/gsi/client']");
    if (existingScript) {
      existingScript.addEventListener("load", () => setScriptReady(true), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptReady(true);
    script.onerror = () => onError?.("Không tải được Google Sign-In. Vui lòng thử lại.");
    document.body.appendChild(script);
  }, [onError]);

  useEffect(() => {
    if (!scriptReady || !googleClientId || !buttonRef.current || !window.google?.accounts?.id) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: (response) => {
        if (response.credential) {
          onSuccess(response.credential);
        } else {
          onError?.("Google không trả về credential hợp lệ.");
        }
      },
    });

    buttonRef.current.innerHTML = "";
    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      text,
      shape: "rectangular",
      width: buttonRef.current.offsetWidth || 360,
    });
  }, [onError, onSuccess, scriptReady, text]);

  if (!googleClientId) {
    return (
      <button
        type="button"
        onClick={() => onError?.("Chưa cấu hình REACT_APP_GOOGLE_CLIENT_ID cho frontend.")}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700"
      >
        Đăng nhập với Google
      </button>
    );
  }

  return <div ref={buttonRef} className="min-h-[44px] w-full overflow-hidden rounded-xl" />;
}

export default GoogleSignInButton;
