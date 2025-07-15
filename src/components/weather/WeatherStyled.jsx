import styled from "styled-components";

const getMargin = (props) => `${props.mVal ?? 0}`;

const getTime = (props) => `${props.time ?? "0000"}`;

export const getGradientForTime = (time) => {
  if (!time) return "inherit";

  const hour = parseInt(time.split(":")[0], 10);

  if (hour >= 6 && hour <= 23) {
    return "linear-gradient(to bottom, rgba(0, 89, 255, 0.6), rgba(66, 131, 252, 0.3))";
  } else {
    return (
      "linear-gradient(to bottom, rgba(0, 89, 255, 0.6), rgba(66, 131, 252, 0.3))"
    );
  }
};

export const getFontColorForTime = (time) => {
  if (!time) return "inherit";

  const hour = parseInt(time.split(":")[0], 10);

  if (hour >= 6 && hour <= 23) {
    return "#494848";
  } else {
    return "#494848"; //"#dadada";
  }
};

export const WeatherWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 2rem);
  justify-content: center;
`;


export const Temperature = styled.h3`
  margin: 5px 0;
`;
export const PText = styled.p`
  margin-top: ${getMargin?? 0};
  margin-bottom: ${getMargin?? 0};
`;
