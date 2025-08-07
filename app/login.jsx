
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { LogOut, ChevronRight, Settings } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import {
  collectionGroup,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';

import { auth, logout } from '../services/authService';
import { db } from '../services/firebaseConfig';
import { getAllUsers } from '../services/chatService';

export default function HomeScreen() {
  const router = useRouter();
  const [allUsers, setAllUsers] = useState([]);
  const [recentChatUsers, setRecentChatUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Initial auth + user fetch
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        await fetchUsersAndMessages(user.uid);
      } else {
        router.replace('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Refetch data when screen refocuses
  useFocusEffect(
    React.useCallback(() => {
      if (auth.currentUser) {
        fetchUsersAndMessages(auth.currentUser.uid);
      }
    }, [])
  );

  // Real-time message listener
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collectionGroup(db, 'messages'),
      where('receiver', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docChanges().filter(change => change.type === 'added');
      if (newMessages.length > 0) {
        Toast.show({
          type: 'info',
          text1: '📨 New Message',
          text2: 'Someone just messaged you!',
          position: 'bottom',
        });
        // Refresh the user and message lists
        fetchUsersAndMessages(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Combined fetch function for both users and recent messages
  const fetchUsersAndMessages = async (currentUid) => {
    const allFetchedUsers = await getAllUsers();

    // Filter out the current user
    const otherUsers = allFetchedUsers.filter((u) => u.uid !== currentUid);
    setAllUsers(otherUsers);

    // 💡 New: For demonstration, let's assume the first 3 users are recent chat partners
    const recentUsers = otherUsers.slice(0, 3);
    setRecentChatUsers(recentUsers);
  };

  // Pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsersAndMessages(currentUser?.uid);
    setRefreshing(false);
  };

  // Navigate to chat screen
  const handleOpenChat = (user) => {
    router.push(`/chat/${user.uid}?email=${encodeURIComponent(user.email)}`);
  };

  // Settings nav
  const handleSettings = () => {
    router.push('/settings');
  };

  // Logout
  const handleLogout = async () => {
    try {
      await logout();
      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'You have been successfully logged out.',
        position: 'bottom',
      });
      router.replace('/login');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: 'An error occurred during logout. Please try again.',
        position: 'bottom',
      });
    }
  };

  // Render user cards
  const renderUserItem = ({ item }) => (
    <TouchableOpacity style={styles.userCard} onPress={() => handleOpenChat(item)}>
      <View style={styles.userAvatar}>
        <Text style={styles.avatarText}>{item.email.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={styles.userEmail}>{item.email}</Text>
      <ChevronRight size={24} color="#666" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={handleSettings} style={styles.iconButton}>
            <Settings size={24} color="#007bff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
            <LogOut size={24} color="#007bff" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.currentUserEmail}>{currentUser?.email}</Text>

      {/* 💡 New: "My Messages" Section */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>My Messages</Text>
          {recentChatUsers.length > 0 ? (
            <FlatList
              data={recentChatUsers}
              keyExtractor={(item) => item.uid}
              renderItem={renderUserItem}
              scrollEnabled={false} // Prevents nested scrolling issues
            />
          ) : (
            <Text style={styles.emptyListText}>You have no recent messages.</Text>
          )}
        </View>

     

        {/* 💡 "Users" Section (formerly "Start a Chat") */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Users</Text>
          <FlatList
            data={allUsers}
            keyExtractor={(item) => item.uid}
            renderItem={renderUserItem}
            scrollEnabled={false} // Prevents nested scrolling issues
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '300',
    color: '#666',
  },
  currentUserEmail: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 24,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userEmail: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  emptyListText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
});