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
  cardNumber = "4242 4242 4242 4242",
  cardHolder = "JOHN DOE",
  expiryDate = "12/25",
  cvv = "123",
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  // 9599311225
  return (
    <div
      className="perspective-1000 w-full max-w-[400px] aspect-[1.586/1] cursor-pointer"
      onClick={handleFlip}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of the card */}
        <div className="absolute w-full h-full backface-hidden">
          <div className="w-full h-full rounded-2xl p-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl">
            <div className="flex justify-between items-start">
              <div className="">
                <Image
                  src="https://cdn-icons-png.flaticon.com/512/9334/9334627.png"
                  alt="CREDIT"
                  width={40}
                  height={40}
                />
              </div>
              <CreditCardIcon className="w-12 h-12" />
            </div>

            <div className="mt-8">
              <div className="text-2xl tracking-wider font-mono">
                {cardNumber.match(/.{1,4}/g)?.join(" ")}
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
          className="absolute w-full h-full backface-hidden -mt-2"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl">
            <div className="w-full h-12 bg-black mt-6" />
            <div className="px-6 mt-8">
              <div className="bg-white/30 h-12 rounded flex items-center justify-end px-4">
                <div className="font-mono text-lg">{cvv}</div>
              </div>
              <div className="mt-4 text-xs opacity-75 text-right">
                This card is property of Your Bank Name. If found, please return it.
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FloatingCard;
