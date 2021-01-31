import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document } from '@contentful/rich-text-types';
import Box from '@material-ui/core/Box';
import SectionContainer from 'components/SectionContainer/v2';
import VerticalSpacing from 'components/VerticalSpacing';
import { Asset } from 'contentful';
import React, { FC } from 'react';
import {
  AspectRatio,
  CenterLeft,
  CenterRight,
  Column,
  FloatLeft,
  FloatRight,
  RichTextWrapper,
  Row,
  StyledImage,
  TextSegmentBackground
} from './styled';

export type ImagePositions =
  | 'center_left'
  | 'center_right'
  | 'float_left'
  | 'float_right'
  | 'center_top'
  | 'center_bottom';

export interface TextSegmentProps {
  richText: Document;
  image?: Asset;
  imagePosition?: ImagePositions;
  backgroundColor?: string;
}

const Sizing: FC<{ imagePosition?: ImagePositions }> = ({
  imagePosition,
  children
}) => {
  switch (imagePosition) {
    case 'center_left':
    case 'center_right':
      return <Column>{children}</Column>;

    case 'float_left':
    case 'float_right':
    case 'center_top':
    case 'center_bottom':
    default:
      return <Row>{children}</Row>;
  }
};

const ImageSizing: FC<{ imagePosition?: ImagePositions }> = ({
  imagePosition,
  children
}) => {
  switch (imagePosition) {
    case 'center_left':
      return <CenterLeft>{children}</CenterLeft>;
    case 'center_right':
      return <CenterRight>{children}</CenterRight>;

    case 'float_left':
      return <FloatLeft> {children}</FloatLeft>;
    case 'float_right':
      return <FloatRight> {children}</FloatRight>;

    case 'center_top':
    case 'center_bottom':
    default:
      return (
        <AspectRatio>
          <Box position="absolute" top={0} left={0} width="100%" height="100%">
            {children}
          </Box>
        </AspectRatio>
      );
  }
};

const TextSegment = ({
  richText,
  image,
  imagePosition,
  backgroundColor
}: TextSegmentProps) => {
  const isFloat = imagePosition?.startsWith('float');

  return (
    <>
      <VerticalSpacing height={[50, 100]} />
      <TextSegmentBackground
        color={`${backgroundColor ? '#fff' : '#181818'}`}
        bgcolor={
          backgroundColor ? `#${backgroundColor.split('_')[1]}` : 'transparent'
        }
        paddingTop={backgroundColor ? '100px' : '0px'}
        paddingBottom={backgroundColor ? '100px' : '0px'}
      >
        <SectionContainer>
          <Box maxWidth="1496px" margin="auto">
            <Box
              display="flex"
              flexDirection={
                imagePosition === 'center_right' ||
                imagePosition === 'center_bottom'
                  ? 'row-reverse'
                  : undefined
              }
              flexWrap={
                imagePosition === 'center_right' ||
                imagePosition === 'center_bottom'
                  ? 'wrap-reverse'
                  : 'wrap'
              }
              alignItems="center"
              justifyContent="space-evenly"
            >
              {image != null && !isFloat && (
                <Sizing imagePosition={imagePosition}>
                  <ImageSizing imagePosition={imagePosition}>
                    <StyledImage
                      src={image?.fields.file.url}
                      alt={image?.fields.title}
                    />
                  </ImageSizing>
                </Sizing>
              )}

              <Sizing imagePosition={imagePosition}>
                {image != null && isFloat && (
                  <ImageSizing imagePosition={imagePosition}>
                    <img
                      src={image?.fields.file.url}
                      alt={image?.fields.title}
                    />
                  </ImageSizing>
                )}
                <RichTextWrapper>
                  {richText != null && documentToReactComponents(richText)}
                </RichTextWrapper>
              </Sizing>
            </Box>
          </Box>
        </SectionContainer>
      </TextSegmentBackground>
    </>
  );
};

export default TextSegment;
