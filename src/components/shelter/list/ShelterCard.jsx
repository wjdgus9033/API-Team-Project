import React from 'react';

export default function ShelterCard({ shelter }) {
  return (
    <div className="shelter-item">
      <h4 className="shelter-name">
        <span className="shelter-name-text">
          📍 {shelter.name}
        </span>
        {shelter.distance && (
          <span className="shelter-distance">
            {shelter.distance.toFixed(1)}km
          </span>
        )}
      </h4>
      <p className="shelter-info address">
        <strong>주소:</strong> {shelter.roadAddress}
      </p>
      <p className="shelter-info">
        <strong>운영시간:</strong> {shelter.weekday}
      </p>
      <p className="shelter-info last">
        <strong>전화:</strong> {shelter.tel}
      </p>
    </div>
  );
}
