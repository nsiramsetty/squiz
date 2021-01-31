import styled from '@emotion/styled';
import React from 'react';
import XRegExp from 'xregexp';

interface Props {
  children: string;
}

const HashTagsLinkerStyled = styled.span`
  a {
    transition: 0.3s;
    font-family: ProximaNova-Semibold, sans-serif;

    &:hover {
      color: black;
      font-family: ProximaNova-Bold, sans-serif;
    }
  }
`;

const HashTagsLinker: React.FC<Props> = ({ children }) => {
  const renderHashTagsLinker = (text: string) => {
    const regex = XRegExp('#[\\p{N}\\p{L}]+', 'gui');

    const codedText = XRegExp.replace(text, regex, '<a>$&</a>');

    return codedText.split('<a>').map((val, i) => {
      if (i > 0) {
        return val.split('</a>').map((link, j) => {
          if (j === 0) {
            return (
              <a
                href={`/hashtag/${link
                  .slice(1)
                  .toLowerCase()
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')}`}
              >
                {link}
              </a>
            );
          }
          return <span>{link}</span>;
        });
      }
      return <span>{val}</span>;
    });
  };

  return (
    <HashTagsLinkerStyled>
      {renderHashTagsLinker(children)}
    </HashTagsLinkerStyled>
  );
};

export default HashTagsLinker;
