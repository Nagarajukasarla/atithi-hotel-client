import * as React from "react";
import {
    authService,
    type SignInPayload,
    type SignUpPayload,
    type UserDto,
    type AuthResponse,
} from "@/api/auth-service";

export interface AuthContextType {
    user: UserDto | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (payload: SignInPayload) => Promise<AuthResponse>;
    signup: (payload: SignUpPayload) => Promise<AuthResponse>;
    logout: () => Promise<void>;
    refetchUser: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<UserDto | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchCurrentUser = React.useCallback(async () => {
        try {
            const response = await authService.getCurrentUser();
            if (response.success && response.data) {
                setUser(response.data);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        void fetchCurrentUser();
    }, [fetchCurrentUser]);

    const login = async (payload: SignInPayload): Promise<AuthResponse> => {
        const res = await authService.signIn(payload);
        if (res.user) {
            setUser(res.user);
        } else {
            await fetchCurrentUser();
        }
        return res;
    };

    const signup = async (payload: SignUpPayload): Promise<AuthResponse> => {
        const res = await authService.signUp(payload);
        if (res.user) {
            setUser(res.user);
        } else {
            await fetchCurrentUser();
        }
        return res;
    };

    const logout = async (): Promise<void> => {
        try {
            await authService.logout();
        } finally {
            setUser(null);
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        signup,
        logout,
        refetchUser: fetchCurrentUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}
