import { Button } from "@/components/ui/button";
import { Skip } from "@/lib/types";
import { motion } from "framer-motion";

interface StickyFooterProps {
  selectedSkip: Skip | null;
  onClearSelection: () => void;
  onContinue: () => void;
}

export function StickyFooter({ selectedSkip, onClearSelection, onContinue }: StickyFooterProps) {
  if (!selectedSkip) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
            <div className="text-white text-xs font-bold">
              {selectedSkip.size}Y
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {selectedSkip.size} Yard Skip
            </p>
            <p className="text-sm text-gray-600">
              £{selectedSkip.price_before_vat} inc. VAT • {selectedSkip.hire_period_days} day hire period
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={onClearSelection}
            className="text-gray-600 hover:text-gray-800 bg-[#e4e5e6]"
          >
            Clear
          </Button>
          <Button
            onClick={onContinue}
            className="px-8 py-3 hover:bg-primary-700 text-white font-semibold bg-[#2463eb]"
          >
            Continue to Permit Check
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
