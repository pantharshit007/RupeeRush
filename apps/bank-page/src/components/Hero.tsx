import { Button } from "@repo/ui/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center">
      <div className="absolute inset-0 subtle-bg -z-10" />
      <div className="container mx-auto px-4">
        <div className="max-w-3xl animate-fade-up">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Banking Reimagined for the Digital Age
          </h1>
          <p className="text-xl text-white/70 mb-8">
            Experience seamless banking with RupeeRush. Smart features, better security, and a
            banking experience that puts you first.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-white/95 text-primary hover:bg-white/90">
              Open Account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white bg-transparent hover:text-azureBlue-500"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
