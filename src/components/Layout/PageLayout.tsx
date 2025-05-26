import React from "react";
import { Layout } from "antd";
import "./PageLayout.css"; // Add this for container styles

const { Content } = Layout;

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout>
      <Content style={{ background: "#fff" }}>
        <div className="layout-container">
          {children}
        </div>
      </Content>
    </Layout>
  );
};

export default PageLayout;
