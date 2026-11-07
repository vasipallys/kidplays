import type { Sprite } from '../types/sprite';
import { createStarterSprite } from '../templates/starterSprites';
import type { Lesson, SubjectId } from './catalog';
import { demoWaitSeconds } from './pictures';

const mascots: Record<SubjectId, { name: string; color: string; hint: string }> = {
  maths: { name: 'Numi', color: '#D97706', hint: 'Count what you see, then check the answer card.' },
  physics: { name: 'Bolt', color: '#1D4ED8', hint: 'Watch how far the move goes. More distance means faster.' },
  chemistry: { name: 'Bea', color: '#6D28D9', hint: 'The stuff can change look. The answer card names it.' },
  biology: { name: 'Leaf', color: '#15803D', hint: 'Living things grow and need care. Tap me if you forget.' },
  english: { name: 'Inky', color: '#BE185D', hint: 'Listen for the naming word or the action word.' },
  earth: { name: 'Terra', color: '#0E7490', hint: 'Look at the sun and the Earth, then read the caption.' },
  logic: { name: 'Step', color: '#C2410C', hint: 'Blocks run from top to bottom. Order changes the result.' },
};

export function lessonCast(lesson: Lesson): Sprite[] {
  const mascot = mascots[lesson.subject];
  const answerAt = 4 + demoWaitSeconds(lesson);
  return [friend(lesson, answerAt), helper(lesson, mascot, answerAt)];
}

function friend(lesson: Lesson, answerAt: number): Sprite {
  const sprite = createStarterSprite('Pip', '#F472B6');
  sprite.x = -78;
  sprite.y = -62;
  sprite.size = 78;
  sprite.blocksXml = xml(
    greenFlag(
      wait(
        3,
        say('Show me on the stage!', 2, wait(Math.max(0.4, answerAt - 5), say('Now I get it. Click me if you want that again.', 3, ''))),
      ),
    ),
    clicked(say(`The question was: ${clip(lesson.ask, 80)}`, 3, hop())),
  );
  return sprite;
}

function helper(
  lesson: Lesson,
  mascot: { name: string; color: string; hint: string },
  answerAt: number,
): Sprite {
  const sprite = createStarterSprite(mascot.name, mascot.color);
  sprite.x = 78;
  sprite.y = -62;
  sprite.size = 78;
  sprite.blocksXml = xml(
    greenFlag(wait(answerAt, say(clip(lesson.answer, 90), 4, say(lesson.tryNext, 3, '')))),
    clicked(say(`${mascot.hint} ${clip(lesson.title, 40)}`, 3, hop())),
  );
  return sprite;
}

function hop(): string {
  return `<block type="motion_change_y"><field name="DY">22</field>
    <next><block type="control_wait"><field name="SECONDS">0.2</field>
      <next><block type="motion_change_y"><field name="DY">-22</field></block></next>
    </block></next>
  </block>`;
}

function xml(flagScript: string, clickScript: string): string {
  return `<xml xmlns="https://developers.google.com/blockly/xml">${flagScript}${clickScript}</xml>`;
}

function greenFlag(inner: string): string {
  return `<block type="event_when_green_flag" x="24" y="24"><next>${inner}</next></block>`;
}

function clicked(inner: string): string {
  return `<block type="event_when_sprite_clicked" x="24" y="220"><next>${inner}</next></block>`;
}

function say(message: string, seconds: number, next: string): string {
  return `<block type="looks_say_seconds">
    <field name="MESSAGE">${escapeXml(message)}</field>
    <field name="SECONDS">${seconds}</field>
    ${next ? `<next>${next}</next>` : ''}
  </block>`;
}

function wait(seconds: number, next: string): string {
  return `<block type="control_wait"><field name="SECONDS">${seconds}</field>${next ? `<next>${next}</next>` : ''}</block>`;
}

function clip(value: string, max: number): string {
  const clean = value.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
