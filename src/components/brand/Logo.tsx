import Svg, { Path, Rect } from 'react-native-svg';

type LogoProps = {
  size?: number;
};

/** Знак орла — перенесён из `EagleCode/public/favicon.svg`. */
export function Logo({ size = 40 }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Rect width={64} height={64} rx={12} fill="#121413" />
      <Path
        d="M12 36 28 10l5 14 19 3-12 9 5 18-14-10-15 10 5-17z"
        fill="none"
        stroke="#37e787"
        strokeWidth={5}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
