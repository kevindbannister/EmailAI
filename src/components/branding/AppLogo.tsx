import { xProFlowLogoDark } from '../layout/logoAssets';

type AppLogoProps = {
  className?: string;
  alt?: string;
};

export const appLogoSrc = xProFlowLogoDark;

const AppLogo = ({ className = 'h-6 w-auto', alt = 'XProFlow' }: AppLogoProps) => {
  return <img src={appLogoSrc} alt={alt} className={className} />;
};

export default AppLogo;
