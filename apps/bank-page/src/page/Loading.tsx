import Logo from "@/assets/RR_Bank.png";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
      <div className="text-center">
        <div className="relative inline-flex items-center justify-center w-32 h-32 mb-8">
          <div className="absolute w-full h-full rounded-full border-4 border-t-primary border-r-primary border-b-primary border-l-transparent animate-spin"></div>
          <img src={Logo} alt="RupeeRush" width={52} height={52} />
        </div>
        <h2 className="text-2xl font-semibold text-gray-300">Don&apos;t close this window</h2>

        <p className="text-gray-400 dark:text-gray-400 pt-4">
          We are fetching your payment details...
        </p>
      </div>
    </div>
  );
}
