import { Redirect } from 'expo-router';

export default function IndexScreen() {
  return <Redirect href="/splash" />;
}

// import { SafeAreaView } from 'react-native-safe-area-context';

// <SafeAreaView
//   style={{ flex: 1 }}
//   edges={['top']}
// >
//   {/* UI kamu */}
// </SafeAreaView>