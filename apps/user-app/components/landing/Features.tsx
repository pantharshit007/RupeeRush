import { Wallet, PiggyBank as Bank, Users, Briefcase, Shield, Zap, Clipboard } from "lucide-react";

export default function Features() {
  return (
    <section id="#features" className="wrapper mt-20 ">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for Modern Banking
          </h2>
          <p className="text-landing/80 text-lg tracking-tight max-w-2xl mx-auto">
            Experience seamless transactions with our comprehensive suite of banking features
            designed for your convenience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Wallet className="w-8 h-8 text-[#3894FF]" />}
            title="Wallet-to-Bank"
            description="Instantly transfer funds between your digital wallet and bank account with zero hassle."
          />
          <FeatureCard
            icon={<Bank className="w-8 h-8 text-[#3894FF]" />}
            title="Bank-to-Wallet"
            description="Load your digital wallet directly from your bank account in real-time."
          />
          <FeatureCard
            icon={<Users className="w-8 h-8 text-[#3894FF]" />}
            title="P2P Transfers"
            description="Send money to friends and family instantly using just their phone number or UPI ID."
          />
          <FeatureCard
            icon={<Briefcase className="w-8 h-8 text-[#3894FF]" />}
            title="B2B Transfers"
            description="Secure and efficient business payments with comprehensive transaction tracking."
          />
        </div>

        {/* <!-- Additional Features Banner --> */}
        <div className="mt-16 bg-azureBlue-700/5 rounded-2xl p-8 md:p-12 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeaturePoints
              icon={<Shield className="w-6 h-6 text-[#3894FF]" />}
              title="Bank-Grade Security"
              description="Protected by advanced encryption and multi-factor authentication."
            />

            <FeaturePoints
              icon={<Zap className="w-6 h-6 text-[#3894FF]" />}
              title="Instant Transfers"
              description="Experience lightning-fast transactions 24/7, anytime, anywhere."
            />

            <FeaturePoints
              icon={<Clipboard className="w-6 h-6 text-[#3894FF]" />}
              title="Smart Tracking"
              description="Monitor all your transactions with detailed analytics and insights."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group h-[250px] bg-azureBlue-700/5 p-6  rounded-xl border border-gray-200 dark:border-gray-600 hover:border-azureBlue-400 dark:hover:border-azureBlue-400 transition-all duration-300">
      <div className="w-14 h-14 rounded-lg flex items-center justify-center group-hover:bg-[#3894FF]/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-landing/70 ">{description}</p>
    </div>
  );
}

function FeaturePoints({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <h4 className="font-bold mb-2">{title}</h4>
        <p className="text-landing/60">{description}</p>
      </div>
    </div>
  );
}
