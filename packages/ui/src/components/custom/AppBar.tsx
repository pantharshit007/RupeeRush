import ButtonPrimary from "./ButtonPrimary.js";

interface AppbarProps {
  user?: {
    name?: string | null;
  };
  // TODO: can u figure out what the type should be here?
  onSignin: any;
  onSignout: any;
}

const Appbar = ({ user, onSignin, onSignout }: AppbarProps) => {
  return (
    <div className="flex justify-between border-b border-slate-300 px-4 h-[3.5rem] bg-[#f7f7fa]">
      <div className="text-2xl flex flex-col justify-center text-richPurple-600 font-bold italic">
        RupeeRush
      </div>
      <div className="flex flex-col justify-center pt-2">
        <ButtonPrimary onClick={user ? onSignout : onSignin}>
          {user ? "Logout" : "Login"}
        </ButtonPrimary>
      </div>
    </div>
  );
};

export default Appbar;
