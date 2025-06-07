import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Ruler, AlertTriangle } from "lucide-react";
import { Skip } from "@/lib/types";
import { motion } from "framer-motion";
import { SkipImage } from "./SkipImage";

interface SkipCardProps {
  skip: Skip;
  isSelected?: boolean;
  onSelect: () => void;
}

export function SkipCard({ skip, isSelected = false, onSelect }: SkipCardProps) {
  const totalPrice = skip.price_before_vat;
  const isPopular = skip.size === 4; // Mark 4-yard as popular for demo
  const requiresPermit = !skip.allowed_on_road;

  // Calculate dimensions based on size (approximate)
  const getDimensions = (size: number) => {
    switch (size) {
      case 4: return "6ft x 4ft x 3ft";
      case 6: return "7ft x 4ft x 3ft";
      case 8: return "8ft x 5ft x 4ft";
      case 10: return "10ft x 6ft x 4ft";
      case 12: return "12ft x 6ft x 5ft";
      case 14: return "12ft x 7ft x 5ft";
      case 16: return "14ft x 7ft x 5ft";
      case 20: return "16ft x 8ft x 6ft";
      default: return "Various sizes";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className={`overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
          isSelected ? 'ring-2 ring-primary-600 ring-offset-2 shadow-lg' : 'hover:shadow-md'
        }`}
        onClick={onSelect}
      >
        <div className="relative">
          {/* Skip Image */}
          <div className="w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100">
            <SkipImage size={skip.size} className="w-full h-full" />
          </div>
          
          {/* Size Badge */}
          <Badge className="absolute top-3 right-3 bg-primary-600 text-white">
            {skip.size} Yards
          </Badge>
          
          {/* Popular Badge */}
          {isPopular && (
            <Badge className="absolute top-3 left-3 bg-green-500 text-white">
              Most Popular
            </Badge>
          )}
          
          {/* Permit Warning */}
          {requiresPermit && (
            <Badge className="absolute bottom-3 left-3 bg-orange-500 text-white flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Not Allowed On The Road
            </Badge>
          )}
        </div>
        
        <CardContent className="p-6 flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {skip.size} Yard Skip
              </h3>
              <p className="text-sm text-gray-600">
                {skip.size <= 6 
                  ? 'Perfect for household clearouts'
                  : skip.size <= 12 
                  ? 'Ideal for small renovations'
                  : 'Great for large projects'
                }
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">£{totalPrice}</p>
              <p className="text-sm text-gray-500">inc. VAT</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{skip.hire_period_days} days</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Ruler className="w-4 h-4" />
              <span>{getDimensions(skip.size)}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {skip.allowed_on_road ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                ✓ Road Allowed
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                ⚠ Permit Required
              </Badge>
            )}
            
            {skip.allows_heavy_waste && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                ✓ Heavy Waste OK
              </Badge>
            )}
          </div>

          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 mt-4 relative z-10"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            size="lg"
          >
            {isSelected ? "✓ Selected" : "Select This Skip →"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
