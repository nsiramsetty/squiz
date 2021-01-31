import styled from '@emotion/styled';
import Star from '@material-ui/icons/Star';
import React, { FunctionComponent } from 'react';
import { v4 as uuidv4 } from 'uuid';

type TProps = {
  rating: number;
  starHeight: number;
};

const Container = styled.div`
  display: flex;
  flex-flow: row nowrap;
`;

const Relative = styled.div`
  position: relative;
`;

const FilledStars = styled.div<{ percWidth: number }>`
  position: absolute;
  left: 0;
  overflow: hidden;
  top: 0;
  z-index: 10;
  width: ${props => `${props.percWidth}%`};
`;

function calculatePercentage(rating: number, i: number): number {
  if (rating >= i + 1) return 100;
  if (Math.ceil(rating) >= i + 1) return (rating - i) * 100;
  return 0;
}

const StarRating: FunctionComponent<TProps> = ({ rating }) => {
  return (
    <Container>
      {Array(Math.floor(5))
        .fill(0)
        .map((_, i) => (
          <Relative key={uuidv4()}>
            <Star
              style={{
                width: '12px',
                height: '12px',
                color: 'rgb(0,0,0,0.25)'
              }}
            />
            <FilledStars percWidth={calculatePercentage(rating, i)}>
              <Star
                style={{
                  width: '12px',
                  height: '12px',
                  color: 'rgb(0,0,0,0.75)'
                }}
              />
            </FilledStars>
          </Relative>
        ))}
    </Container>
  );
};

export default StarRating;
