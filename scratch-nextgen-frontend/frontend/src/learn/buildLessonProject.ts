import type { Project } from '../types/project';
import { createStarterSprite } from '../templates/starterSprites';
import { createId } from '../utils/ids';
import { nowIso } from '../utils/time';
import { bandLabel, lessonById, subjectLabel, type Lesson } from './catalog';
import { lessonCast } from './cast';
import { answerPicture, demoWaitSeconds, questionPicture } from './pictures';

export function createLessonProject(lessonId: string): Project {
  const lesson = lessonById(lessonId);
  if (!lesson) {
    throw new Error('That practice lab is not in the catalogue.');
  }

  const coach = createStarterSprite('Coach', lesson.color);
  coach.x = 0;
  coach.y = -62;
  coach.size = 84;
  coach.blocksXml = lessonScript(lesson);
  const look = questionPicture(lesson);
  const answer = answerPicture(lesson, 4 + demoWaitSeconds(lesson));
  const createdAt = nowIso();
  const backdropId = createId('backdrop');

  return {
    id: createId('project'),
    name: `${subjectLabel(lesson.subject)}: ${lesson.title}`,
    description: lesson.ask,
    learn: {
      subject: subjectLabel(lesson.subject),
      subjectId: lesson.subject,
      band: bandLabel(lesson.band),
      bandId: lesson.band,
      practice: lesson.tryNext,
    },
    createdAt,
    updatedAt: createdAt,
    sprites: [look, ...lessonCast(lesson), coach, answer],
    backdrops: [{ id: backdropId, name: `${subjectLabel(lesson.subject)} lab`, color: '#E0F2FE' }],
    activeSpriteId: coach.id,
    stageState: { width: 480, height: 360, backdropId },
    globalVariables: {},
    version: 1,
  };
}

function lessonScript(lesson: Lesson): string {
  const script = say(
    lesson.ask,
    3,
    say('Watch us. Then click a friend.', 2, demo(lesson, say(lesson.answer, 4, say('Click Pip or a friend to hear it again.', 3, '')))),
  );

  return `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="event_when_green_flag" x="28" y="28">
      <next>${script}</next>
    </block>
    <block type="event_when_sprite_clicked" x="28" y="240">
      <next>${say(lesson.ask, 3, '')}</next>
    </block>
  </xml>`;
}

function say(message: string, seconds: number, next: string): string {
  return `<block type="looks_say_seconds">
    <field name="MESSAGE">${escapeXml(message)}</field>
    <field name="SECONDS">${seconds}</field>
    ${nextTag(next)}
  </block>`;
}

function demo(lesson: Lesson, next: string): string {
  if (lesson.demo === 'bounce') {
    return `<block type="control_repeat"><field name="TIMES">${lesson.demoTimes}</field>
      <statement name="DO"><block type="motion_change_y"><field name="DY">36</field>
        <next><block type="control_wait"><field name="SECONDS">0.2</field>
          <next><block type="motion_change_y"><field name="DY">-36</field></block></next>
        </block></next>
      </block></statement>
      ${nextTag(next)}
    </block>`;
  }

  if (lesson.demo === 'grow') {
    return `<block type="control_repeat"><field name="TIMES">${lesson.demoTimes}</field>
      <statement name="DO"><block type="looks_change_size"><field name="AMOUNT">12</field>
        <next><block type="control_wait"><field name="SECONDS">0.2</field>
          <next><block type="looks_change_size"><field name="AMOUNT">-12</field></block></next>
        </block></next>
      </block></statement>
      ${nextTag(next)}
    </block>`;
  }

  if (lesson.demo === 'slide') {
    return `<block type="motion_change_x"><field name="DX">${lesson.demoTimes * 18}</field>
      <next><block type="control_wait"><field name="SECONDS">0.4</field>
        <next><block type="motion_change_x"><field name="DX">${-lesson.demoTimes * 18}</field>
          ${nextTag(next)}
        </block></next>
      </block></next>
    </block>`;
  }

  return `<block type="control_repeat"><field name="TIMES">${lesson.demoTimes}</field>
    <statement name="DO"><block type="motion_move_steps"><field name="STEPS">18</field>
      <next><block type="control_wait"><field name="SECONDS">0.15</field>
        <next><block type="motion_move_steps"><field name="STEPS">-18</field></block></next>
      </block></next>
    </block></statement>
    ${nextTag(next)}
  </block>`;
}

function nextTag(next: string): string {
  return next ? `<next>${next}</next>` : '';
}

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
