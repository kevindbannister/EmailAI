import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

type WelcomeEntryProps = {
  className?: string;
};

const WelcomeEntry = ({ className }: WelcomeEntryProps) => {
  const navigate = useNavigate();

  return (
    <div className={className}>
      {/* TEMP_ONBOARDING_ENTRY: remove once onboarding launches automatically for new users. */}
      <Button
        type="button"
        onClick={() => navigate('/onboarding')}
        className="w-full bg-gradient-to-r from-violet-300 to-amber-200 text-base font-semibold text-slate-900 shadow-none hover:from-violet-200 hover:to-amber-100 sm:w-auto"
      >
        Welcome to XProFlow
      </Button>
    </div>
  );
};

export default WelcomeEntry;
