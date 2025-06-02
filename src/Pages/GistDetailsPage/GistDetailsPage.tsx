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

import Prism from "prismjs";
import "prismjs/themes/prism.css"; // or another Prism theme
import "prismjs/components/prism-javascript"; // add more languages as needed
import "prismjs/components/prism-python";
import "prismjs/components/prism-typescript";
import { useEffect } from "react";
import { useGistListQuery } from "../../hooks/hooks";
// ...import other languages as needed

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

  useEffect(() => {
    Prism.highlightAll();
  }, [gist]);
  // Fetch forks count
  const {
    data: forksData,
    isLoading: isForksLoading,
    error: forksError,
    isError: isForksError,
  } = useGistListQuery<Gist>("gistForks", id, fetchGistForks);

  // Fetch stars count
  const {
    data: starsData,
    isLoading: isStarsLoading,
    error: starsError,
    isError: isStarsError,
  } = useGistListQuery<Gist>("gistStars", id, fetchGistStars);

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
  const createdDate = gist?.created_at
    ? new Date(gist.created_at).toLocaleString()
    : "";

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
                {gist?.description || "No description"}
              </Text>
            </div>
          </div>
        </Col>

        {/* Right Side: Forks, Stars Styled Buttons */}
        <Col xs={24} md={8} className="gist-buttons-wrapper">
          <GistActionButtons
            gistId={gist?.id || ""}
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
      {Object.entries(gist?.files || {}).map(
        ([fileName, fileData]: [string, GistFile]) => {
          // Guess language from file extension
          const ext = fileName.split(".").pop() || "";
          const lang =
            ext === "js"
              ? "javascript"
              : ext === "ts"
              ? "typescript"
              : ext === "py"
              ? "python"
              : ext === "json"
              ? "json"
              : ext === "css"
              ? "css"
              : ext === "html"
              ? "html"
              : "markup";

          return (
            <Card key={fileName} title={fileName} className="file-card">
              <Paragraph>
                <pre className={`language-${lang}`}>
                  <code className={`language-${lang}`}>{fileData.content}</code>
                </pre>
              </Paragraph>
            </Card>
          );
        }
      )}
    </>
  );
};

export default GistDetailsPage;
