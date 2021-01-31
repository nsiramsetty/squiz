import React from 'react';

export const truncateText = (
  text: string | undefined,
  wordsDelta: number,
  maxChars: number
) => {
  if (text) {
    const characterCount = text.length;
    if (characterCount < maxChars) {
      return [text, characterCount];
    }

    const wordCount = text.split(' ').length;
    const trimmed = text.substr(0, maxChars);
    const trimmedCount = trimmed.split(' ').length;

    if (wordCount >= trimmedCount + wordsDelta) {
      const words = trimmed.split(' ');
      words.pop();

      const allWords = text.split(' ');
      allWords.splice(0, words.length);

      const trimmedWords = words.join(' ');

      return [
        <span>
          {trimmedWords}
          <span className="hidden">{` ${allWords.join(' ')}`}</span>...
        </span>,
        trimmedWords.length
      ];
    }
    return [<span>{text}</span>, text.length];
  }
  return [<span>{text}</span>, 0];
};
