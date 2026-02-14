import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser, clearUser } from '@/store/slices/authSlice';
import type { LoginCredentials, SignupCredentials } from '@/types';
import { toast } from 'sonner';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user, isAuthenticated, isLoading } = useAppSelector(
        (state) => state.auth
    );


    const { data, error } = useQuery({
        queryKey: ['currentUser'],
        queryFn: authApi.getCurrentUser,
        enabled: !user && !isAuthenticated,
        retry: false,
    });


    useEffect(() => {
        if (data?.user) {
            dispatch(setUser(data.user));
        }
    }, [data, dispatch]);


    useEffect(() => {
        if (error) {
            dispatch(clearUser());
        }
    }, [error, dispatch]);

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: (credentials: LoginCredentials) =>
            authApi.login(credentials),
        onSuccess: (data) => {
            dispatch(setUser(data.user));
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
            toast.success('Login successful!');
            navigate('/dashboard');
        },
        onError: (error: any) => {
            const message =
                error.response?.data?.error || 'Login failed';
            toast.error(message);
        },
    });

    // Signup mutation
    const signupMutation = useMutation({
        mutationFn: (credentials: SignupCredentials) =>
            authApi.signup(credentials),
        onSuccess: (data) => {
            dispatch(setUser(data.user));
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
            toast.success('Account created successfully!');
            navigate('/dashboard');
        },
        onError: (error: any) => {
            const message =
                error.response?.data?.error || 'Signup failed';
            toast.error(message);
        },
    });

    // Logout mutation
    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            dispatch(clearUser());
            queryClient.clear();
            toast.success('Logged out successfully!');
            navigate('/login');
        },
        onError: () => {
            toast.error('Logout failed');
        },
    });

    return {
        user,
        isAuthenticated,
        isLoading,
        login: loginMutation.mutate,
        signup: signupMutation.mutate,
        logout: logoutMutation.mutate,
        isLoginLoading: loginMutation.isPending,
        isSignupLoading: signupMutation.isPending,
        isLogoutLoading: logoutMutation.isPending,
    };
};
