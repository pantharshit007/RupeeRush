import { Shield, Smartphone, Clock, CreditCard } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure Banking",
    description: "Bank with confidence using our state-of-the-art security systems",
  },
  {
    icon: Smartphone,
    title: "Mobile Banking",
    description: "Manage your finances anytime, anywhere with our mobile app",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock customer support for all your banking needs",
  },
  {
    icon: CreditCard,
    title: "Smart Cards",
    description: "Next-generation cards with advanced features and controls",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose RupeeRush</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
