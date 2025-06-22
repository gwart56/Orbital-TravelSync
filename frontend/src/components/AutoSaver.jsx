import { useEffect, useState } from "react";

export function AutoSaveButton({itin, saveToDB}) {   
    const [autoSave, setAutoSave] = useState(false); // start with no autosave
    const [successfulMsg, setSuccessful] = useState('');

    useEffect( () => {
        if (autoSave) {
        const timer = setTimeout(() => {
            saveToDB(itin);
            setSuccessful('AUTO-SAVED!');
            // Clear success message after 2 seconds
            const successTimer = setTimeout(() => setSuccessful(''), 2000);

            // Cleanup: Clear successTimer if effect re-runs before 2s
            return () => clearTimeout(successTimer);
        }, 2000); //only run saveToDB after 2s without any edits (can change duration next time see how)

        return () => clearTimeout(timer); //clear timer
        //this is a cleanup function which runs when useEffect is triggered again
        //it clears the previous timer(if any) to avoid stacking multiple timers
        }
    }, [itin, autoSave]);

    return (
        <div style={{ position: "relative", display: "inline-block" }}>
        <button 
            onClick={() => setAutoSave(prev => !prev)}
            style={{
            fontWeight: 600,
            padding: "10px 20px",
            fontSize: "1rem",
            borderRadius: "12px",
            minWidth: "160px",
            textAlign: "center",
            border: "none",
            backgroundColor: autoSave ? "#2e8b57" : "#e74c3c",
            color: "#fff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
            transform: "translateY(0)",
            lineHeight: "1.4"
            }}
            onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = autoSave ? "#3cb371" : "#ff6f61";
            e.currentTarget.style.boxShadow = autoSave
                ? "0 0 10px #3cb371, 0 0 20px rgba(60, 179, 113, 0.4)"
                : "0 0 10px #ff6f61, 0 0 20px rgba(255, 111, 97, 0.4)";
            e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = autoSave ? "#2e8b57" : "#e74c3c";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
            e.currentTarget.style.transform = "translateY(0)";
            }}
        >
            {autoSave ? '💾 AUTOSAVE: ON' : '💾 AUTOSAVE: OFF'}
        </button>

        {successfulMsg && (
            <div
            role="alert"
            style={{
                position: "absolute",
                top: "50%",
                left: "calc(100% + 12px)", // position beside the button
                transform: "translateY(-50%)",
                padding: "10px 16px",
                borderRadius: "10px",
                backgroundColor: "#d4edda",
                color: "#155724",
                boxShadow: "0 0 10px rgba(72, 180, 97, 0.4)",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: 500,
                zIndex: 10
            }}
            >
            ✅ {successfulMsg}
            </div>
        )}
        </div>
    );
}