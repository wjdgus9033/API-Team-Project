import styled from "styled-components";

const getMargin = (props) => `${props.mVal ?? 0}`;

const getGradientForTime = (time) => {
  if (!time) return "inherit";

  const hour = parseInt(time.split(":")[0], 10);

  if (hour >= 6 && hour <= 23) {
    return "linear-gradient(to bottom, rgba(0, 89, 255, 0.6), rgba(66, 131, 252, 0.3))";
  } else {
    return (
      //"linear-gradient(to bottom, rgba(3, 5, 8, 0.6), rgba(35, 76, 153, 0.3))"
      "linear-gradient(to bottom, rgba(0, 89, 255, 0.6), rgba(66, 131, 252, 0.3))"
    );
  }
};

const getFontColorForTime = (time) => {
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

export const WeatherCardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  overflow-x: auto;

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;

  &:hover {
    scrollbar-color: rgba(0, 0, 0, 0.4) transparent;
  }

  &::-webkit-scrollbar {
    height: 8px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 4px;
    transition: background-color 0.3s;
  }

  &:hover::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.4);
  }
`;
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
  border-radius: inherit;
  width: 100%;
  height: 15rem;
  display: flex;
  align-items: center;
  position: relative;
  /* background: linear-gradient(
    to bottom,
    rgba(0, 89, 255, 0.7),
    rgba(66, 131, 252, 0.4)
  ); */
`;
export const LabelCard = styled.div`
  padding-top: 1rem;
  flex-shrink: 0;
  width: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  border-right: 1px solid rgba(0, 0, 0, 0.4);
  background-color: white;
  z-index: 1;
  position: sticky;
  left: 0;
  top: 0;
`;

export const DateLabel = styled.div`
  width: 3rem;
  height: 1.2rem;
  position: absolute;
  text-align: center;
  top: 0;
  left: -40%;
  color: #494848;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  background-color: #ff6b57;
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

export const WeatherImage = styled.img`
  width: 50px;
`;

export const WeatherImageLabel = styled.p`
  display: flex;
  align-items: center;
  height: 50px;
`;

export const TempTextLabel = styled.h3`
  margin: 5px 0;
`;

export const Temperature = styled.h3`
  margin: 5px 0;
`;
export const PText = styled.p`
  margin-top: ${getMargin?? 0};
  margin-bottom: ${getMargin?? 0};
`;
