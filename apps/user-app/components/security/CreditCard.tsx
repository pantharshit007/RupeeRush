"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { CardDataItem } from "@/components/security/CardData";

export interface CreditCardProps {
  cardNumber: string;
  cardHolder: string;
  cardExpiry: string;
  cardCvv: string;
}

export const CreditCard = ({ cardNumber, cardHolder, cardExpiry, cardCvv }: CreditCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showCVV, setShowCVV] = useState(false);
  const [isDataVisible, setIsDataVisible] = useState(false);

  const formatCardNumber = (number: string) => {
    return number.replace(/(\d{4})/g, "$1 ").trim();
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="space-y-6">
      <motion.div
        className="relative w-96 max-md:w-[25rem] max-sm:w-[23rem] max-w-full h-56 cursor-pointer perspective-1000"
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
          {/* Front of card */}
          <div className="absolute w-full h-full backface-hidden">
            <div className="w-full h-full rounded-2xl p-6 bg-gradient-to-br from-azureBlue-500 via-azureBlue-300 to-azureBlue-700  text-white shadow-xl">
              <div className="flex justify-between items-center">
                <div className="">
                  <Image
                    src="https://cdn-icons-png.flaticon.com/512/9334/9334627.png"
                    alt="CREDIT"
                    width={40}
                    height={40}
                  />
                </div>
                <div className="h-full">RUPEE RUSH</div>
              </div>

              <div className="mt-8">
                <div className="text-2xl tracking-wider font-mono">
                  {formatCardNumber(cardNumber)}
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <div>
                  <div className="text-xs opacity-75">Card Holder</div>
                  <div className="tracking-wider font-medium">{cardHolder}</div>
                </div>
                <div>
                  <div className="text-xs opacity-75">Expires</div>
                  <div className="tracking-wider font-medium">{cardExpiry}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Back of card */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 -mt-5">
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-azureBlue-500 via-azureBlue-300 to-azureBlue-700 text-white shadow-xl">
              <div className="w-full h-12 bg-black mt-6 rounded-t-2xl cc-shadow" />

              <div className="px-6 mt-8">
                <div className="flex justify-end items-center relative">
                  <div className="bg-white/30 h-10 w-full rounded flex items-center justify-end px-4 pt-1">
                    <div className="font-mono text-lg">{showCVV ? cardCvv : "***"}</div>
                  </div>

                  {/* CVV Toggle Button*/}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCVV(!showCVV);
                    }}
                    className="flex absolute -right-6 top-1/2 -translate-y-1/2 items-center justify-center w-6 h-6 text-white rounded-full shadow-lg hover:bg-gray-600 transition-colors p-1"
                  >
                    {showCVV ? <EyeOff className="w-5 h-5 " /> : <Eye className="w-5 h-5 " />}
                  </button>
                </div>
                <div className="mt-8 text-xs opacity-75 text-center">
                  This card is property of RupeeRush. Misuse is criminal offense.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* CARD DATA */}
      <Card className="w-full max-w-md">
        <CardContent className="p-0">
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center p-4"
            onClick={() => setIsDataVisible(!isDataVisible)}
          >
            <span>Card Details</span>
            {isDataVisible ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          {isDataVisible && (
            <div className="p-4 space-y-4">
              <CardDataItem label="Card Number" value={cardNumber} />
              <CardDataItem label="Expiry Date" value={cardExpiry} />

              <CardDataItem label="CVV" value={cardCvv} isSecret />
              <CardDataItem label="Card Holder" value={cardHolder} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
