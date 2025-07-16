import { PText } from "./WeatherStyled";
import styled from "styled-components";

const LabelCard = styled.div`
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

 const WeatherImageLabel = styled.p`
  display: flex;
  align-items: center;
  height: 50px;
`;

 const TempTextLabel = styled.h3`
  margin: 5px 0;
`;

export default function WeatherLabelCard() {
    return (
        <LabelCard>
            <PText $mVal={"3px"}>시간</PText>
            <WeatherImageLabel>날씨</WeatherImageLabel>
            <TempTextLabel>온도</TempTextLabel>
            <PText $mVal={"5px"}>습도</PText>
            <PText $mVal={"5px"}>강수확률</PText>
            <PText $mVal={"5px"}>풍속</PText>
        </LabelCard>
    )
}