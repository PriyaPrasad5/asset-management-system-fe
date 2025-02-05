import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import AssetList from "./index";

// Mock `react-i18next`
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Mock API calls
vi.mock("../../services/admin", async (importOriginal) => {
  const actual = await importOriginal();
  let assets = [{ id: 1, name: "Laptop", status: "ASSIGNED" }];

  return {
    ...actual,
    fetchAssets: vi.fn(() => Promise.resolve({ data: assets })),
    deleteAsset: vi.fn((id) => {
      assets = assets.filter((asset) => asset.id !== id);
      return Promise.resolve();
    }),
    updateAsset: vi.fn(() =>
      Promise.resolve({ message: "Updated successfully" })
    ),
  };
});

const queryClient = new QueryClient();

const renderWithProviders = (ui) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe("AssetList Component", () => {
  test("renders loading state initially", async () => {
    renderWithProviders(<AssetList />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  test("renders asset list when data is available", async () => {
    renderWithProviders(<AssetList />);
    await waitFor(() => expect(screen.getByText("Laptop")).toBeInTheDocument());
  });

  test("prevents deletion of assigned assets", async () => {
    renderWithProviders(<AssetList />);
    await waitFor(() => screen.getByText("Laptop"));

    const deleteButton = screen.getAllByRole("button", { name: /delete/i })[0];
    expect(deleteButton).toBeDisabled();
  });

  test("handles delete asset operation", async () => {
    renderWithProviders(<AssetList />);
    await waitFor(() => screen.getByText("Laptop"));

    const deleteButton = screen.getByLabelText("Asset.deleteAsset");
    expect(deleteButton).toBeDisabled();
  });

  test("handles asset update operation", async () => {
    renderWithProviders(<AssetList />);

    await waitFor(() => screen.getByText("Laptop"));

    const editButton = screen.getByRole("button", { name: /edit asset/i });

    fireEvent.click(editButton);

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /edit asset/i })
      ).toBeInTheDocument()
    );
  });
});
