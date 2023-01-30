import React from 'react';

// eslint-disable-next-line import/prefer-default-export
export function tickFormatter(value) {
  if (value > 1000) {
    return `${value / 1000}k`;
  }
  return value;
}
