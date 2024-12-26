import { Button } from "@repo/ui/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed w-full bg-black/75 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-primary">RupeeRush</h1>
            <div className="hidden md:flex space-x-6">
              <a href="#features" className="text-slate-400 hover:text-primary transition-colors">
                Features
              </a>
              <a href="#about" className="text-slate-400 hover:text-primary transition-colors">
                About
              </a>
              <a href="#contact" className="text-slate-400 hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4 pr-6">
            <Button variant="outline" className="text-azureBlue-500">
              Sign In
            </Button>
            <Button variant={"outline"} className="text-white bg-transparent">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
