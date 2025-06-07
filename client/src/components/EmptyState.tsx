import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface EmptyStateProps {
  onClearFilters: () => void;
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <Search className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No skips found</h3>
      <p className="text-gray-600 mb-6">
        Try adjusting your filters or search criteria to find available skips.
      </p>
      <Button 
        onClick={onClearFilters}
        className="bg-primary-600 hover:bg-primary-700 text-white font-semibold"
      >
        Clear All Filters
      </Button>
    </div>
  );
}
