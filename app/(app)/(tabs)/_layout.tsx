import { Tabs } from 'expo-router';
import { BarChart3, Map, Menu, Trophy, UserRound } from 'lucide-react-native';

import { useTheme } from '@/theme/ThemeContext';
import { font } from '@/theme/tokens';

export default function TabsLayout() {
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.deep,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontFamily: font.sansSemiBold,
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color, size }) => <UserRound color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="rating"
        options={{
          title: 'Рейтинг',
          tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="competitions"
        options={{
          title: 'Соревнования',
          tabBarIcon: ({ color, size }) => <Trophy color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Карта',
          tabBarIcon: ({ color, size }) => <Map color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'Ещё',
          tabBarIcon: ({ color, size }) => <Menu color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
