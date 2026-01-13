import FilterControls from "./filter-control";
import ActiveFiltersSummary from "./active-filters-summary";
import type { FilterState } from "@/types/filters";

/**
 * Sidebar component containing filter controls and active settings summary
 */
interface UploadFormSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export default function UploadFormSidebar({
  filters,
  onFiltersChange,
}: UploadFormSidebarProps) {
  return (
    <div className="lg:w-1/3">
      <div className="sticky top-24">
        <FilterControls filters={filters} onFiltersChange={onFiltersChange} />
        <ActiveFiltersSummary filters={filters} />
      </div>
    </div>
  );
}
