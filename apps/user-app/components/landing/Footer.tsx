import Link from "next/link";
import Image from "next/image";
import { FaFacebook } from "react-icons/fa";
import { BsLinkedin, BsTwitterX } from "react-icons/bs";
import { IoShareSocial } from "react-icons/io5";

import Logo from "public/logo1.jpg";

export default function Footer() {
  return (
    <footer className="text-landing/80 w-full bg-gradient-to-b from-azureBlue-400/15 to-azureBlue-700/5 border border-t-landing/40 ">
      <div className="max-w-screen-midx mx-auto px-5 py-8 ">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          {/* Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Image
                src={Logo}
                alt="RupeeRush Logo"
                width={70}
                height={70}
                className="rounded-full"
              />

              <span className="bg-gradient-to-b from-azureBlue-400 to-azureBlue-700 bg-clip-text text-3xl font-bold text-transparent pl-1">
                Rupee₹ush
              </span>
            </div>

            <p className="mb-6 text-landing w-[60%]">
              Revolutionizing digital banking for a smarter India with secure, instant transactions
              and comprehensive financial solutions.
            </p>

            <div className="flex space-x-4">
              <SocialLink href="#" icon="facebook" />
              <SocialLink href="#" icon="twitter" />
              <SocialLink href="#" icon="linkedin" />
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-landing font-semibold text-lg mb-6">Support</h3>
            <ul className="space-y-4">
              <FooterLink href="#">Help Center</FooterLink>
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
              <FooterLink href="#contact">Contact Us</FooterLink>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-4 px-4 border-t border-landing/40">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-lg">
              &copy; {new Date().getFullYear()} RupeeRush. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Image
                src="https://framerusercontent.com/images/sNVWj829o3oF8qReWcrueg25c.png"
                alt="PCI Compliant"
                width={55}
                height={35}
                style={{ width: "auto", height: "auto" }}
              />
              <Image
                src="https://framerusercontent.com/images/UrSNYwLfIXGxYMz28fjhYx3c.png"
                alt="QRC Compliant"
                width={55}
                height={35}
                style={{ width: "auto", height: "auto" }}
              />
              <Image
                src="https://framerusercontent.com/images/BFa4BpSMTtV62RfYefCwfM5mL0w.png"
                alt="AICPA Compliant"
                width={55}
                height={35}
                style={{ width: "auto", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }: { href: string; icon: string }) {
  const Icon =
    {
      facebook: FaFacebook,
      twitter: BsTwitterX,
      linkedin: BsLinkedin,
    }[icon] || IoShareSocial; // Provide a default icon

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-landing/60 dark:hover:text-white hover:text-landing transition-colors"
    >
      <Icon className="w-6 h-6" />
    </a>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <p>
      <Link
        href={href}
        className="text-landing/60 dark:hover:text-white hover:text-landing transition-colors"
      >
        {children}
      </Link>
    </p>
  );
}
