import styled from "styled-components";

const getGradientForTime = (time) => {
  if (!time) return "inherit";

  const hour = parseInt(time.split(":")[0], 10);

  if (hour >= 6 && hour <= 23) {
    return "linear-gradient(to bottom, rgba(0, 89, 255, 0.6), rgba(66, 131, 252, 0.3))";
  } else {
    return "linear-gradient(to bottom, rgba(3, 5, 8, 0.6), rgba(35, 76, 153, 0.3))";
  }
};

const getFontColorForTime = (time) => {
  if (!time) return "inherit";

  const hour = parseInt(time.split(":")[0], 10);

  if (hour >= 6 && hour <= 23) {
    return "#494848";
  } else {
    return "#dadada";
  }
};

export const CardContainerWrapper = styled.div`
  display: flex;
  padding-top: 1rem;
  flex-direction: column;
  flex: 0 0 4rem;
  position: relative;
    border-right: 1px dotted rgba(0, 0, 0, 0.4);
      background: ${({ time }) => getGradientForTime(time)};
  color: ${({ time }) => getFontColorForTime(time)};
`;

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
`;

export const LiveCardContainer = styled.div`
  margin-left: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 1rem;
  width: 50%;
  height: 15rem;
  background: linear-gradient(
    to bottom,
    rgba(0, 89, 255, 0.7),
    rgba(66, 131, 252, 0.4)
  );
`;
export const LabelCard = styled.div`
  padding: 1rem 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-right: 1px solid rgba(0, 0, 0, 0.4);
  flex: 0 0 5rem;
`;

export const DateLabel = styled.div `
  width: 4rem;
  height: 1rem;
  position: absolute;
  top: 0rem;
  text-align: center;
  color: white;
`;


export const CardDate = styled.p`
  /* font-size: 0.5rem; */
`;

export const LineContainer = styled.div`
  /* display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 2rem; */
`;

export const WeatherImage = styled.p``;

export const WeatherImageLabel = styled.p``;

export const TempTextLabel = styled.h3`
  margin: 5px 0;
`;

export const Temperature = styled.h3`
  margin: 5px 0;
`;

export const SpanText = styled.span``;

export const PText = styled.p`
  margin: 5px 0;
`;
