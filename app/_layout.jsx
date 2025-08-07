import { useEffect, useState } from 'react';
import { Stack, useRouter, SplashScreen } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import Toast from 'react-native-toast-message';
import { View, ActivityIndicator } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthChecking, setIsAuthChecking] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsAuthenticated(true);
                router.replace('/');
            } else {
                setIsAuthenticated(false);
                router.replace('/login');
            }
            setIsAuthChecking(false);
            SplashScreen.hideAsync();
        });

        return () => unsubscribe();
    }, []);

    if (isAuthChecking) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    return (
        <>
            <Stack screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    <>
                        <Stack.Screen name="index" options={{ title: 'Home' }} />
                        <Stack.Screen name="chat/[id]" options={{ title: 'Chat' }} />
                        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="login" options={{ title: 'Login' }} />
                        <Stack.Screen name="register" options={{ title: 'Register' }} />
                    </>
                )}
            </Stack>
            <Toast />
        </>
    );
}