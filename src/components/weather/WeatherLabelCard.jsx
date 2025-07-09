import { LabelCard, PText, WeatherImageLabel, TempTextLabel } from "./WeatherStyled";

export default function WeatherLabelCard() {
    return (
        <LabelCard>
            <PText>시간</PText>
            <WeatherImageLabel>날씨</WeatherImageLabel>
            <TempTextLabel>온도</TempTextLabel>
            <PText>습도</PText>
            <PText>강수확률</PText>
            <PText>풍속</PText>
        </LabelCard>
    )
}