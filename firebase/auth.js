/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createContext, useState } from "react";
import { onAuthStateChanged, signOut as authSignOut} from "firebase/auth";
import { auth } from "./firebase"
import { useEffect } from "react";
import { useContext } from "react";

const AuthUserContext = createContext({
    authUser: null,
    isLoading: true,
});

export default function useFireBaseAuth() {
    const [authUser, setAuthUser] = new useState(null);
    const [isLoading, setIsLoading] = new useState(true);

    const authStateChanged = async (user) => {
        setIsLoading(true);
        if(!user) {
            setAuthUser(null);
            setIsLoading(false);
            return;
        }
        setAuthUser({
            uid: user.id,
            email: user.email
        });
        setIsLoading(false);
    };

    const signOut = () => authSignOut(auth).then(() => {
        setAuthUser(null);
        setIsLoading(false);
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, authStateChanged);
        return () => unsubscribe();
    }, []);

    return {
        authUser,
        isLoading,
        signOut
    }
}

export function AuthUserProvider({ children }) {
    const auth = useFireBaseAuth();
    return <AuthUserContext.Provider value={auth}>{ children }</AuthUserContext.Provider>
}

export const useAuth = () => useContext(AuthUserContext);