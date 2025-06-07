import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Info } from "lucide-react";
import { FilterState } from "@/lib/types";

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleSizeCategory = (category: string) => {
    const newCategories = filters.sizeCategories.includes(category)
      ? filters.sizeCategories.filter(c => c !== category)
      : [...filters.sizeCategories, category];
    updateFilter('sizeCategories', newCategories);
  };

  const toggleProperty = (property: string) => {
    const newProperties = filters.properties.includes(property)
      ? filters.properties.filter(p => p !== property)
      : [...filters.properties, property];
    updateFilter('properties', newProperties);
  };

  return (
    <aside className="w-full lg:w-80 space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter & Sort</h3>
          
          {/* Sort Options */}
          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-2">Sort by</Label>
            <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="size-asc">Size: Small to Large</SelectItem>
                <SelectItem value="size-desc">Size: Large to Small</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Skip Size Filter */}
          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-3">Skip Size</Label>
            <div className="space-y-2">
              {[
                { value: 'small', label: 'Small (4-6 yards)' },
                { value: 'medium', label: 'Medium (8-12 yards)' },
                { value: 'large', label: 'Large (14+ yards)' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={filters.sizeCategories.includes(option.value)}
                    onCheckedChange={() => toggleSizeCategory(option.value)}
                  />
                  <Label htmlFor={option.value} className="text-sm text-gray-600">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-3">Price Range</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">£200</span>
                <span className="text-gray-600">£2000</span>
              </div>
              <Slider
                value={[filters.maxPrice]}
                onValueChange={(value) => updateFilter('maxPrice', value[0])}
                min={200}
                max={2000}
                step={50}
                className="w-full"
              />
              <div className="text-center">
                <span className="text-sm font-medium text-gray-900">
                  Up to £{filters.maxPrice}
                </span>
              </div>
            </div>
          </div>

          {/* Property Filters */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3">Properties</Label>
            <div className="space-y-2">
              {[
                { value: 'road-allowed', label: 'Allowed on road' },
                { value: 'heavy-waste', label: 'Heavy waste allowed' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={filters.properties.includes(option.value)}
                    onCheckedChange={() => toggleProperty(option.value)}
                  />
                  <Label htmlFor={option.value} className="text-sm text-gray-600">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="bg-primary-50 border-primary-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-3">
            <Info className="w-5 h-5 text-primary-600" />
            <h4 className="font-semibold text-primary-900">Quick Tips</h4>
          </div>
          <ul className="text-sm text-primary-700 space-y-2">
            <li>• 4-6 yard skips are perfect for household clearouts</li>
            <li>• 8-12 yard skips suit small renovation projects</li>
            <li>• 14+ yard skips are ideal for large construction work</li>
            <li>• Road permits may be required for some locations</li>
          </ul>
        </CardContent>
      </Card>
    </aside>
  );
}
