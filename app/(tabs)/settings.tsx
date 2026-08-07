import { appConfig } from '@/constants/app';
import { RoutePlaceholder } from '@/components/common/RoutePlaceholder';

export default function SettingsScreen() {
  return <RoutePlaceholder title="Settings" subtitle={`Version ${appConfig.version ?? 'not available'}`} />;
}
