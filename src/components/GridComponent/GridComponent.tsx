import { Card, Avatar, Row, Col, Space, Tooltip, Button } from "antd";
import "./GridComponent.css";
import { useNavigate } from "react-router-dom";
import Prism from "prismjs";

import "prismjs/themes/prism.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-yaml";
// import "prismjs/components/prism-tsx";
import { useEffect, useState } from "react";
import { FileContentsMap, Gist, GistFile } from "../../types/appTypes";
interface GridComponentProps {
  data: Gist[];
  isLoggedIn: boolean;
  onFork?: (gistId: string) => void;
  size?: number;
}

function GridComponent({
  data,
  isLoggedIn,
  onFork,
  size = 3,
}: GridComponentProps) {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };
  const [fileContents, setFileContents] = useState<FileContentsMap>({});

  useEffect(() => {
    const fetchAllContents = async () => {
      const newContents: FileContentsMap = {};
      await Promise.all(
        data.map(async (item) => {
          const files = item.files || {};
          const firstFileKey = Object.keys(files)[0];
          const firstFile = files[firstFileKey];
          newContents[item.id] = {};
          if (firstFile && firstFile.raw_url) {
            try {
              const res = await fetch(firstFile.raw_url);
              newContents[item.id][firstFileKey] = await res.text();
            } catch {
              newContents[item.id][firstFileKey] = "Failed to load content.";
            }
          }
        })
      );
      setFileContents(newContents);
    };
    fetchAllContents();
  }, [data]);

  useEffect(() => {
    Prism.highlightAll();
  }, [data]);
  const navigate = useNavigate();

  const handleCardClick = (id: string) => {
    if (isLoggedIn) {
      navigate(`/gist/${id}`);
    } else {
      alert("You must be logged in to view this gist.");
    }
  };

  return (
    <div>
      {/* Grid Layout */}
      <Row gutter={[16, 16]}>
        {data.map((item: Gist) => {
          const firstFileKey = Object.keys(item.files)[0];
          const firstFile: GistFile = item.files[firstFileKey];
          const gistName = firstFile.filename || "No file available";
          const fileContent = fileContents[item.id]?.[firstFileKey] || "";
          const language = (firstFile?.language || "json").toLowerCase();
          const colSpan = 24 / size;

          return (
            <Col xs={24} sm={colSpan} md={colSpan} lg={colSpan} key={item.id}>
              <Card
                hoverable
                className="gist-card"
                onClick={() => handleCardClick(item.id)}
              >
                <div className="json-preview">
                  <pre className={`language-${language}`}>
                    <code className={`language-${language}`}>
                      {fileContent
                        .split("\n")
                        .slice(0, 10)
                        .map((line, index) => (
                          <span className="line" key={index}>
                            {line}
                          </span>
                        ))}
                    </code>
                  </pre>
                </div>

                <div className="card-meta">
                  <Avatar src={item.owner.avatar_url} size={48} />
                  <div className="meta-info">
                    <Row>
                      {" "}
                      <div className="owner-name">
                        {item.owner.login}
                      </div> /{" "}
                      <div className="gist-owner-name">
                        {truncateText(gistName, 20)}
                      </div>
                    </Row>
                    <div className="meta-text">{item.updated_at}</div>
                    <div className="meta-text ">
                      {truncateText(item.description || "No description", 50)}
                    </div>
                  </div>
                  <div className="card-actions">
                    <Space>
                      {/* Fork Button */}
                      <Tooltip title="Fork this gist">
                        <Button
                          type="text"
                          disabled={!isLoggedIn}
                          onClick={(e) => {
                            e.stopPropagation();
                            onFork?.(item.id);
                          }}
                          style={{ padding: 0 }}
                        >
                          <svg
                            width="36"
                            height="36"
                            viewBox="0 0 36 36"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="36" height="36" rx="4" fill="white" />
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M15.2916 24.0417C15.2916 25.5374 16.5041 26.75 17.9999 26.75C19.4957 26.75 20.7083 25.5374 20.7083 24.0417C20.7083 22.761 19.8194 21.688 18.6249 21.4058V18.4167H20.7083C22.4341 18.4167 23.8333 17.0176 23.8333 15.2917V14.5942C25.0277 14.312 25.9166 13.239 25.9166 11.9583C25.9166 10.4626 24.704 9.25 23.2083 9.25C21.7125 9.25 20.4999 10.4626 20.4999 11.9583C20.4999 13.239 21.3888 14.312 22.5833 14.5942V15.2917C22.5833 16.3272 21.7438 17.1667 20.7083 17.1667H15.2916C14.2561 17.1667 13.4166 16.3272 13.4166 15.2917V14.5942C14.611 14.312 15.4999 13.239 15.4999 11.9583C15.4999 10.4626 14.2874 9.25 12.7916 9.25C11.2958 9.25 10.0833 10.4626 10.0833 11.9583C10.0833 13.239 10.9721 14.312 12.1666 14.5942V15.2917C12.1666 17.0176 13.5657 18.4167 15.2916 18.4167H17.3749V21.4058C16.1805 21.688 15.2916 22.761 15.2916 24.0417ZM17.9999 25.5C17.1945 25.5 16.5416 24.8471 16.5416 24.0417C16.5416 23.2363 17.1945 22.5833 17.9999 22.5833C18.8053 22.5833 19.4583 23.2363 19.4583 24.0417C19.4583 24.8471 18.8053 25.5 17.9999 25.5ZM12.7916 13.4167C11.9862 13.4167 11.3333 12.7637 11.3333 11.9583C11.3333 11.1529 11.9862 10.5 12.7916 10.5C13.597 10.5 14.2499 11.1529 14.2499 11.9583C14.2499 12.7637 13.597 13.4167 12.7916 13.4167ZM21.7499 11.9583C21.7499 12.7637 22.4028 13.4167 23.2083 13.4167C24.0137 13.4167 24.6666 12.7637 24.6666 11.9583C24.6666 11.1529 24.0137 10.5 23.2083 10.5C22.4028 10.5 21.7499 11.1529 21.7499 11.9583Z"
                              fill="#003B44"
                            />
                          </svg>
                        </Button>
                      </Tooltip>

                      {/* Star Button */}
                      <Tooltip title="Star this gist">
                        <Button
                          type="text"
                          disabled={!isLoggedIn}
                          onClick={() =>
                            console.log(`Star clicked for gist: ${item.id}`)
                          }
                          style={{ padding: 0 }}
                        >
                          <svg
                            width="36"
                            height="36"
                            viewBox="0 0 36 36"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="36" height="36" rx="4" fill="white" />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M18 8.20834C18.2379 8.20834 18.4552 8.34341 18.5605 8.55674L21.1091 13.7208L26.8079 14.5489C27.0433 14.5831 27.2389 14.748 27.3124 14.9742C27.386 15.2005 27.3247 15.4489 27.1543 15.6149L23.0306 19.6345L24.0041 25.3103C24.0443 25.5448 23.9479 25.7818 23.7554 25.9216C23.5629 26.0615 23.3078 26.0799 23.0972 25.9692L18 23.2895L12.9028 25.9692C12.6923 26.0799 12.4371 26.0615 12.2446 25.9216C12.0522 25.7818 11.9558 25.5448 11.996 25.3103L12.9695 19.6345L8.84574 15.6149C8.67539 15.4489 8.61407 15.2005 8.68759 14.9742C8.76111 14.748 8.9567 14.5831 9.19213 14.5489L14.891 13.7208L17.4396 8.55674C17.5448 8.34341 17.7621 8.20834 18 8.20834ZM18 10.2456L15.8665 14.5686C15.7754 14.7531 15.5994 14.8809 15.3959 14.9105L10.6251 15.6038L14.0773 18.9688C14.2246 19.1124 14.2918 19.3192 14.257 19.522L13.4421 24.2735L17.7092 22.0301C17.8913 21.9344 18.1088 21.9344 18.2909 22.0301L22.558 24.2735L21.743 19.522C21.7082 19.3192 21.7755 19.1124 21.9228 18.9688L25.3749 15.6038L20.6042 14.9105C20.4006 14.8809 20.2246 14.7531 20.1336 14.5686L18 10.2456Z"
                              fill="#003B44"
                            />
                          </svg>
                        </Button>
                      </Tooltip>
                    </Space>
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default GridComponent;
