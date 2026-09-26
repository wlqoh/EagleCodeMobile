import { Image } from 'react-native';

type LogoProps = {
  size?: number;
};

export function Logo({ size = 40 }: LogoProps) {
  return (
    <Image
      source={require('../../../assets/icon.png')}
      style={{ width: size, height: size, borderRadius: size * 0.1875 }}
      resizeMode="cover"
    />
  );
}
