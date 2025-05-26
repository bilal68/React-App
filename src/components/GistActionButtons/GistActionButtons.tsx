import React from "react";
import "./GistActionButtons.css";
import { Button } from "antd";

interface GistActionButtonsProps {
  gistId: string;
  isLoggedIn: boolean;
  onFork?: (id: string) => void;
  onStar?: (id: string) => void;
  forksCount?: number;
  starsCount?: number;
  isForkLoading?: boolean;
  isStarLoading?: boolean;
}

const GistActionButtons: React.FC<GistActionButtonsProps> = ({
  gistId,
  isLoggedIn,
  onFork = () => {},
  onStar = () => {},
  forksCount = 0,
  starsCount = 0,
  isForkLoading = false,
  isStarLoading = false,
}) => {
  return (
    <div className="gist-action-buttons">
      {/* Fork Button */}
      <div className="custom-action-button">
        <Button
         type="default"
          className="label-btn"
          onClick={() => onFork(gistId)}
          disabled={!isLoggedIn}
          block={true}
          loading={isForkLoading}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M7.29158 16.0417C7.29158 17.5374 8.50415 18.75 9.99992 18.75C11.4957 18.75 12.7083 17.5374 12.7083 16.0417C12.7083 14.761 11.8194 13.688 10.6249 13.4058V10.4167H12.7083C14.4341 10.4167 15.8333 9.01756 15.8333 7.29167V6.5942C17.0277 6.31204 17.9166 5.23899 17.9166 3.95833C17.9166 2.46256 16.704 1.25 15.2083 1.25C13.7125 1.25 12.4999 2.46256 12.4999 3.95833C12.4999 5.23899 13.3888 6.31204 14.5833 6.5942V7.29167C14.5833 8.3272 13.7438 9.16667 12.7083 9.16667H7.29158C6.25605 9.16667 5.41659 8.3272 5.41659 7.29167V6.5942C6.61104 6.31204 7.49992 5.23899 7.49992 3.95833C7.49992 2.46256 6.28736 1.25 4.79159 1.25C3.29581 1.25 2.08325 2.46256 2.08325 3.95833C2.08325 5.23899 2.97213 6.31204 4.16659 6.5942V7.29167C4.16659 9.01756 5.5657 10.4167 7.29158 10.4167H9.37492V13.4058C8.18046 13.688 7.29158 14.761 7.29158 16.0417ZM9.99992 17.5C9.1945 17.5 8.54158 16.8471 8.54158 16.0417C8.54158 15.2363 9.1945 14.5833 9.99992 14.5833C10.8053 14.5833 11.4583 15.2363 11.4583 16.0417C11.4583 16.8471 10.8053 17.5 9.99992 17.5ZM4.79159 5.41667C3.98617 5.41667 3.33325 4.76375 3.33325 3.95833C3.33325 3.15292 3.98617 2.5 4.79159 2.5C5.597 2.5 6.24992 3.15292 6.24992 3.95833C6.24992 4.76375 5.597 5.41667 4.79159 5.41667ZM13.7499 3.95833C13.7499 4.76375 14.4028 5.41667 15.2083 5.41667C16.0137 5.41667 16.6666 4.76375 16.6666 3.95833C16.6666 3.15292 16.0137 2.5 15.2083 2.5C14.4028 2.5 13.7499 3.15292 13.7499 3.95833Z"
              fill="white"
            />
          </svg>
          Fork
        </Button>
        <div className="count">{forksCount}</div>
      </div>

      {/* Star Button */}
      <div className="custom-action-button">
        <Button
          className="label-btn"
          onClick={() => onStar(gistId)}
          disabled={!isLoggedIn}
          block={true}
          loading={isStarLoading}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M10 0.208252C10.2379 0.208252 10.4552 0.343314 10.5605 0.556648L13.1091 5.72067L18.8079 6.54876C19.0433 6.58297 19.2389 6.74787 19.3124 6.97413C19.386 7.20038 19.3247 7.44876 19.1543 7.61482L15.0306 11.6344L16.0041 17.3103C16.0443 17.5447 15.9479 17.7817 15.7554 17.9215C15.5629 18.0614 15.3078 18.0798 15.0972 17.9691L10 15.2894L4.90283 17.9691C4.69225 18.0798 4.43709 18.0614 4.24462 17.9215C4.05216 17.7817 3.95577 17.5447 3.99598 17.3103L4.96946 11.6344L0.845743 7.61482C0.675385 7.44876 0.614075 7.20038 0.68759 6.97413C0.761106 6.74787 0.956698 6.58297 1.19213 6.54876L6.89096 5.72067L9.43956 0.556648C9.54485 0.343314 9.76212 0.208252 10 0.208252ZM10 2.24547L7.86646 6.56853C7.77542 6.75299 7.59945 6.88085 7.39588 6.91043L2.6251 7.60366L6.07727 10.9687C6.22457 11.1123 6.29179 11.3192 6.25702 11.5219L5.44207 16.2734L9.70918 14.03C9.89126 13.9343 10.1088 13.9343 10.2909 14.03L14.558 16.2734L13.743 11.5219C13.7082 11.3192 13.7755 11.1123 13.9228 10.9687L17.3749 7.60366L12.6042 6.91043C12.4006 6.88085 12.2246 6.75299 12.1336 6.56853L10 2.24547Z"
              fill="white"
            />
          </svg>
          Star
        </Button>
        <div className="count">{starsCount}</div>
      </div>
    </div>
  );
};

export default GistActionButtons;
