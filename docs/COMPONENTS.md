# Component Hierarchy

## App
- Root application shell
- Defines navigation and routes

## Pages
- `AdminDashboard`
  - `MasterDataSection`
  - `OrderManagementSection`
  - `VehicleAllocationSection`
  - `FleetMapSection`
  - `InventoryDashboardSection`
- `DriverInterface`
  - `ShiftSummaryCard`
  - `DeliveryList`
  - `DriverMapSection`
  - `ShiftHistorySection`

## Shared Components
- `SectionPanel`
- `EntityTable`
- `SelectField`
- `TextInput`
- `DateInput`
- `Toast`
- `LoadingIndicator`
- `ErrorBanner`
- `MapPanel`

## API and State
- `api.ts` contains fetch helpers for backend calls
- `types.ts` contains shared TypeScript interfaces
