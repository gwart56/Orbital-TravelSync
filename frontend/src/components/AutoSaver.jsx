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
            className={`btn btn-${autoSave?'success':'danger'}`}
            onClick={() => setAutoSave(prev => !prev)} //toggles autosave
        >
            {autoSave?'AUTOSAVE: ON': 'AUTOSAVE: OFF'}   
        </button>
        {successfulMsg && ( //DISPLAY SUCCESS MSG
                    <div className="alert alert-success mt-3 w-200" role="alert">
                        {successfulMsg}
                    </div>
                    )}
        </>
    );
}