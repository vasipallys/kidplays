import type { Sprite } from '../types/sprite';
import { createStarterSprite } from '../templates/starterSprites';
import { createId } from '../utils/ids';
import { nowIso } from '../utils/time';
import type { Lesson, SubjectId } from './catalog';

export function questionPicture(lesson: Lesson): Sprite {
  return pictureSprite({
    name: 'Look',
    x: -145,
    y: 96,
    size: 120,
    visible: true,
    color: lesson.color,
    svg: cardSvg(lesson.color, 'Look', lesson.title, scene(lesson.subject)),
    blocksXml: greenFlag(
      sayBlock(lesson.title, 4, ''),
    ),
  });
}

export function answerPicture(lesson: Lesson, waitSeconds: number): Sprite {
  const headline = lesson.answer.split(/[.!]/)[0]?.trim() || lesson.answer;
  return pictureSprite({
    name: 'Answer',
    x: 145,
    y: 96,
    size: 120,
    visible: false,
    color: '#16A34A',
    svg: cardSvg('#16A34A', 'Answer', headline, checkScene()),
    blocksXml: greenFlag(
      `<block type="looks_hide"><next>
        <block type="control_wait"><field name="SECONDS">${waitSeconds}</field><next>
          <block type="looks_show"><next>
            ${sayBlock(headline, 5, '')}
          </block></next>
        </block></next>
      </block>`,
    ),
  });
}

export function demoWaitSeconds(lesson: Lesson): number {
  if (lesson.demo === 'slide') {
    return 0.5;
  }
  if (lesson.demo === 'count') {
    return lesson.demoTimes * 0.2;
  }
  return lesson.demoTimes * 0.25;
}

function pictureSprite(options: {
  name: string;
  x: number;
  y: number;
  size: number;
  visible: boolean;
  color: string;
  svg: string;
  blocksXml: string;
}): Sprite {
  const sprite = createStarterSprite(options.name, options.color);
  const costume = {
    id: createId('costume'),
    name: options.name,
    dataUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(options.svg)}`,
    mimeType: 'image/svg+xml',
    size: options.svg.length,
    createdAt: nowIso(),
  };
  sprite.costumes = [costume];
  sprite.currentCostumeId = costume.id;
  sprite.x = options.x;
  sprite.y = options.y;
  sprite.size = options.size;
  sprite.visible = options.visible;
  sprite.blocksXml = options.blocksXml;
  return sprite;
}

function greenFlag(inner: string): string {
  return `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="event_when_green_flag" x="24" y="24"><next>${inner}</next></block>
  </xml>`;
}

function sayBlock(message: string, seconds: number, next: string): string {
  return `<block type="looks_say_seconds">
    <field name="MESSAGE">${escapeXml(message)}</field>
    <field name="SECONDS">${seconds}</field>
    ${next ? `<next>${next}</next>` : ''}
  </block>`;
}

function cardSvg(color: string, kicker: string, title: string, art: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect x="8" y="8" width="184" height="184" rx="28" fill="#FFFFFF" stroke="${color}" stroke-width="8"/>
    <text x="100" y="36" text-anchor="middle" font-family="Nunito, sans-serif" font-size="14" font-weight="800" fill="${color}">${escapeXml(kicker)}</text>
    ${art}
    <text x="100" y="176" text-anchor="middle" font-family="Nunito, sans-serif" font-size="13" font-weight="800" fill="#0F172A">${escapeXml(clip(title, 22))}</text>
  </svg>`;
}

function scene(subject: SubjectId): string {
  switch (subject) {
    case 'maths':
      return `<circle cx="70" cy="90" r="16" fill="#F59E0B"/><circle cx="100" cy="90" r="16" fill="#F59E0B"/><circle cx="130" cy="90" r="16" fill="#FBBF24"/>
        <text x="100" y="132" text-anchor="middle" font-family="Nunito, sans-serif" font-size="22" font-weight="800" fill="#92400E">+ = ?</text>`;
    case 'physics':
      return `<circle cx="78" cy="100" r="22" fill="#2563EB"/>
        <path d="M108 100 H150" stroke="#1D4ED8" stroke-width="8" stroke-linecap="round"/>
        <path d="M138 86 L158 100 L138 114" fill="none" stroke="#1D4ED8" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'chemistry':
      return `<path d="M78 70 H122 L112 130 H88 Z" fill="#EDE9FE" stroke="#7C3AED" stroke-width="6"/>
        <circle cx="94" cy="112" r="6" fill="#7C3AED"/><circle cx="108" cy="104" r="5" fill="#A78BFA"/>
        <path d="M86 58 H114" stroke="#7C3AED" stroke-width="6" stroke-linecap="round"/>`;
    case 'biology':
      return `<path d="M100 130 C70 100 70 70 100 52 C130 70 130 100 100 130 Z" fill="#86EFAC" stroke="#166534" stroke-width="6"/>
        <path d="M100 58 V124" stroke="#166534" stroke-width="4"/>`;
    case 'english':
      return `<text x="100" y="108" text-anchor="middle" font-family="Nunito, sans-serif" font-size="36" font-weight="800" fill="#DB2777">ABC</text>`;
    case 'earth':
      return `<circle cx="78" cy="96" r="22" fill="#FDE68A" stroke="#D97706" stroke-width="4"/>
        <circle cx="128" cy="100" r="26" fill="#7DD3FC" stroke="#0369A1" stroke-width="5"/>
        <path d="M112 100 H144" stroke="#0369A1" stroke-width="3"/>`;
    case 'logic':
      return `<rect x="48" y="78" width="28" height="28" rx="8" fill="#FDBA74"/><rect x="86" y="78" width="28" height="28" rx="8" fill="#FB923C"/><rect x="124" y="78" width="28" height="28" rx="8" fill="#EA580C"/>
        <text x="62" y="98" font-family="Nunito, sans-serif" font-size="16" font-weight="800" fill="#7C2D12">1</text>
        <text x="100" y="98" font-family="Nunito, sans-serif" font-size="16" font-weight="800" fill="#7C2D12">2</text>
        <text x="138" y="98" font-family="Nunito, sans-serif" font-size="16" font-weight="800" fill="#FFFFFF">3</text>`;
    default:
      return '';
  }
}

function checkScene(): string {
  return `<circle cx="100" cy="96" r="28" fill="#DCFCE7" stroke="#16A34A" stroke-width="6"/>
    <path d="M84 96 L96 108 L118 82" fill="none" stroke="#166534" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function clip(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
