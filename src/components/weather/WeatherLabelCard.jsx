import { LabelCard, PText, WeatherImageLabel, TempTextLabel } from "./WeatherStyled";

export default function WeatherLabelCard() {
    return (
        <LabelCard>
            <PText mVal={"3px"}>시간</PText>
            <WeatherImageLabel>날씨</WeatherImageLabel>
            <TempTextLabel>온도</TempTextLabel>
            <PText mVal={"5px"}>습도</PText>
            <PText mVal={"5px"}>강수확률</PText>
            <PText mVal={"5px"}>풍속</PText>
        </LabelCard>
    )
}