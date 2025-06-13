import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from "./supabaseClient";


const AuthContext = createContext();

export function AuthContextProvider({children}) {
    const [session, setSession] = useState(undefined);//initialize to no session

    const signUpNewUser = async(email, pw, name) => {
        const { data, error } = await supabase.auth.signUp({ //handles sign up
                email: email,
                password: pw,
                options: { data: { name: name } }, //send xtra info about the name
            });

            if (error) {
                console.error('error: ', error.message);
                return {success: false, error: error.message}; //returns object which contains the error
            }
            return {success: true, data};
    }

    const signInUser = async(email, pw) => {
        const { data, error } = await supabase.auth.signInWithPassword({ //handles sign in
                    email: email,
                    password: pw //send xtra info about the name
                });
            if (error) {
                console.error('error: ', error.message);
                return {success: false, error: error.message}; //returns object which contains the error
            }
            return {success: true, data};
    }

    const signOutUser = () => {
        let { error } = supabase.auth.signOut();
        setSession(undefined);
        if (error) {
            console.error('error signing out: ', error);
        }
    }

    async function deleteUser(userId) {
        const { data, error } = await supabase.auth.admin.deleteUser(userId);

        if (error) {
            console.error('Error deleting user:', error)
            return null
        }

        console.log('Deleted user:', data)
        return data;
    }


    useEffect(() => { //useEffect is used for side effects (TODO: might modify this later idk)
            supabase.auth.getSession().then(({ data: { session } }) => {
                setSession(session);
            });

            const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => { 
                //sets up listener so that supabase updates 'session' everytime there r session changes
                setSession(session);
            });

            return () => listener.subscription.unsubscribe(); //end listener after component unmount (prevent over-creating of listeners)
        }, []);

    return (
        <AuthContext.Provider value ={{signUpNewUser, signInUser, signOutUser, deleteUser, session}}>
            {children}
        </ AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);