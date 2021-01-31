import TileButton from 'components/TileButton';
import VerticalSpacing from 'components/VerticalSpacing';
import { useTaxonomy } from 'hooks/useTaxonomy';
import { FeaturedData } from 'lib/featured';
import React from 'react';
import { FeatureTileButtonContent, TileInfo, TileTitle } from './styled';

const staticImages = [
  'D6K3g9G7M8y5p8h9f0s8D0j1s8N5Y7d2H7Q8J2R6h1V6v7W4A3D6g9V3c6R7m4K3x9e2D3K2D8W7y8n5F7e7V6j9H1E9V0q8a3R9',
  'f8s8h1r2U7j2U3J8d9F6C8b0r5A8x7e3Q0S9g9v1R1s4U3Z9D2L4B2H2u7g5J0k2w0n7a3C8j3D2b6r0d6m5S2x5S1w4F8c7C3J0',
  'Q8w9m7x4h9D6w6b3w9E4U4P2f7P7U8s7e5u2q2Y5w5s3v7x0Y6d2f9r3W7X1N4C8c7K9D5C0q7f0z1k3R7g9h3b9p4h3C3x8D8S9',
  'y7k3G3d7v8a1t0a5C8H4n4c4b3X5x0Y1B9p4J3B9B2N9C3T4m3q3u1w4F1X9P7T5v5U3z3J1U1Z6q3g4C1X7c8n0T9s2f2L1E7m0',
  'q4B5p2m5X5u6p3t8q4U4w7n3K7N1Q5y2g1B3Q3K1K0V5e8N8d1Y3M5J8a2K5C2L9J3e7f9u0c7J1Z2f3N6G5K8s1k9x3z5P1C4v1',
  'cTMI4hK0Fldrr5X7qv2ZtKzegoU2',
  'bFbo9J01VwfynXQ9jSAocETeFre2'
];

const getBgUrls = (publisherId: string) => {
  if (staticImages.indexOf(publisherId) !== -1) {
    return {
      bgImageMobile: `https://sitemap.insighttimer.com/publisherImages/${publisherId}@2x.jpg?alt=media`,
      bgImage: `https://sitemap.insighttimer.com/publisherImages/${publisherId}@2x.jpg?alt=media`
    };
  }
  return {
    bgImageMobile: `https://users.insighttimer-api.net/${publisherId}%2Fpictures%2Fsquare_large.jpeg?alt=media`,
    bgImage: `https://users.insighttimer-api.net/${publisherId}%2Fpictures%2Fsquare_large.jpeg?alt=media`
  };
};

const FeatureTile: React.FC<FeaturedData & {
  paddingtop?: [string, string];
  disabled?: boolean;
}> = ({
  publisherId,
  publisherName,
  title,
  paddingtop,
  disabled,
  publisherUserName,
  slug
}) => {
  const { bgImageMobile, bgImage } = getBgUrls(publisherId);
  const taxonomy = useTaxonomy();
  return (
    <TileButton
      disabled={disabled}
      bgImageMobile={bgImageMobile}
      bgImage={bgImage}
      paddingtop={paddingtop || ['130%', '178%']}
      to={taxonomy.getSinglesUrl(slug, publisherUserName)}
      border="none"
    >
      <FeatureTileButtonContent>
        <TileTitle>{publisherName}</TileTitle>
        <VerticalSpacing height={9} />
        <TileInfo>{title}</TileInfo>
      </FeatureTileButtonContent>
    </TileButton>
  );
};

export default FeatureTile;
