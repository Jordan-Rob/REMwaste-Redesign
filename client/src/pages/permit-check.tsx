import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressStepper } from "@/components/ProgressStepper";
import { Home, MapPin, AlertCircle, ArrowLeft } from "lucide-react";
import { Skip } from "@/lib/types";
import { motion } from "framer-motion";

export default function PermitCheck() {
  const [, setLocation] = useLocation();
  const [selectedPlacement, setSelectedPlacement] = useState<'private' | 'public' | null>(null);
  const [selectedSkip, setSelectedSkip] = useState<Skip | null>(null);

  // Get skip data from localStorage or URL params
  useEffect(() => {
    const skipData = localStorage.getItem('selectedSkip');
    if (skipData) {
      setSelectedSkip(JSON.parse(skipData));
    }
  }, []);

  const handlePlacementSelect = (placement: 'private' | 'public') => {
    setSelectedPlacement(placement);
  };

  const handleBack = () => {
    setLocation('/');
  };

  const handleContinue = () => {
    if (selectedPlacement && selectedSkip) {
      // Store placement choice
      localStorage.setItem('selectedPlacement', selectedPlacement);
      
      // Navigate to date selection (or next step)
      console.log('Continue to date selection with placement:', selectedPlacement);
      // setLocation('/date-selection');
    }
  };

  const canPlaceOnRoad = selectedSkip?.allowed_on_road;
  const showRoadWarning = selectedPlacement === 'public' && !canPlaceOnRoad;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">REMwaste</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Need help?</span>
              <Button variant="ghost" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <ProgressStepper />
          <div className="mt-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Where will the skip be placed?
            </h1>
            <p className="text-lg text-gray-600">
              This helps us determine if you need a permit for your skip
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Private Property Option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedPlacement === 'private' ? 'ring-2 ring-primary-600 ring-offset-2' : ''
              }`}
              onClick={() => handlePlacementSelect('private')}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                  <Home className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Private Property
                </h3>
                <p className="text-gray-600 mb-4">
                  Driveway or private land
                </p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">
                    No permit required when placed on your private property
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Public Road Option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedPlacement === 'public' ? 'ring-2 ring-primary-600 ring-offset-2' : ''
              }`}
              onClick={() => handlePlacementSelect('public')}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Public Road
                </h3>
                <p className="text-gray-600 mb-4">
                  Council or public property
                </p>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-orange-800 font-medium">
                    Permit required for placement on public roads
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Road Placement Warning */}
        {showRoadWarning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-900 mb-2">
                      Road Placement Not Available
                    </h4>
                    <p className="text-sm text-red-800 mb-4">
                      The skip size that you've chosen can not be placed on public roads due to road safety 
                      regulations. Please ensure you have adequate private space or choose a different skip size.
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="bg-primary-600 text-white border-primary-600 hover:bg-primary-700"
                    >
                      ← Choose Different Skip
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Skip Summary */}
        {selectedSkip && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Selected Skip</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {selectedSkip.size}Y
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedSkip.size} Yard Skip
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedSkip.hire_period_days} day hire period
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      £{selectedSkip.price_before_vat}
                    </p>
                    <p className="text-sm text-gray-500">inc. VAT</p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  {selectedSkip.allowed_on_road ? (
                    <Badge className="bg-green-100 text-green-800">
                      ✓ Road Placement Available
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">
                      ⚠ Private Property Only
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-800 bg-[#e4e5e6]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selectedPlacement || showRoadWarning}
            className="px-8 py-3 hover:bg-primary-700 text-white font-semibold bg-[#2463eb] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </Button>
        </div>
      </main>
    </div>
  );
}