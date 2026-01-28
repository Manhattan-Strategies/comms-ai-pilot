import FilterControls from "./filter-control";
import ActiveFiltersSummary from "./active-filters-summary";
import type { FilterState } from "@/types/filters";
import styles from "./upload-form.module.css";

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
    <div className={styles.sidebar}>
      <div className={styles.sidebarSticky}>
        <FilterControls filters={filters} onFiltersChange={onFiltersChange} />
        <ActiveFiltersSummary filters={filters} />
      </div>
    </div>
  );
}
