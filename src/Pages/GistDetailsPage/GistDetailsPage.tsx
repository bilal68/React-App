import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Row, Col, Avatar, Card, Typography } from "antd";
import {
  fetchGistById,
  fetchGistForks,
  forkGist,
  starGist,
} from "../../services/gistService";

import "./GistDetailsPage.css";
import GistActionButtons from "../../components/GistActionButtons/GistActionButtons";
import Loader from "../../components/Loader/Loader";
import { Gist, GistFile } from "../../types/appTypes";

const { Title, Text, Paragraph } = Typography;

const GistDetailsPage = () => {
  const { id } = useParams();
  const [gist, setGist] = useState<Gist | null>(null);
  const [forksCount, setForksCount] = useState(0);
  const [starsCount] = useState(0);
  const [isForkLoading, setIsForkLoading] = useState(false);
  const [isStarLoading, setIsStarLoading] = useState(false);

  useEffect(() => {
    const fetchGistDetails = async () => {
      try {
        const data: Gist = await fetchGistById(id!);
        setGist(data);
      } catch (error) {
        console.error("Error fetching gist:", error);
      }
    };
    const fetchForks = async () => {
      try {
        const data = await fetchGistForks(id!);
        setForksCount(data.length);
      } catch (error) {
        console.error("Error fetching forks:", error);
      }
    };

    fetchGistDetails();
    fetchForks();
  }, [id]);

  if (!gist) return <div>Loading...</div>;

  const createdDate = new Date(gist.created_at).toLocaleString();

  const handleFork = async () => {
    try {
      setIsForkLoading(true);
      await forkGist(id!);
      setIsForkLoading(false);
    } catch (error) {
      console.log("Failed to fork gist.", error);
    }
  };

  const handleStar = async () => {
    try {
      setIsStarLoading(true);
      await starGist(id!);
      setIsStarLoading(false);
    } catch (error) {
      console.log("Failed to fork gist.", error);
    }
  };
  return (
    <>
      {(isForkLoading || isStarLoading) && <Loader />}
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
            forksCount={forksCount}
            starsCount={starsCount}
            isForkLoading={isForkLoading}
            isStarLoading={isStarLoading}
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
