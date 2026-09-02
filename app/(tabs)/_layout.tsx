import { Tabs } from 'expo-router';

import {
  Home,
  MessageCircleMore,
  BookOpenCheck,
  User,
  Trophy,
  Settings,
} from 'lucide-react-native';

import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

import { SafeAreaView } from 'react-native-safe-area-context';

export const TAB_BAR_CLEARANCE = 100;

// ======================================================
// TAB YANG BOLEH MUNCUL DI BOTTOM NAVBAR
// ======================================================

const TAB_CONFIG: Record<string, any> = {
  index: {
    icon: Home,
    label: 'Home',
  },

  community: {
    icon: MessageCircleMore,
    label: 'Community',
  },

  learn: {
    icon: BookOpenCheck,
    label: 'Learn',
  },

  profile: {
    icon: User,
    label: 'Profile',
  },

  leaderboard: {
    icon: Trophy,
    label: 'Leaderboard',
  },

  settings: {
    icon: Settings,
    label: 'Setting',
  }
};


// ======================================================
// CUSTOM TAB BAR
// ======================================================

function CustomTabBar({
  state,
  descriptors,
  navigation,
}: any) {

  // HANYA 5 ROUTE INI YANG BOLEH MUNCUL
  const TAB_ORDER = ['index', 'community', 'learn', 'profile', 'leaderboard', 'settings'];
  const visibleRoutes = state.routes.filter(
    (route: any) =>
      Object.prototype.hasOwnProperty.call(
        TAB_CONFIG,
        route.name
      )
  );
  visibleRoutes.sort(
  (a: any, b: any) => TAB_ORDER.indexOf(a.name) - TAB_ORDER.indexOf(b.name)
);
  return (
    <View style={styles.bottomContainer}>
      <View style={styles.navbar}>

        {visibleRoutes.map((route: any) => {
          const originalIndex = state.routes.findIndex(
            (r: any) => r.key === route.key
          );

          const { options } = descriptors[route.key];

          const isFocused =
            state.index === originalIndex;

          const config = TAB_CONFIG[route.name];

          const Icon = config.icon;
          const label = config.label;


          // ============================================
          // NAVIGATE
          // ============================================

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (
              !isFocused &&
              !event.defaultPrevented
            ) {
              navigation.navigate(route.name);
            }
          };


          return (
            <TabButton
              key={route.key}
              Icon={Icon}
              label={label}
              isFocused={isFocused}
              options={options}
              onPress={onPress}
            />
          );
        })}

      </View>
    </View>
  );
}


// ======================================================
// TAB BUTTON
// ======================================================

function TabButton({
  Icon,
  label,
  isFocused,
  options,
  onPress,
}: any) {

  const scale = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 50,
      bounciness: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 12,
    }).start();
  };


  return (
    <View style={styles.tabWrapper}>

      <Pressable
        onPress={onPress}

        onPressIn={handlePressIn}

        onPressOut={handlePressOut}

        accessibilityRole="tab"

        accessibilityState={{
          selected: isFocused,
        }}

        accessibilityLabel={
          options.tabBarAccessibilityLabel ??
          label
        }

        hitSlop={8}
      >

        <Animated.View
          style={[
            styles.tab,

            isFocused && styles.activeTab,

            {
              transform: [
                {
                  scale,
                },
              ],
            },
          ]}
        >

          <Icon
            size={26}

            color={
              isFocused
                ? colors.light.primary
                : colors.light.onSurfaceVariant
            }

            strokeWidth={
              isFocused ? 2.6 : 2
            }
          />


          {isFocused && (
            <AppText
              color={colors.light.primary}

              style={styles.activeLabel}

              numberOfLines={1}
            >
              {label}
            </AppText>
          )}

        </Animated.View>

      </Pressable>

    </View>
  );
}


// ======================================================
// TABS LAYOUT
// ======================================================

export default function TabsLayout() {
  return (
    <SafeAreaView
      edges={['top']}
      style={{
        flex: 1,
        backgroundColor: colors.light.background,
      }}
    >
      <Tabs
        tabBar={(props) => (
          <CustomTabBar {...props} />
        )}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
          }}
        />

        <Tabs.Screen
          name="community"
          options={{
            title: 'Community',
          }}
        />

        <Tabs.Screen
          name="learn"
          options={{
            title: 'Learn',
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}


// ======================================================
// STYLE
// ======================================================

const styles = StyleSheet.create({

  bottomContainer: {
    position: 'absolute',

    left: 12,
    right: 12,

    bottom:
      Platform.OS === 'ios'
        ? 18
        : 12,
  },


  navbar: {
    height: 68,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 4,

    backgroundColor: '#FFFFFF',

    borderRadius: 22,

    borderWidth: 1,

    borderColor: '#E5E7EB',

    elevation: 8,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.10,

    shadowRadius: 10,
  },


  tabWrapper: {
    flex: 1,

    height: '100%',

    alignItems: 'center',

    justifyContent: 'center',
  },


  tab: {
    minWidth: 48,

    height: 52,

    paddingHorizontal: 6,

    borderRadius: 17,

    flexDirection: 'column',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 2,
  },


  activeTab: {
    backgroundColor:
      colors.light.primaryContainer,

    paddingHorizontal: 11,

    borderRadius: 17,
  },


  activeLabel: {
    fontFamily:
      typography.family.sansBold,

    fontSize: 9.5,

    lineHeight: 13,

    textAlign: 'center',
  },

});