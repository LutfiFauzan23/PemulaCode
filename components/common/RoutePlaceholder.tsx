import { AppText } from '@/components/ui/AppText';
import { ScreenContainer } from '@/components/layout/ScreenContainer';

export type RoutePlaceholderProps = {
  title: string;
  subtitle?: string;
};

export function RoutePlaceholder({ title, subtitle }: RoutePlaceholderProps) {
  return (
    <ScreenContainer className="items-center justify-center">
      <AppText className="text-center" variant="title">
        {title}
      </AppText>
      {subtitle ? (
        <AppText className="mt-2 text-center" variant="body">
          {subtitle}
        </AppText>
      ) : null}
    </ScreenContainer>
  );
}
