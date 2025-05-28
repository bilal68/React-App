import { useState } from "react";
import { Row, Col, Avatar, Typography, Button, message } from "antd";
import "./ProfilePage.css";
import PaginationComponent from "../../components/Pagination/Pagination";
import GridComponent from "../../components/GridComponent/GridComponent";
import { fetchUserGists } from "../../services/gistService";
import Loader from "../../components/Loader/Loader";
import { useAppContext } from "../../context/AppContext";
import { Gist } from "../../types/appTypes";
import { useQuery } from "@tanstack/react-query";

const { Title } = Typography;

const ProfilePage = () => {
  const { userName, profileImageUrl, displayName } = useAppContext();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  // Use React Query to fetch user gists
  const {
    data: gists = [],
    isLoading,
    // error,
  } = useQuery<Gist[]>({
    queryKey: ["userGists", userName],
    queryFn: () => fetchUserGists(userName!),
    enabled: !!userName,
    staleTime: 5000,
  });

  // Calculate paginated data
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedGists = gists.slice(startIndex, startIndex + pageSize);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {isLoading && <Loader />}
      <Row gutter={[24, 24]} justify="space-between">
        {/* Profile Sidebar */}
        <Col xs={24} md={6}>
          <div className="profile-card">
            <Avatar src={profileImageUrl} size={250} />
            <Title level={1}>{displayName}</Title>
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
            onFork={() => message.warning("You cannot fork your on gist!")}
            size={1}
            onStar={() => message.warning("You cannot star your on gist!")}
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
