import { useParams } from "react-router-dom";
import { Row, Col, Avatar, Card, Typography, message } from "antd";
import {
  fetchGistById,
  fetchGistForks,
  fetchGistStars,
  forkGist,
  starGist,
} from "../../services/gistService";

import "./GistDetailsPage.css";
import GistActionButtons from "../../components/GistActionButtons/GistActionButtons";
import Loader from "../../components/Loader/Loader";
import { Gist, GistFile } from "../../types/appTypes";
import { useMutation, useQuery } from "@tanstack/react-query";

const { Title, Text, Paragraph } = Typography;

const GistDetailsPage = () => {
  const { id } = useParams();
  const {
    data: gist,
    isLoading: isGistLoading,
    error: gistError,
    isError: isGistError,
  } = useQuery<Gist>({
    queryKey: ["gist", id],
    queryFn: () => fetchGistById(id!),
    enabled: !!id,
  });

  // Fetch forks count
  const {
    data: forksData,
    isLoading: isForksLoading,
    error: forksError,
    isError: isForksError,
  } = useQuery<Gist[]>({
    queryKey: ["gistForks", id],
    queryFn: () => fetchGistForks(id!),
    enabled: !!id,
  });

  // Fetch stars count
  const {
    data: starsData,
    isLoading: isStarsLoading,
    error: starsError,
    isError: isStarsError,
  } = useQuery<Gist[]>({
    queryKey: ["gistStars", id],
    queryFn: () => fetchGistStars(id!),
    enabled: !!id,
  });

  if (isGistError) console.error("Error fetching gist:", gistError);
  if (isForksError) console.error("Error forking gist:", forksError);
  if (isStarsError) console.error("Error forking gist:", starsError);
  // Fork mutation
  const forkMutation = useMutation({
    mutationFn: () => forkGist(id!),
    onSuccess: () => {
      message.success("Gist forked successfully!");
    },
  });
  // Star mutation
  const starMutation = useMutation({
    mutationFn: () => starGist(id!),
    onSuccess: () => {
      message.success("Gist starred successfully!");
    },
  });
  if (!gist) return <div>Loading...</div>;

  const createdDate = new Date(gist.created_at).toLocaleString();

  const handleFork = async () => {
    forkMutation.mutate();
  };

  const handleStar = async () => {
    starMutation.mutate();
  };
  return (
    <>
      {(isGistLoading ||
        isForksLoading ||
        isStarsLoading ||
        forkMutation.isPending ||
        starMutation.isPending) && <Loader />}
      <Row
        gutter={[24, 16]}
        align="middle"
        justify="space-between"
        className="top-row"
      >
        {/* Left Side: Avatar, name, etc. */}
        <Col xs={24} md={16}>
          <div className="author-info">
            <Avatar src={gist?.owner?.avatar_url || undefined} size={64} />
            <div className="author-text">
              <Title level={4} className="author-title">
                {gist?.owner?.login}/gist_name
              </Title>
              <Text type="secondary" className="author-created">
                Created: {createdDate}
              </Text>
              <Text type="secondary" className="author-description">
                {gist.description || "No description"}
              </Text>
            </div>
          </div>
        </Col>

        {/* Right Side: Forks, Stars Styled Buttons */}
        <Col xs={24} md={8} className="gist-buttons-wrapper">
          <GistActionButtons
            gistId={gist.id}
            isLoggedIn={true}
            onFork={handleFork}
            onStar={handleStar}
            forksCount={forksData?.length || 0}
            starsCount={starsData?.length || 0}
            isForkLoading={forkMutation.isPending}
            isStarLoading={starMutation.isPending}
          />
        </Col>
      </Row>

      {/* Files Section */}
      <div className="">
        {Object.entries(gist.files).map(
          ([fileName, fileData]: [string, GistFile]) => (
            <Card key={fileName} title={fileName} className="file-card">
              <Paragraph>
                <pre className="file-content">{fileData.content}</pre>
              </Paragraph>
            </Card>
          )
        )}
      </div>
    </>
  );
};

export default GistDetailsPage;
