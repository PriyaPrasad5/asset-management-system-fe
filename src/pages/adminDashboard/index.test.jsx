import { ChakraProvider, useToast } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { vi } from "vitest";
import i18n from "../../i18n";
import Dashboard from "./index";

// Mock dependencies
vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

vi.mock("@chakra-ui/react", async () => {
  const actual = await vi.importActual("@chakra-ui/react");
  return {
    ...actual,
    useToast: vi.fn(),
  };
});

describe("Dashboard Component", () => {
  const mockToast = vi.fn();

  beforeEach(() => {
    vi.mocked(useToast).mockReturnValue(mockToast);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <ChakraProvider>
        <I18nextProvider i18n={i18n}>
          <Dashboard />
        </I18nextProvider>
      </ChakraProvider>
    );

  it("displays a loading spinner while fetching data", () => {
    vi.mocked(useQuery).mockReturnValue({
      isLoading: true,
      isError: false,
      data: null,
    });

    renderComponent();

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("handles API errors correctly and shows a toast", async () => {
    vi.mocked(useQuery).mockReturnValue({
      isLoading: false,
      isError: true,
      error: { message: "Network Error" },
    });

    renderComponent();

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: i18n.t("Dashboard.errorTitle"),
        description: "Network Error",
        status: "error",
        isClosable: true,
      });

      expect(
        screen.getByText(i18n.t("Dashboard.errorMessage"))
      ).toBeInTheDocument();
    });
  });

  it("displays dashboard statistics correctly with fetched data", async () => {
    vi.mocked(useQuery).mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        data: {
          totalAssets: 100,
          assignedPercentageValue: 40,
          availablePercentageValue: 50,
          underMaintenancePercentageValue: 10,
          assignedAssets: 40,
          availableAssets: 50,
          underMaintenanceAssets: 10,
        },
      },
    });

    renderComponent();

    await waitFor(
      () => {
        expect(
          screen.getByText(i18n.t("Dashboard.totalAssets"))
        ).toBeInTheDocument();
        expect(screen.getByText("100")).toBeInTheDocument();

        expect(
          screen.getByText(i18n.t("Dashboard.assignedAssets"))
        ).toBeInTheDocument();
        expect(screen.getByText("40")).toBeInTheDocument();
        expect(
          screen.getByText("40% " + i18n.t("Dashboard.ofTotal"))
        ).toBeInTheDocument();

        expect(
          screen.getByText(i18n.t("Dashboard.availableAssets"))
        ).toBeInTheDocument();
        expect(screen.getByText("50")).toBeInTheDocument();
        expect(
          screen.getByText("50% " + i18n.t("Dashboard.ofTotal"))
        ).toBeInTheDocument();

        const underMaintenanceLabels = screen.getAllByText(
          i18n.t("Dashboard.underMaintenance")
        );
        expect(underMaintenanceLabels.length).toBeGreaterThan(0);

        expect(screen.getByText("10")).toBeInTheDocument();
        expect(
          screen.getByText("10% " + i18n.t("Dashboard.ofTotal"))
        ).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
