import VerticalSpacing from 'components/VerticalSpacing';
import React from 'react';
import CircleImage from './CircleImage.png';
import { Container, Description, Image, Title } from './styled';

const CirclesExplanation: React.FC = () => {
  return (
    <Container>
      <Image src={CircleImage} alt="What is a Circle" />

      <VerticalSpacing height={23.4} />

      <Title>What is a Circle?</Title>

      <VerticalSpacing height={10} />

      <Description>
        Chat, recommend content and meditate in real time with groups of
        colleagues and friends.
      </Description>
    </Container>
  );
};

export default CirclesExplanation;
