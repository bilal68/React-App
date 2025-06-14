import { Dropdown, Avatar, Menu, Layout } from "antd";
import "./Header.css";
import Button from "../Button/Button";
import Searchbar from "../Searchbar/Searchbar";
// Services
import { handleGitHubLogin } from "../../services/auth";
import { useAppContext } from "../../context/AppContext";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const { Header: AntdHeader } = Layout;

function Header() {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, authToken, setAuthData } = useAppContext();

  //   Local state
  const [isLoggedIn, setIsLoggedIn] = useState(authToken !== null);
  const user = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user") as string)
    : null;
  const handleLoginButtonClick = async () => {
    const loginResult = await handleGitHubLogin();
    if (loginResult) {
      const { user, accessToken } = loginResult;
      sessionStorage.setItem("user", JSON.stringify(user));
      if (accessToken) {
        sessionStorage.setItem("authToken", accessToken);
        setAuthData(accessToken, user);
      }
      setIsLoggedIn(true);
    }
  };
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case "gists":
        window.open("https://gist.github.com/", "_blank");
        break;
      case "starred":
        window.open("https://gist.github.com/discover", "_blank");
        break;
      case "profile":
        navigate("/profile");
        break;
      case "signout":
        sessionStorage.clear();
        setIsLoggedIn(false);
        navigate("/");
        break;
      default:
        break;
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="signedin" disabled>
        Signed in as <strong>{user?.displayName || "Unknown"}</strong>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="gists">Your gists</Menu.Item>
      <Menu.Item key="starred">Starred gists</Menu.Item>
      <Menu.Item key="profile">Your GitHub profile</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="signout">Sign out</Menu.Item>
    </Menu>
  );

  return (
    <AntdHeader className="header">
      <div className="logo">
        <Link to="/" className="logo">
          <svg
            width="166"
            height="30"
            viewBox="0 0 166 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.2467 23.0289V7.64669H22.6311V16.8756H13.4V13.8H19.5534V10.7222H10.3245V19.9534H25.7089V4.56891H4.17114V26.5511H25.7089V23.0289H7.2467Z"
              fill="white"
            />
            <path
              d="M60.8888 22.1555L54.9177 4.61108H50.3088V26.5511H53.6066V13.6489C53.6066 13.1422 53.5933 12.3511 53.5622 11.2733C53.5511 10.7266 53.5377 10.2511 53.5288 9.84664L59.2377 26.5511H62.4911L68.1444 9.85108C68.1444 10.4111 68.137 10.9511 68.1222 11.4711C68.1014 12.4844 68.0918 13.2103 68.0933 13.6489V26.5511H71.3911V4.61108H66.8111L60.8888 22.1555Z"
              fill="white"
            />
            <path
              d="M89.371 18.1089C89.371 19.6066 89.1488 20.8044 88.6821 21.6644C87.831 23.2689 86.2555 24.0466 83.8599 24.0466C81.8799 24.0466 80.5132 23.3289 79.6821 21.8489C79.1199 20.8644 78.8355 19.6022 78.8355 18.1V4.61108H75.3777V16.9C75.3777 19.5666 75.7466 21.6466 76.4732 23.0977C77.8066 25.7644 80.3777 27.12 84.0955 27.12C87.8132 27.12 90.3843 25.7666 91.7332 23.0977C92.4599 21.6466 92.831 19.5622 92.831 16.9V4.61108H89.371V18.1089Z"
              fill="white"
            />
            <path
              d="M107.393 22.1555L101.427 4.61108H96.8179V26.5511H100.116V13.6489C100.116 13.1422 100.1 12.3511 100.073 11.2733C100.056 10.7266 100.047 10.2511 100.04 9.84664L105.747 26.5511H109L114.653 9.85108C114.653 10.4111 114.646 10.9511 114.631 11.4711C114.613 12.4844 114.602 13.2111 114.602 13.6489V26.5511H117.9V4.61108H113.32L107.393 22.1555Z"
              fill="white"
            />
            <path
              d="M135.476 14.7222C135.961 14.4439 136.401 14.0924 136.78 13.68C137.587 12.7689 137.998 11.5911 137.998 10.18C138.015 9.03138 137.669 7.90667 137.009 6.96664C135.898 5.41108 134.011 4.61108 131.409 4.61108H121.887V26.5511H131.258C134.167 26.5511 136.325 25.6622 137.671 23.9422C138.556 22.832 139.036 21.4531 139.031 20.0333C139.031 18.3244 138.518 16.9622 137.507 15.98C136.909 15.4445 136.221 15.0187 135.476 14.7222ZM134.936 22.1066C134.225 23.0622 133.004 23.5444 131.307 23.5444H125.258V16.5377H130.813C132 16.5377 132.965 16.6844 133.673 16.9822C134.98 17.5066 135.613 18.4644 135.613 19.9133C135.636 20.701 135.402 21.4747 134.947 22.1177M133.107 13.1911C132.458 13.5111 131.527 13.6733 130.336 13.6733H125.269V7.55553H130.222C131.458 7.55553 132.393 7.68664 133.005 7.94442C134.058 8.38886 134.56 9.23331 134.56 10.5289C134.56 11.8244 134.076 12.6866 133.087 13.1777"
              fill="white"
            />
            <path
              d="M152.702 4.61108H149.06L140.798 26.5511H144.338L146.667 20.1377H154.693L156.929 26.5511H160.667L152.702 4.61108ZM153.68 17.2489H147.707L150.751 8.83997L153.68 17.2489Z"
              fill="white"
            />
            <path
              d="M46.3222 26.4445H33.1111V4.66669H46.32V7.67558H36.6666V13.6045H45.7778V16.5845H36.6666V23.42H46.3155L46.3222 26.4445Z"
              fill="white"
            />
          </svg>
        </Link>
      </div>
      <div className="header-elements">
        <Searchbar
          placeholder="Search gists..."
          value={searchTerm}
          onChange={handleSearchChange}
        />

        {!isLoggedIn ? (
          <Button
            text="Login"
            onClick={handleLoginButtonClick}
            type="default"
          />
        ) : (
          <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
            <div className="avatar-wrapper">
              <Avatar
                style={{
                  cursor: "pointer",
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                src={user?.photoURL}
                alt="GitHub Profile Picture"
                size={45}
              />
            </div>
          </Dropdown>
        )}
      </div>
    </AntdHeader>
  );
}

export default Header;
