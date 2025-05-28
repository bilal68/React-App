import { useEffect, useState } from "react";
import { Button, Col, message, Row, Space, Typography } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AppstoreOutlined, TableOutlined } from "@ant-design/icons";
import TableComponent from "../components/TableComponent/TableComponent";
import GridComponent from "../components/GridComponent/GridComponent";
import PaginationComponent from "../components/Pagination/Pagination";

// Services
import { fetchPublicGists, forkGist } from "../services/gistService";
import { useAppContext } from "../context/AppContext";
import Loader from "../components/Loader/Loader";
import { Gist, ApiError } from "../types/appTypes";

const { Title } = Typography;

function LandingPage() {
  const { searchTerm, authToken } = useAppContext();
  const isLoggedIn = !!authToken;

  const [view, setView] = useState<"table" | "grid">("table");
  const [filteredData, setFilteredData] = useState<Gist[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = view === "table" ? 10 : 9;

  const forkMutation = useMutation({
    mutationFn: (gistId: string) => forkGist(gistId),
    onSuccess: () => {
      message.success("Gist forked successfully!");
      // Optionally refetch gists to update UI
      // queryClient.invalidateQueries({ queryKey: ["publicGists"] });
    },
    onError: (error: ApiError) => {
      if (error.status === 422) message.warning(error.message);
      else message.error("Error while forking gist.");
    },
  });
  const handleFork = async (gistId: string) => {
    forkMutation.mutate(gistId);
  };
  const {
    data: gists = [],
    isLoading,
    // error,
  } = useQuery<Gist[], Error>({
    queryKey: ["publicGists", currentPage],
    queryFn: () => fetchPublicGists(currentPage),
    staleTime: 5000,
  });

  useEffect(() => {
    const filtered = (gists as Gist[]).filter(
      (item: Gist) =>
        (typeof item.description === "string" &&
          item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (typeof item.owner?.login === "string" &&
          item.owner.login.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredData(filtered);
  }, [searchTerm, gists]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <>
      {(isLoading || forkMutation.isPending) && <Loader />}
      <Row align="middle" justify="space-between" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            Public Gists
          </Title>
        </Col>
        <Col>
          <Space>
            <Button
              type={view === "table" ? "primary" : "default"}
              icon={<TableOutlined />}
              onClick={() => setView("table")}
            />
            <Button
              type={view === "grid" ? "primary" : "default"}
              icon={<AppstoreOutlined />}
              onClick={() => setView("grid")}
            />
          </Space>
        </Col>
      </Row>

      {view === "table" && (
        <TableComponent
          data={currentData}
          pagination={false}
          isLoggedIn={isLoggedIn}
          onFork={handleFork}
        />
      )}
      {view === "grid" && (
        <GridComponent
          data={currentData}
          isLoggedIn={isLoggedIn}
          onFork={handleFork}
        />
      )}

      <div style={{ marginTop: 24 }}>
        <PaginationComponent
          currentPage={currentPage}
          pageSize={pageSize}
          total={gists.length}
          onPageChange={(page) => setCurrentPage(page)}
          className={view === "grid" ? "white-pagination" : ""}
        />
      </div>
    </>
  );
}

export default LandingPage;
