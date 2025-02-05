import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { fetchAssets } from "../../services/manager";
import ManagerAssetList from "./index";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

vi.mock("../../services/manager", () => ({
  fetchAssets: vi.fn(),
  filter: vi.fn(),
}));

const mockToast = vi.fn();
vi.mock("@chakra-ui/react", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useToast: () => mockToast,
  };
});

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
        cacheTime: 0,
      },
    },
  });

const renderWithProviders = (ui) => {
  return render(
    <QueryClientProvider client={createTestQueryClient()}>
      {ui}
    </QueryClientProvider>
  );
};

describe("ManagerAssetList Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("shows loading spinner when data is loading", async () => {
    renderWithProviders(<ManagerAssetList />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
  });

  test("shows error toast when data fetch fails", async () => {
    fetchAssets.mockRejectedValue(new Error("Failed to fetch assets"));

    renderWithProviders(<ManagerAssetList />);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "ManagerAssetList.errorLoadingAssets",
          status: "error",
        })
      );
    });
  });

  test("renders asset list when data is available", async () => {
    fetchAssets.mockResolvedValue({
      data: [
        {
          id: 1,
          assetIdentifier: "A123",
          name: "Laptop",
          type: "EQUIPMENT",
          status: "AVAILABLE",
          purchaseDate: "2023-01-01",
          warrantyEndDate: "2024-01-01",
          userId: "user1",
        },
      ],
    });

    renderWithProviders(<ManagerAssetList />);

    await waitFor(() => {
      expect(screen.getByText("Laptop")).toBeInTheDocument();
      expect(screen.getByText("AVAILABLE")).toBeInTheDocument();
    });
  });

  test("shows validation error if search date is empty", async () => {
    renderWithProviders(<ManagerAssetList />);

    const searchButton = await waitFor(() =>
      screen.getByRole("button", { name: /search/i })
    );

    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "ManagerAssetList.validationError",
          status: "error",
        })
      );
    });
  });
});
