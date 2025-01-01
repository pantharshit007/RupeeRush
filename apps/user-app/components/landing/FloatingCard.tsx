import React, { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { CreditCard as CreditCardIcon } from "lucide-react";

interface CreditCardProps {
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
}

const FloatingCard: React.FC<CreditCardProps> = ({
  cardNumber = "4242424242424242",
  cardHolder = "CULTURED MAN",
  expiryDate = "12/25",
  cvv = "666",
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <>
      <motion.div
        className="perspective-1000 w-full max-w-[400px] aspect-[1.586/1] cursor-pointer mt-8 md:hidden"
        onClick={handleFlip}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.25,
          type: "spring",
          damping: 10,
          stiffness: 100,
        }}
      >
        <motion.div
          className="relative w-full h-full"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front of the card */}
          <div className="absolute w-full h-full backface-hidden">
            <div className="w-full h-full rounded-2xl p-6 bg-gradient-to-br from-azureBlue-500 via-azureBlue-300 to-azureBlue-700   text-white shadow-xl">
              <div className="flex justify-between items-start px-2">
                <div className="">
                  <Image
                    src="https://cdn-icons-png.flaticon.com/512/9334/9334627.png"
                    alt="CREDIT"
                    width={45}
                    height={45}
                  />
                </div>
                <CreditCardIcon className="w-12 h-12" />
              </div>

              <div className="mt-8">
                <div className="text-2xl tracking-wider font-mono">
                  {cardNumber.match(/.{1,4}/g)?.join(" ") || "****"}
                </div>
              </div>

              <div className="mt-8 flex justify-between items-center">
                <div>
                  <div className="text-xs opacity-75">Card Holder</div>
                  <div className="font-medium tracking-wider">{cardHolder}</div>
                </div>
                <div>
                  <div className="text-xs opacity-75">Expires</div>
                  <div className="font-medium tracking-wider">{expiryDate}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Back of the card */}
          <div
            className="absolute w-full h-full backface-hidden -mt-5"
            style={{ transform: "rotateY(180deg)" }}
          >
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-azureBlue-500 via-azureBlue-300 to-azureBlue-700 text-white shadow-xl">
              <div className="w-full h-12 bg-black mt-6 rounded-t-2xl cc-shadow" />
              <div className="px-6 mt-8">
                <div className="bg-white/30 h-12 rounded flex items-center justify-end px-4">
                  <div className="font-mono text-lg">{cvv}</div>
                </div>
                <div className="mt-4 text-xs opacity-85 text-right">
                  This card is property of RupeeRush Bank. If found, please return it.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-5 text-center relative overflow-hidden md:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
      >
        <motion.div
          className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <p className="text-lg font-medium bg-gradient-to-r from-azureBlue-200 to-azureBlue-400 bg-clip-text text-transparent px-2 rounded-lg">
          Unlock Premium Benefits with Your Digital Card Today!
        </p>
      </motion.div>
    </>
  );
};

export default FloatingCard;
