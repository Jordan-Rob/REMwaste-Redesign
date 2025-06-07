import { useState, useMemo, useEffect } from "react";
import { ChevronRight, Filter } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { ProgressStepper } from "@/components/ProgressStepper";
import { FilterSidebar } from "@/components/FilterSidebar";
import { SkipCard } from "@/components/SkipCard";
import { StickyFooter } from "@/components/StickyFooter";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { useSkips } from "@/hooks/useSkips";
import { Skip, FilterState } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function SkipSelection() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedSkip, setSelectedSkip] = useState<Skip | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Use real postcode from URL params or default
  const urlParams = new URLSearchParams(window.location.search);
  const postcode = urlParams.get('postcode') || 'NR32';
  const area = urlParams.get('area') || 'Lowestoft';
  
  const { data: skips = [], isLoading, error } = useSkips({ postcode, area });

  const [filters, setFilters] = useState<FilterState>({
    sizeCategories: [], // Empty by default to show all sizes
    maxPrice: 2000, // Higher default to show all prices
    properties: [], // Empty by default to show all properties
    sortBy: 'size-asc'
  });

  // Filter and sort skips
  const filteredAndSortedSkips = useMemo(() => {
    let filtered = skips.filter(skip => {
      // Size category filter - if no categories selected, show all
      const sizeCategory = skip.size <= 6 ? 'small' : skip.size <= 12 ? 'medium' : 'large';
      const sizeMatch = filters.sizeCategories.length === 0 || filters.sizeCategories.includes(sizeCategory);
      
      // Price filter
      const priceMatch = Number(skip.price_before_vat) <= filters.maxPrice;
      
      // Property filters - if no properties selected, show all
      const roadAllowedMatch = !filters.properties.includes('road-allowed') || skip.allowed_on_road;
      const heavyWasteMatch = !filters.properties.includes('heavy-waste') || skip.allows_heavy_waste;
      
      return sizeMatch && priceMatch && roadAllowedMatch && heavyWasteMatch;
    });

    // Sort filtered results
    switch (filters.sortBy) {
      case 'size-asc':
        filtered.sort((a, b) => a.size - b.size);
        break;
      case 'size-desc':
        filtered.sort((a, b) => b.size - a.size);
        break;
      case 'price-asc':
        filtered.sort((a, b) => Number(a.price_before_vat) - Number(b.price_before_vat));
        break;
      case 'price-desc':
        filtered.sort((a, b) => Number(b.price_before_vat) - Number(a.price_before_vat));
        break;
      case 'popular':
        filtered.sort((a, b) => (a.size === 4 ? -1 : 1));
        break;
    }

    return filtered;
  }, [skips, filters]);

  const handleSkipSelect = (skip: Skip) => {
    setSelectedSkip(skip);
    toast({
      title: "Skip Selected",
      description: `${skip.size} Yard Skip selected for £${skip.price_before_vat}`,
    });
  };

  const handleClearSelection = () => {
    setSelectedSkip(null);
  };

  const handleContinue = () => {
    if (selectedSkip) {
      // Store selected skip in localStorage for the permit check page
      localStorage.setItem('selectedSkip', JSON.stringify(selectedSkip));
      
      toast({
        title: "Continuing to Permit Check",
        description: "Redirecting to the permit check step...",
      });
      
      // Navigate to permit check page
      setLocation('/permit-check');
    }
  };

  const handleClearFilters = () => {
    setFilters({
      sizeCategories: [],
      maxPrice: 2000,
      properties: [],
      sortBy: 'size-asc'
    });
  };

  // Show error toast if API fails
  useEffect(() => {
    if (error) {
      toast({
        title: "Error Loading Skips",
        description: "Failed to load skip data. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-center">
            <ProgressStepper />
          </div>
          <div className="mt-6 flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <span>{postcode}</span>
            <ChevronRight className="w-4 h-4" />
            <span>{area}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-primary-600">Choose Skip Size</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Skip Size</h1>
          <p className="text-lg text-gray-600">
            Select the skip size that best suits your needs. All prices include VAT and {skips[0]?.hire_period_days || 14}-day hire period.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
            <FilterSidebar filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Skip Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-600">
                  {isLoading ? (
                    "Loading skips..."
                  ) : (
                    <>
                      <span className="font-medium">{filteredAndSortedSkips.length}</span> skips available in {area}
                    </>
                  )}
                </p>
              </div>
              <Button
                variant="outline"
                className="lg:hidden flex items-center space-x-2"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </Button>
            </div>

            {/* Content */}
            {isLoading ? (
              <LoadingSkeleton />
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-red-600 mb-4">Failed to load skips. Please try again.</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            ) : filteredAndSortedSkips.length === 0 ? (
              <EmptyState onClearFilters={handleClearFilters} />
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {filteredAndSortedSkips.map((skip) => (
                  <SkipCard
                    key={skip.id}
                    skip={skip}
                    isSelected={selectedSkip?.id === skip.id}
                    onSelect={() => handleSkipSelect(skip)}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Sticky Footer */}
      <StickyFooter
        selectedSkip={selectedSkip}
        onClearSelection={handleClearSelection}
        onContinue={handleContinue}
      />
    </div>
  );
}
