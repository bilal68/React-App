import { useEffect, useState } from "react";
import { Row, Col, Avatar, Typography, Button } from "antd";
import "./ProfilePage.css";
import PaginationComponent from "../../components/Pagination/Pagination";
import GridComponent from "../../components/GridComponent/GridComponent";
import { fetchUserGists } from "../../services/gistService";
import Loader from "../../components/Loader/Loader";
import { useAppContext } from "../../context/AppContext";
import { Gist } from "../../types/appTypes";

const { Title } = Typography;

const ProfilePage = () => {
  const { userName, profileImageUrl } = useAppContext();
  console.log("ProfilePage userName:", userName);
  const [gists, setGists] = useState<Gist[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1); 
  const [pageSize] = useState(5);
  useEffect(() => {
    const getGists = async () => {
      try {
        setLoading(true);
        if (!userName) {
          throw new Error("Username is required to fetch gists.");
        }
        const userGists = await fetchUserGists(userName); 
        setGists(userGists);
        console.log("state Gists:", gists);
        console.log("User Gists:", userGists);
      } catch (error) {
        console.error("Failed to fetch gists:", error);
      } finally {
        setLoading(false);
      }
    };
    getGists();
  }, []);
  // Calculate paginated data
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedGists = gists.slice(startIndex, startIndex + pageSize);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {loading && <Loader />}
      <Row gutter={[24, 24]} justify="space-between">
        {/* Profile Sidebar */}
        <Col xs={24} md={6}>
          <div className="profile-card">
            <Avatar src={profileImageUrl} size={250} />
            <Title level={1}>{userName}</Title>
            <Button type="primary" size="large">
              View GitHub Profile
              {/* window.open(user?.html_url || "https://github.com", "_blank") */}
            </Button>
          </div>
        </Col>

        {/* Gist List */}
        <Col xs={24} md={18}>
          <div className="gists-header">
            <Title level={2}>All GISTS</Title>
            <div className="gist-count-circle">{gists.length || 0}</div>
          </div>
          <GridComponent
            data={paginatedGists}
            isLoggedIn={true}
            onFork={(gistId) => console.log(`Fork clicked for gist: ${gistId}`)}
            size={1}
          />

          <PaginationComponent
            currentPage={currentPage}
            pageSize={pageSize}
            total={gists.length}
            onPageChange={handlePageChange}
          />
        </Col>
      </Row>
    </>
  );
};

export default ProfilePage;
