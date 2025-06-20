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
        <>
        <button 
            className={`btn btn-${autoSave ? 'success' : 'danger'}`}
            onClick={() => setAutoSave(prev => !prev)}
            style={{
                fontWeight: 600,
                padding: "10px 20px",
                fontSize: "1rem",
                borderRadius: "12px",
                minWidth: "160px",
                textAlign: "center",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
                transform: "translateY(0)",
                lineHeight: "1.4", // helps match the height better
            }}
            onMouseEnter={e => {
                e.currentTarget.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
                e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(0)";
            }}
            >
            {autoSave ? '💾 AUTOSAVE: ON' : '💾 AUTOSAVE: OFF'}
        </button>


        {successfulMsg && ( //DISPLAY SUCCESS MSG
                    <div className="alert alert-success mt-3 w-200" role="alert">
                        {successfulMsg}
                    </div>
                    )}
        </>
    );
}