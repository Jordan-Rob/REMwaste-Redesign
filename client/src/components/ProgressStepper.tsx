import { MapPin, Trash2, Package, CheckSquare, Calendar, CreditCard } from "lucide-react";
import { useLocation } from "wouter";

export function ProgressStepper() {
  const [location] = useLocation();
  
  const getSteps = () => {
    const baseSteps = [
      { id: 1, label: "Postcode", icon: MapPin },
      { id: 2, label: "Waste Type", icon: Trash2 },
      { id: 3, label: "Select Skip", icon: Package },
      { id: 4, label: "Permit Check", icon: CheckSquare },
      { id: 5, label: "Choose Date", icon: Calendar },
      { id: 6, label: "Payment", icon: CreditCard },
    ];

    return baseSteps.map(step => {
      if (location === '/permit-check') {
        return {
          ...step,
          completed: step.id <= 3,
          current: step.id === 4
        };
      } else {
        // Default to skip selection page
        return {
          ...step,
          completed: step.id <= 2,
          current: step.id === 3
        };
      }
    });
  };

  const steps = getSteps();
  
  return (
    <nav className="hidden md:flex space-x-4 lg:space-x-8">
      {steps.map((step) => {
        const Icon = step.icon;
        const isCompleted = step.completed;
        const isCurrent = step.current;
        
        return (
          <div 
            key={step.id}
            className={`flex items-center space-x-2 ${
              isCurrent ? 'text-primary-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isCurrent 
                ? 'bg-primary-600 shadow-lg ring-2 ring-primary-200' 
                : isCompleted 
                ? 'bg-green-600' 
                : 'border-2 border-gray-300 bg-white'
            }`}>
              {isCompleted ? (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : isCurrent ? (
                <Icon className="w-4 h-4 text-white" />
              ) : (
                <span className="text-xs font-medium text-gray-500">{step.id}</span>
              )}
            </div>
            <span className={`text-xs md:text-sm font-medium ${isCurrent ? 'font-semibold' : ''}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </nav>
  );
}
