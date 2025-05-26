import { useEffect, useState } from "react";
import { Button, Col, Row, Space, Typography } from "antd";
import { AppstoreOutlined, TableOutlined } from "@ant-design/icons";
import TableComponent from "../components/TableComponent/TableComponent";
import GridComponent from "../components/GridComponent/GridComponent";
import PaginationComponent from "../components/Pagination/Pagination";

// Services
import { fetchPublicGists, forkGist } from "../services/gistService";
import { useAppContext } from "../context/AppContext";
import Loader from "../components/Loader/Loader";
import { Gist } from "../types/appTypes";

const { Title } = Typography;

function LandingPage() {
  const { searchTerm, authToken } = useAppContext();
  const isLoggedIn = !!authToken;

  const [view, setView] = useState<"table" | "grid">("table");
  const [gists, setGists] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = view === "table" ? 10 : 9;

  const handleFork = async (gistId: string) => {
    try {
      setLoading(true);
      await forkGist(gistId);
    } catch (error) {
      console.error("Error while forking gist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchPublicGists(currentPage);
        setGists(data);
        setFilteredData(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch gists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  useEffect(() => {
    const filtered = gists.filter(
      (item: Gist) =>
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.owner?.login?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, gists]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <>
      {loading && <Loader />}
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
