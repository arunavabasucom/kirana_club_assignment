import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Page,
  Layout,
  Card,
  Box,
  Filters,
  DataTable,
  Pagination,
  Select,
  SkeletonPage,
  SkeletonBodyText,
  Badge,
  Button,
  Text,
  Tooltip,
} from "@shopify/polaris";
import { StarFilledIcon, StarIcon } from "@shopify/polaris-icons";
import { fetchContests } from "../services/api";
import { Contest } from "../types";
import ContestGraph from "../components/ContestGraph";

const Dashboard: React.FC = () => {
  //states
  const [contests, setContests] = useState<Contest[]>([]);
  const [filteredContests, setFilteredContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [phaseFilter, setPhaseFilter] = useState<string | null>(null);
  const [favoriteContests, setFavoriteContests] = useState<string[]>(() => {
    const savedFavorites = localStorage.getItem("favoriteContests");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const navigate = useNavigate();

  useEffect(() => {
    const loadContests = async () => {
      try {
        const data = await fetchContests();
        setContests(data);
        setFilteredContests(data);
      } catch (error) {
        console.error("Error loading contests:", error);
      } finally {
        setLoading(false);
      }
    };
    loadContests();
  }, []);

  useEffect(() => {
    localStorage.setItem("favoriteContests", JSON.stringify(favoriteContests));
  }, [favoriteContests]);

  useEffect(() => {
    const filtered = contests.filter(
      (contest) =>
        (typeFilter === null || contest.type === typeFilter) &&
        (phaseFilter === null || contest.phase === phaseFilter) &&
        contest.name.toLowerCase().includes(search.toLowerCase()) &&
        (!showFavoritesOnly || favoriteContests.includes(contest.id.toString()))
    );
    setFilteredContests(filtered);
    setCurrentPage(1);
  }, [
    search,
    typeFilter,
    phaseFilter,
    contests,
    favoriteContests,
    showFavoritesOnly,
  ]);

  const toggleFavorite = (contestId: string) => {
    setFavoriteContests((prev) =>
      prev.includes(contestId)
        ? prev.filter((id) => id !== contestId)
        : [...prev, contestId]
    );
  };

  const handleSearchChange = (value: string) => setSearch(value);
  const handleTypeFilterChange = (value: string) =>
    setTypeFilter(value === "All" ? null : value);
  const handlePhaseFilterChange = (value: string) =>
    setPhaseFilter(value === "All" ? null : value);
  const handleItemsPerPageChange = (value: string) =>
    setItemsPerPage(parseInt(value, 10));

  const totalItems = filteredContests.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedContests = filteredContests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const rows = paginatedContests.map((contest) => [
    contest.id,
    contest.name,
    contest.type,
    <Badge tone={contest.phase === "FINISHED" ? "success" : "attention"}>
      {contest.phase}
    </Badge>,
    (contest.durationSeconds / 3600).toFixed(2) + " hours",
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <Tooltip
        content={
          favoriteContests.includes(contest.id.toString())
            ? "Remove from Favorites"
            : "Add to Favorites"
        }
      >
        <Button
          onClick={() => toggleFavorite(contest.id.toString())}
          variant="plain"
          icon={
            favoriteContests.includes(contest.id.toString())
              ? StarFilledIcon
              : StarIcon
          }
        ></Button>
      </Tooltip>
      <Button
        onClick={() => navigate(`/contest/${contest.id}`)}
        variant="primary"
      >
        View Details
      </Button>
    </div>,
  ]);

  if (loading) {
    return (
      <SkeletonPage title="Codeforces Contest Dashboard" primaryAction>
        <Layout>
          <Layout.Section>
            <Card>
              <SkeletonBodyText />
            </Card>
          </Layout.Section>
          <Layout.Section>
            <Card>
              <SkeletonBodyText />
            </Card>
          </Layout.Section>
        </Layout>
      </SkeletonPage>
    );
  }

  return (
    <Page title="Codeforces Contest Dashboard">
      <div style={{ marginBottom: "20px" }}>
        <Layout>
          <Layout.Section>
            <Card>
              <Filters
                queryValue={search}
                filters={[
                  {
                    key: "typeFilter",
                    label: "Type",
                    filter: (
                      <Select
                        label="Type"
                        options={[
                          { label: "All", value: "All" },
                          { label: "CF", value: "CF" },
                          { label: "ICPC", value: "ICPC" },
                        ]}
                        value={typeFilter || "All"}
                        onChange={handleTypeFilterChange}
                      />
                    ),
                  },
                  {
                    key: "phaseFilter",
                    label: "Phase",
                    filter: (
                      <Select
                        label="Phase"
                        options={[
                          { label: "All", value: "All" },
                          { label: "BEFORE", value: "BEFORE" },
                          { label: "FINISHED", value: "FINISHED" },
                        ]}
                        value={phaseFilter || "All"}
                        onChange={handlePhaseFilterChange}
                      />
                    ),
                  },
                ]}
                appliedFilters={[
                  ...(typeFilter && typeFilter !== "All"
                    ? [
                        {
                          key: "typeFilter",
                          label: `Type: ${typeFilter}`,
                          onRemove: () => setTypeFilter(null),
                        },
                      ]
                    : []),
                  ...(phaseFilter && phaseFilter !== "All"
                    ? [
                        {
                          key: "phaseFilter",
                          label: `Phase: ${phaseFilter}`,
                          onRemove: () => setPhaseFilter(null),
                        },
                      ]
                    : []),
                  ...(showFavoritesOnly
                    ? [
                        {
                          key: "favoritesFilter",
                          label: "Favorites Only",
                          onRemove: () => setShowFavoritesOnly(false),
                        },
                      ]
                    : []),
                ]}
                onQueryChange={handleSearchChange}
                onQueryClear={() => setSearch("")}
                onClearAll={() => {
                  setSearch("");
                  setTypeFilter(null);
                  setPhaseFilter(null);
                  // setShowFavoritesOnly(false);
                }}
              >
                <Button
                  variant={showFavoritesOnly ? "primary" : "plain"}
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                >
                  {showFavoritesOnly ? "Show All Contests" : "Show Favorites"}
                </Button>
              </Filters>
            </Card>
          </Layout.Section>

          <Layout.Section>
            <Card>
              <Text as="h2" variant="headingLg" fontWeight="bold">
                Contest Graph
              </Text>
              <ContestGraph contests={filteredContests} />
            </Card>
          </Layout.Section>
        </Layout>
      </div>

      <Layout>
        <Layout.Section>
          <Card>
            <Box padding={{ xs: "400", sm: "400" }}>
              <Select
                label="Items per page"
                options={[
                  { label: "5", value: "5" },
                  { label: "10", value: "10" },
                  { label: "20", value: "20" },
                  { label: "50", value: "50" },
                ]}
                value={itemsPerPage.toString()}
                onChange={handleItemsPerPageChange}
              />
            </Box>
            <DataTable
              columnContentTypes={[
                "text",
                "text",
                "text",
                "text",
                "text",
                "text",
              ]}
              headings={["ID", "Name", "Type", "Phase", "Duration", "Action"]}
              rows={rows}
              footerContent={`Showing ${paginatedContests.length} of ${totalItems} contests`}
              truncate={true}
            />
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Box padding={{ xs: "400", sm: "400" }}>
            <Pagination
              hasPrevious={currentPage > 1}
              onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              hasNext={currentPage < totalPages}
              onNext={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            />
          </Box>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Dashboard;
