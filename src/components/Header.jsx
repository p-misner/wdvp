import React from 'react';
import styled from 'styled-components';
import { medFontSize, medSpacing, regularWeight } from '../styleConstants';

const HeaderWrapper = styled.div`
  border-bottom: 2px solid #000531;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  // padding: ${medSpacing};
  padding-top: 32px;
  padding-bottom: 24px;
  margin-bottom: 32px;
`;
const FooterWrapper = styled.div`
  border-top: 2px solid #000531;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  padding-top: 32px;
  padding-bottom: 64px;
  margin-top: 64px;
`;

const AppTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #000531;
  opacity: 0;
`;
const Section = styled.h3`
  font-size: ${medFontSize};
  font-weight: ${regularWeight};
`;

export function Header() {
  return (
    <HeaderWrapper>
      <svg
        id="a"
        xmlns="http://www.w3.org/2000/svg"
        height="48"
        viewBox="0 0 736.76 197.15"
      >
        <polygon
          points="227.75 15.57 239.78 15.57 247.06 51.45 255.75 16.91 265.93 16.91 274.69 51.45 281.9 15.57 293.49 15.57 280.86 65.12 269.05 65.12 260.58 32.73 251.96 65.12 240.15 65.12 227.75 15.57"
          fill="#215d9e"
        />
        <path
          d="M322.31,55.83c2.18,0,4.13-.42,5.87-1.26,1.73-.84,3.21-1.98,4.42-3.42,1.21-1.44,2.14-3.09,2.79-4.98,.64-1.88,.97-3.89,.97-6.02s-.32-4.13-.97-6.02c-.64-1.88-1.57-3.53-2.79-4.94-1.21-1.41-2.69-2.52-4.42-3.34-1.73-.82-3.69-1.23-5.87-1.23s-4.15,.41-5.91,1.23c-1.76,.82-3.24,1.93-4.46,3.34-1.21,1.41-2.14,3.06-2.79,4.94-.64,1.88-.97,3.89-.97,6.02s.32,4.14,.97,6.02c.64,1.88,1.57,3.54,2.79,4.98,1.21,1.44,2.7,2.58,4.46,3.42,1.76,.84,3.72,1.26,5.91,1.26m0,10.55c-3.67,0-7.07-.67-10.22-2.01-3.14-1.34-5.87-3.17-8.17-5.5-2.3-2.33-4.11-5.09-5.42-8.28-1.31-3.19-1.97-6.62-1.97-10.29s.66-7.16,1.97-10.32c1.31-3.17,3.12-5.92,5.42-8.25,2.3-2.33,5.03-4.16,8.17-5.5,3.14-1.34,6.55-2.01,10.22-2.01s7.07,.67,10.21,2.01c3.14,1.34,5.87,3.17,8.17,5.5,2.3,2.33,4.11,5.08,5.42,8.25,1.31,3.17,1.97,6.61,1.97,10.32s-.66,7.1-1.97,10.29c-1.31,3.19-3.12,5.95-5.42,8.28-2.3,2.33-5.03,4.16-8.17,5.5-3.15,1.34-6.55,2.01-10.21,2.01"
          fill="#215d9e"
        />
        <path
          d="M373.86,37.93c2.08,0,3.71-.62,4.9-1.86,1.19-1.24,1.78-2.8,1.78-4.68,0-2.03-.59-3.64-1.78-4.83-1.19-1.19-2.82-1.78-4.9-1.78h-6.91v13.15h6.91Zm-17.83-22.36h18.42c2.87,0,5.4,.41,7.58,1.22,2.18,.82,4,1.93,5.46,3.34,1.46,1.41,2.55,3.06,3.27,4.94,.72,1.88,1.08,3.89,1.08,6.02,0,3.22-.71,6.03-2.12,8.43-1.41,2.4-3.4,4.32-5.98,5.76l10.99,19.83h-12.33l-9.21-18.2h-6.24v18.2h-10.92V15.57Z"
          fill="#215d9e"
        />
        <polygon
          points="401.34 15.57 412.55 15.57 412.55 55.16 436.25 55.16 436.25 65.12 401.34 65.12 401.34 15.57"
          fill="#215d9e"
        />
        <path
          d="M460.98,55.16c4.95,0,8.77-1.3,11.44-3.9,2.67-2.6,4.01-6.18,4.01-10.73,0-2.28-.31-4.34-.93-6.2-.62-1.86-1.56-3.44-2.82-4.75-1.26-1.31-2.86-2.33-4.79-3.05-1.93-.72-4.23-1.08-6.91-1.08h-6.83v29.71h6.83Zm-18.05-39.59h18.72c3.81,0,7.34,.5,10.59,1.49,3.24,.99,6.04,2.5,8.39,4.53,2.35,2.03,4.19,4.63,5.5,7.8,1.31,3.17,1.97,6.91,1.97,11.22s-.67,7.69-2.01,10.73c-1.34,3.05-3.18,5.6-5.53,7.65-2.35,2.06-5.15,3.59-8.4,4.6-3.24,1.02-6.77,1.52-10.58,1.52h-18.64V15.57Z"
          fill="#215d9e"
        />
        <path
          d="M255.31,96.78h19.09v21.47c-2.57,2.23-5.58,3.95-9.02,5.16-3.44,1.21-7.37,1.82-11.77,1.82-4.06,0-7.69-.63-10.88-1.89-3.19-1.26-5.91-3.03-8.13-5.31-2.23-2.28-3.93-5-5.09-8.17-1.16-3.17-1.74-6.66-1.74-10.48s.62-7.15,1.86-10.32,3-5.93,5.27-8.28c2.28-2.35,4.98-4.2,8.1-5.53,3.12-1.34,6.58-2.01,10.4-2.01,4.51,0,8.46,.83,11.85,2.49,3.39,1.66,6.2,3.97,8.43,6.95l-7.58,7.21c-1.58-1.88-3.33-3.42-5.24-4.61-1.91-1.19-4.25-1.78-7.02-1.78-2.28,0-4.31,.42-6.09,1.26-1.78,.84-3.29,1.98-4.53,3.42-1.24,1.44-2.18,3.12-2.82,5.05-.64,1.93-.97,3.99-.97,6.16,0,2.38,.37,4.53,1.11,6.46,.74,1.93,1.78,3.58,3.12,4.94,1.34,1.36,2.91,2.41,4.72,3.16,1.81,.74,3.78,1.11,5.91,1.11,1.98,0,3.79-.23,5.42-.71,1.63-.47,3.09-1.22,4.38-2.26v-6.24h-8.77v-9.06Z"
          fill="#215d9e"
        />
        <path
          d="M307.3,114.76c2.18,0,4.13-.42,5.87-1.26,1.73-.84,3.21-1.98,4.42-3.42,1.21-1.44,2.14-3.09,2.79-4.98,.64-1.88,.97-3.89,.97-6.02s-.32-4.13-.97-6.02c-.64-1.88-1.57-3.53-2.79-4.94-1.21-1.41-2.69-2.52-4.42-3.34-1.73-.82-3.69-1.23-5.87-1.23s-4.15,.41-5.91,1.23c-1.76,.82-3.24,1.93-4.46,3.34-1.21,1.41-2.14,3.06-2.79,4.94-.64,1.88-.97,3.89-.97,6.02s.32,4.14,.97,6.02c.64,1.88,1.57,3.54,2.79,4.98,1.21,1.44,2.7,2.58,4.46,3.42,1.76,.84,3.72,1.26,5.91,1.26m0,10.55c-3.67,0-7.07-.67-10.22-2.01-3.14-1.34-5.87-3.17-8.17-5.5-2.3-2.33-4.11-5.09-5.42-8.28-1.31-3.19-1.97-6.62-1.97-10.29s.66-7.16,1.97-10.32c1.31-3.17,3.12-5.92,5.42-8.25,2.3-2.33,5.03-4.16,8.17-5.5,3.14-1.34,6.55-2.01,10.22-2.01s7.07,.67,10.21,2.01c3.14,1.34,5.87,3.17,8.17,5.5,2.3,2.33,4.11,5.08,5.42,8.25,1.31,3.17,1.97,6.61,1.97,10.32s-.66,7.1-1.97,10.29c-1.31,3.19-3.12,5.95-5.42,8.28-2.3,2.33-5.03,4.16-8.17,5.5-3.15,1.34-6.55,2.01-10.21,2.01"
          fill="#215d9e"
        />
        <polygon
          points="334.34 74.5 346.74 74.5 358.85 110.67 370.66 74.5 382.55 74.5 364.35 124.05 352.54 124.05 334.34 74.5"
          fill="#215d9e"
        />
        <polygon
          points="387.97 74.5 421.84 74.5 421.84 84.31 399.18 84.31 399.18 93.96 416.79 93.96 416.79 103.47 399.18 103.47 399.18 114.17 423.47 114.17 423.47 124.05 387.97 124.05 387.97 74.5"
          fill="#215d9e"
        />
        <path
          d="M448.95,96.86c2.08,0,3.71-.62,4.9-1.86,1.19-1.24,1.78-2.8,1.78-4.68,0-2.03-.59-3.64-1.78-4.83-1.19-1.19-2.82-1.78-4.9-1.78h-6.91v13.15h6.91Zm-17.83-22.36h18.42c2.87,0,5.4,.41,7.58,1.22,2.18,.82,4,1.93,5.46,3.34,1.46,1.41,2.55,3.06,3.27,4.94,.72,1.88,1.08,3.89,1.08,6.02,0,3.22-.71,6.03-2.12,8.43-1.41,2.4-3.41,4.32-5.98,5.76l10.99,19.83h-12.33l-9.21-18.2h-6.24v18.2h-10.92v-49.54Z"
          fill="#215d9e"
        />
        <polygon
          points="476.28 74.5 486.98 74.5 508.45 106.66 508.45 74.5 519.52 74.5 519.52 124.05 509.34 124.05 487.35 91.29 487.35 124.05 476.28 124.05 476.28 74.5"
          fill="#215d9e"
        />
        <polygon
          points="530.73 74.5 541.35 74.5 554.28 97.75 566.91 74.5 577.6 74.5 579.9 124.05 568.69 124.05 567.28 91.66 557.03 110.97 551.23 110.97 540.39 91.88 539.13 124.05 528.43 124.05 530.73 74.5"
          fill="#215d9e"
        />
        <polygon
          points="588.82 74.5 622.69 74.5 622.69 84.31 600.03 84.31 600.03 93.96 617.64 93.96 617.64 103.47 600.03 103.47 600.03 114.17 624.32 114.17 624.32 124.05 588.82 124.05 588.82 74.5"
          fill="#215d9e"
        />
        <polygon
          points="631.97 74.5 642.67 74.5 664.13 106.66 664.13 74.5 675.2 74.5 675.2 124.05 665.03 124.05 643.04 91.29 643.04 124.05 631.97 124.05 631.97 74.5"
          fill="#215d9e"
        />
        <polygon
          points="681.66 74.5 681.66 84.38 697.71 84.38 697.71 124.05 709 124.05 709 84.38 724.97 84.38 724.97 74.5 681.66 74.5"
          fill="#215d9e"
        />
        <path
          d="M234.95,168.19c.64,.69,1.4,1.4,2.27,2.12,.86,.72,1.83,1.38,2.9,1.97,1.06,.6,2.23,1.08,3.49,1.45,1.26,.37,2.61,.56,4.05,.56,.84,0,1.68-.12,2.53-.37,.84-.25,1.61-.61,2.3-1.08,.69-.47,1.25-1.04,1.67-1.71,.42-.67,.63-1.42,.63-2.27,0-1.83-.89-3.25-2.67-4.27-1.78-1.01-4.61-2.02-8.47-3.01-1.88-.45-3.63-1.09-5.24-1.93-1.61-.84-3-1.86-4.16-3.05-1.16-1.19-2.07-2.55-2.71-4.08-.64-1.54-.97-3.24-.97-5.13,0-2.08,.37-4.03,1.11-5.87,.74-1.83,1.87-3.45,3.38-4.87,1.51-1.41,3.39-2.52,5.64-3.34,2.25-.82,4.92-1.22,7.99-1.22,2.52,0,4.75,.26,6.68,.78,1.93,.52,3.58,1.14,4.94,1.86,1.36,.72,2.48,1.46,3.34,2.23,.87,.77,1.52,1.38,1.97,1.82l-6.46,7.13c-.55-.44-1.18-.93-1.89-1.45-.72-.52-1.52-1-2.41-1.45-.89-.45-1.87-.82-2.93-1.11-1.07-.3-2.19-.45-3.38-.45-.79,0-1.57,.12-2.34,.37-.77,.25-1.46,.58-2.08,1-.62,.42-1.11,.92-1.49,1.49-.37,.57-.56,1.18-.56,1.82,0,1.68,.89,3.05,2.67,4.08,1.78,1.04,4.23,1.91,7.36,2.6,1.83,.45,3.63,1.05,5.38,1.82,1.76,.77,3.33,1.77,4.72,3.01,1.39,1.24,2.5,2.76,3.34,4.57,.84,1.81,1.26,4,1.26,6.57,0,2.23-.5,4.28-1.49,6.16-.99,1.88-2.34,3.52-4.05,4.9-1.71,1.39-3.71,2.46-6.02,3.23-2.3,.77-4.79,1.15-7.47,1.15-2.48,0-4.73-.24-6.76-.71-2.03-.47-3.86-1.09-5.5-1.86-1.64-.77-3.11-1.65-4.42-2.64-1.31-.99-2.44-2-3.38-3.04l7.2-7.8Z"
          fill="#215d9e"
        />
        <path
          d="M274.77,133.43h11.29v29.34c0,1.63,.16,3.11,.48,4.42,.32,1.31,.86,2.44,1.6,3.38,.74,.94,1.72,1.67,2.93,2.19,1.21,.52,2.71,.78,4.5,.78s3.21-.26,4.42-.78c1.21-.52,2.19-1.25,2.93-2.19,.74-.94,1.28-2.07,1.6-3.38,.32-1.31,.48-2.79,.48-4.42v-29.34h11.36v30.75c0,2.97-.48,5.7-1.45,8.17-.97,2.48-2.35,4.59-4.16,6.35-1.81,1.76-4,3.13-6.57,4.12-2.58,.99-5.45,1.48-8.62,1.48s-6.04-.48-8.62-1.45c-2.58-.97-4.77-2.34-6.57-4.12-1.81-1.78-3.2-3.91-4.16-6.39-.97-2.48-1.45-5.2-1.45-8.17v-30.75Z"
          fill="#215d9e"
        />
        <polygon
          points="327.13 133.43 337.75 133.43 350.68 156.68 363.31 133.43 374 133.43 376.3 182.98 365.09 182.98 363.68 150.59 353.43 169.9 347.63 169.9 336.79 150.81 335.53 182.98 324.83 182.98 327.13 133.43"
          fill="#215d9e"
        />
        <polygon
          points="386.63 133.43 397.25 133.43 410.18 156.68 422.81 133.43 433.5 133.43 435.8 182.98 424.59 182.98 423.18 150.59 412.93 169.9 407.13 169.9 396.29 150.81 395.03 182.98 384.33 182.98 386.63 133.43"
          fill="#215d9e"
        />
        <rect
          x="444.64"
          y="133.43"
          width="11.22"
          height="49.54"
          fill="#215d9e"
        />
        <polygon
          points="478.29 143.31 462.24 143.31 462.24 133.43 505.55 133.43 505.55 143.31 489.58 143.31 489.58 182.98 478.29 182.98 478.29 143.31"
          fill="#215d9e"
        />
        <path
          d="M20.22,86.71h-5.03c-.46,0-.83,.37-.83,.82v.12c.03,.68,.06,1.31,.08,1.65,.08,1.44,.16,2.78,.25,4.07,.37,5.06,.9,9.37,1.78,15.6,.17,2.16,.28,4.86,.28,8.58,0,.19,.17,.35,.36,.33,.51-.05,1.38-.17,1.38-.32,0-2.78,.06-4.99,.15-6.84,.41-5.44,1.41-9.99,2.03-17.32,.15-1.75,.28-3.65,.37-5.77v-.1c0-.45-.37-.82-.83-.82"
          fill="#215d9e"
        />
        <path
          d="M33.09,67.79h-6.21c-.45,0-.83,.37-.83,.82v.5l.09,3.19,.06,1.96,.1,3.6c.45,25.32,2.52,23.72,2.53,56.4,0,.34,1.28,.58,1.94,.7,.2,.04,.38-.12,.38-.32,.01-31.76,2-30.82,2.48-54.81l.15-5.59,.05-1.96,.09-3.16v-.53c0-.45-.37-.82-.83-.82"
          fill="#215d9e"
        />
        <path
          d="M59.74,44.39h-6.34c-.43,0-.78,.32-.82,.73,.01,.97,.03,2.14,.04,3.44,0,.69,.02,1.42,.03,2.17,.08,6.14,.2,13.99,.31,17.77,.58,36.24,2.43,39.67,2.44,92.07,0,.57,1.24,.98,1.92,1.19,.21,.07,.42-.09,.42-.31,0-51.9,1.84-55.47,2.41-91.53,.11-3.8,.24-12.53,.33-19.18,0-.75,.02-1.48,.03-2.17,.02-1.31,.03-2.48,.04-3.46-.05-.41-.39-.73-.82-.73"
          fill="#215d9e"
        />
        <path
          d="M46.55,56.09s-.06,0-.09,0h-6.36s-.06,0-.09,0c-.38,.04-.68,.34-.73,.72,.02,1.22,.03,2.4,.05,3.54,.01,.73,.03,1.43,.04,2.12,.06,3.04,.13,5.77,.22,8.26,.49,32.32,2.51,33.92,2.52,76.91,0,.45,1.24,.76,1.91,.93,.21,.05,.41-.11,.41-.32,.01-41.92,1.96-44.28,2.47-75.05,.08-2.17,.17-6.62,.26-10.69,.02-.71,.03-1.42,.04-2.09,.03-1.3,.05-2.49,.07-3.49,0-.06,0-.16-.01-.23-.08-.33-.36-.58-.71-.61"
          fill="#215d9e"
        />
        <path
          d="M73.04,32.97h-6.34c-.43,0-.78,.33-.82,.74,0,.97,.02,2.15,.04,3.51,0,.65,.01,1.35,.02,2.07,.11,9.82,.3,25.55,.5,31.97,.6,29.09,1.81,34.16,2.18,71.45,0,1.27,.1,19.83,.1,27,0,.67,1.2,1.17,1.88,1.44,.21,.09,.45-.07,.45-.3,0-59,1.62-63.95,2.29-100.27,.18-6.12,.37-21.56,.47-31.28,0-.72,.02-1.42,.02-2.07,.01-1.35,.03-2.54,.04-3.51-.04-.41-.39-.74-.82-.74"
          fill="#215d9e"
        />
        <path
          d="M86.3,27.65h-6.33c-.44,0-.8,.35-.82,.78,0,1.11,0,2.21,0,3.28,0,.72,0,1.42,0,2.12,.14,37.14,.9,51.8,1.58,69.04,.15,3.79,.29,7.61,.43,11.73,.4,12.4,.71,24.95,.75,50.24,0,0,.08,8.6,.08,11.51,0,.74,1.19,1.28,1.87,1.57,.22,.09,.46-.07,.46-.3,0-2.65,0-8.27,0-10.73,0,0,.15-23.65,.28-32.53,.37-21.5,1.01-29.62,1.53-45.71,.38-10.07,.75-39.95,.92-54.67,0-.73,.02-1.42,.02-2.07,.02-1.37,.03-2.56,.04-3.52-.04-.41-.39-.74-.82-.74"
          fill="#215d9e"
        />
        <path
          d="M172.73,86.71h5.03c.46,0,.83,.37,.83,.82v.12c-.03,.68-.06,1.31-.08,1.65-.08,1.44-.16,2.78-.25,4.07-.37,5.06-.9,9.37-1.78,15.6-.17,2.16-.28,4.86-.28,8.58,0,.19-.17,.35-.36,.33-.51-.05-1.38-.17-1.38-.32,0-2.78-.06-4.99-.15-6.84-.41-5.44-1.41-9.99-2.03-17.32-.15-1.75-.28-3.65-.37-5.77v-.1c0-.45,.37-.82,.83-.82"
          fill="#215d9e"
        />
        <path
          d="M159.86,67.79h6.21c.45,0,.83,.37,.83,.82v.5l-.09,3.19-.05,1.96-.1,3.6c-.45,25.32-2.52,23.72-2.53,56.4,0,.34-1.28,.58-1.94,.7-.2,.04-.38-.12-.38-.32-.01-31.76-2-30.82-2.48-54.81l-.15-5.59-.05-1.96-.09-3.16v-.53c0-.45,.37-.82,.83-.82"
          fill="#215d9e"
        />
        <path
          d="M133.2,44.39h6.34c.43,0,.78,.32,.82,.73-.01,.97-.03,2.14-.04,3.44,0,.69-.02,1.42-.03,2.17-.08,6.14-.2,13.99-.31,17.77-.58,36.24-2.43,39.67-2.44,92.07,0,.57-1.24,.98-1.92,1.19-.21,.07-.42-.09-.42-.31,0-51.9-1.84-55.47-2.41-91.53-.11-3.8-.24-12.53-.33-19.18,0-.75-.02-1.48-.03-2.17-.02-1.31-.03-2.48-.04-3.46,.05-.41,.39-.73,.82-.73"
          fill="#215d9e"
        />
        <path
          d="M146.39,56.09s.06,0,.09,0h6.36s.06,0,.09,0c.38,.04,.68,.34,.73,.72-.02,1.22-.03,2.4-.05,3.54-.01,.73-.03,1.43-.04,2.12-.06,3.04-.13,5.77-.22,8.26-.49,32.32-2.51,33.92-2.52,76.91,0,.45-1.24,.76-1.91,.93-.21,.05-.41-.11-.41-.32-.01-41.92-1.96-44.28-2.47-75.05-.08-2.17-.17-6.62-.26-10.69-.02-.71-.03-1.42-.04-2.09-.03-1.3-.05-2.49-.07-3.49,0-.06,0-.16,.01-.23,.08-.33,.36-.58,.71-.61"
          fill="#215d9e"
        />
        <path
          d="M119.91,32.97h6.34c.43,0,.78,.33,.82,.74,0,.97-.02,2.15-.04,3.51,0,.65-.01,1.35-.02,2.07-.11,9.82-.3,25.55-.5,31.97-.6,29.09-1.81,34.16-2.18,71.45,0,1.27-.1,19.83-.1,27,0,.67-1.2,1.17-1.88,1.44-.21,.09-.45-.07-.45-.3,0-59-1.62-63.95-2.29-100.27-.18-6.12-.37-21.56-.47-31.28,0-.72-.02-1.42-.02-2.07-.01-1.35-.03-2.54-.04-3.51,.04-.41,.39-.74,.82-.74"
          fill="#215d9e"
        />
        <path
          d="M106.65,27.65h6.33c.44,0,.8,.35,.82,.78,0,1.11,0,2.21,0,3.28,0,.72,0,1.42,0,2.12-.14,37.14-.9,51.8-1.58,69.04-.15,3.79-.29,7.61-.43,11.73-.4,12.4-.71,24.95-.75,50.24,0,0-.08,8.6-.08,11.51,0,.74-1.19,1.28-1.87,1.57-.22,.09-.46-.07-.46-.3,0-2.65,0-8.27,0-10.73,0,0-.15-23.65-.28-32.53-.37-21.5-1.01-29.62-1.53-45.71-.38-10.07-.75-39.95-.92-54.67,0-.73-.02-1.42-.02-2.07-.02-1.37-.03-2.56-.04-3.52,.04-.41,.39-.74,.82-.74"
          fill="#215d9e"
        />
        <path
          d="M99.63,15.42h-6.36c-.45,0-.83,.37-.83,.82v3.86s0,1.36,0,1.37c.12,84.65,2.73,66.71,2.77,154.53,0,0,.08,4.12,.09,6.69,0,.23,.25,.38,.46,.28,.67-.33,1.86-.93,1.86-1.75,0-1.78,.06-5.21,.06-5.21,0-21.17,.15-36.48,.37-48.63,.2-10.11,.45-15.07,.71-22.74,.74-20.65,1.69-84.53,1.69-84.53v-3.86c0-.45-.37-.82-.83-.82"
          fill="#215d9e"
        />
      </svg>
      {/* <AppTitle>Dashboard of the Present Future</AppTitle> */}
      <AppTitle>.</AppTitle>
    </HeaderWrapper>
  );
}

export function Footer() {
  return (
    <FooterWrapper>
      <Section>Thank you for checking this out! </Section>
      <Section>
        Created by Priya Misner for the World Data Viz Prize, 2023
      </Section>
    </FooterWrapper>
  );
}
