import type { Project } from '../types/project';
import type { Sprite } from '../types/sprite';
import { createId } from '../utils/ids';
import { nowIso } from '../utils/time';
import { createStarterSprite } from './starterSprites';

export const sampleProjectTemplates = [
  {
    id: 'dance-party',
    name: 'Dance Party',
    description: 'Two friends dance with loops, turns, and size changes.',
    level: 'Easy',
    skill: 'Loops',
    ages: '6+',
  },
  {
    id: 'space-chase',
    name: 'Space Chase',
    description: 'Fly a rocket with the arrow keys.',
    level: 'Challenge',
    skill: 'Keys',
    ages: '8+',
  },
  {
    id: 'tiny-story',
    name: 'Tiny Story',
    description: 'Two characters take turns talking.',
    level: 'Easy',
    skill: 'Stories',
    ages: '6+',
  },
  {
    id: 'bounce-lab',
    name: 'Bounce Lab',
    description: 'A forever loop keeps a ball bouncing.',
    level: 'Fun',
    skill: 'Bounce',
    ages: '7+',
  },
  {
    id: 'hide-and-seek',
    name: 'Hide and Seek',
    description: 'Click characters to reveal surprises.',
    level: 'Easy',
    skill: 'Clicks',
    ages: '6+',
  },
  {
    id: 'keyboard-quest',
    name: 'Keyboard Quest',
    description: 'Press Space, A, and B to cast actions.',
    level: 'Fun',
    skill: 'Keys',
    ages: '8+',
  },
] as const;

export type SampleProjectId = (typeof sampleProjectTemplates)[number]['id'];

export function createBlankProject(name = 'Untitled Adventure'): Project {
  return makeProject({
    name,
    description: 'A blank canvas for your next block-coded idea.',
    backdropName: 'Sky Playground',
    backdropColor: '#BAE6FD',
    sprites: [createStarterSprite()],
  });
}

export function createSampleProject(templateId: SampleProjectId): Project {
  switch (templateId) {
    case 'dance-party':
      return createDanceParty();
    case 'space-chase':
      return createSpaceChase();
    case 'tiny-story':
      return createTinyStory();
    case 'bounce-lab':
      return createBounceLab();
    case 'hide-and-seek':
      return createHideAndSeek();
    case 'keyboard-quest':
      return createKeyboardQuest();
  }
}

export function createSampleProjects(): Project[] {
  return sampleProjectTemplates.map((template) => createSampleProject(template.id));
}

function createDanceParty(): Project {
  const sunny = createStarterSprite('Sunny', '#F97316');
  sunny.x = -95;
  sunny.blocksXml = xml(`
    <block type="event_when_green_flag" x="32" y="32">
      <next><block type="looks_say_seconds">
        <field name="MESSAGE">Dance with me!</field><field name="SECONDS">1</field>
        <next><block type="control_repeat">
          <field name="TIMES">8</field>
          <statement name="DO"><block type="motion_turn_degrees">
            <field name="DEGREES">45</field>
            <next><block type="looks_change_size">
              <field name="AMOUNT">12</field>
              <next><block type="control_wait">
                <field name="SECONDS">0.12</field>
                <next><block type="looks_change_size"><field name="AMOUNT">-12</field></block></next>
              </block></next>
            </block></next>
          </block></statement>
        </block></next>
      </block></next>
    </block>`);

  const berry = createStarterSprite('Berry', '#EC4899');
  berry.x = 95;
  berry.direction = -90;
  berry.blocksXml = xml(`
    <block type="event_when_green_flag" x="32" y="32">
      <next><block type="control_wait"><field name="SECONDS">0.5</field>
        <next><block type="looks_say_seconds">
          <field name="MESSAGE">My turn!</field><field name="SECONDS">1</field>
          <next><block type="control_repeat"><field name="TIMES">8</field>
            <statement name="DO"><block type="motion_turn_degrees"><field name="DEGREES">-45</field>
              <next><block type="motion_change_y"><field name="DY">18</field>
                <next><block type="control_wait"><field name="SECONDS">0.12</field>
                  <next><block type="motion_change_y"><field name="DY">-18</field></block></next>
                </block></next>
              </block></next>
            </block></statement>
          </block></next>
        </block></next>
      </block></next>
    </block>`);

  return makeProject({
    name: 'Dance Party',
    description: 'Two friends use repeat loops to perform a dance together.',
    backdropName: 'Party Pink',
    backdropColor: '#FBCFE8',
    sprites: [sunny, berry],
  });
}

function createSpaceChase(): Project {
  const rocket = createStarterSprite('Rocket', '#2563EB');
  rocket.x = -130;
  rocket.blocksXml = xml(`
    <block type="event_when_green_flag" x="32" y="32">
      <next><block type="looks_say_seconds">
        <field name="MESSAGE">Use the arrow keys to fly!</field><field name="SECONDS">2</field>
      </block></next>
    </block>
    <block type="event_when_key_pressed" x="32" y="160"><field name="KEY">ArrowUp</field>
      <next><block type="motion_change_y"><field name="DY">24</field></block></next>
    </block>
    <block type="event_when_key_pressed" x="300" y="160"><field name="KEY">ArrowDown</field>
      <next><block type="motion_change_y"><field name="DY">-24</field></block></next>
    </block>
    <block type="event_when_key_pressed" x="32" y="270"><field name="KEY">ArrowLeft</field>
      <next><block type="motion_change_x"><field name="DX">-24</field></block></next>
    </block>
    <block type="event_when_key_pressed" x="300" y="270"><field name="KEY">ArrowRight</field>
      <next><block type="motion_change_x"><field name="DX">24</field></block></next>
    </block>`);

  const comet = createStarterSprite('Comet', '#8B5CF6');
  comet.x = 125;
  comet.y = 65;
  comet.size = 75;
  comet.blocksXml = xml(`
    <block type="event_when_green_flag" x="32" y="32">
      <next><block type="control_repeat"><field name="TIMES">12</field>
        <statement name="DO"><block type="motion_turn_degrees"><field name="DEGREES">30</field>
          <next><block type="control_wait"><field name="SECONDS">0.12</field></block></next>
        </block></statement>
        <next><block type="looks_say_seconds"><field name="MESSAGE">Catch me!</field><field name="SECONDS">1</field></block></next>
      </block></next>
    </block>`);

  return makeProject({
    name: 'Space Chase',
    description: 'Guide Rocket with arrow-key events while Comet spins through space.',
    backdropName: 'Deep Space',
    backdropColor: '#312E81',
    sprites: [rocket, comet],
  });
}

function createTinyStory(): Project {
  const luna = createStarterSprite('Luna', '#14B8A6');
  luna.x = -100;
  luna.blocksXml = xml(`
    <block type="event_when_green_flag" x="32" y="32">
      <next><block type="looks_say_seconds"><field name="MESSAGE">Hello, Nova!</field><field name="SECONDS">2</field>
        <next><block type="control_wait"><field name="SECONDS">2</field>
          <next><block type="looks_say_seconds"><field name="MESSAGE">Shall we find a new planet?</field><field name="SECONDS">2</field></block></next>
        </block></next>
      </block></next>
    </block>`);

  const nova = createStarterSprite('Nova', '#F59E0B');
  nova.x = 100;
  nova.blocksXml = xml(`
    <block type="event_when_green_flag" x="32" y="32">
      <next><block type="control_wait"><field name="SECONDS">2</field>
        <next><block type="looks_say_seconds"><field name="MESSAGE">Hi, Luna!</field><field name="SECONDS">2</field>
          <next><block type="control_wait"><field name="SECONDS">2</field>
            <next><block type="looks_think_seconds"><field name="MESSAGE">Adventure time!</field><field name="SECONDS">2</field></block></next>
          </block></next>
        </block></next>
      </block></next>
    </block>`);

  return makeProject({
    name: 'Tiny Story',
    description: 'Luna and Nova use waits to speak in order instead of at the same time.',
    backdropName: 'Sunset Story',
    backdropColor: '#FED7AA',
    sprites: [luna, nova],
  });
}

function createBounceLab(): Project {
  const ball = createStarterSprite('Bouncy', '#EF4444');
  ball.direction = 55;
  ball.size = 80;
  ball.blocksXml = xml(`
    <block type="event_when_green_flag" x="32" y="32">
      <next><block type="looks_say_seconds"><field name="MESSAGE">Stop me if you can!</field><field name="SECONDS">1</field>
        <next><block type="control_forever">
          <statement name="DO"><block type="motion_move_steps"><field name="STEPS">12</field>
            <next><block type="motion_if_edge_bounce">
              <next><block type="control_wait"><field name="SECONDS">0.03</field></block></next>
            </block></next>
          </block></statement>
        </block></next>
      </block></next>
    </block>`);

  return makeProject({
    name: 'Bounce Lab',
    description: 'Experiment with direction, speed, forever loops, and edge bouncing.',
    backdropName: 'Cool Lab',
    backdropColor: '#CFFAFE',
    sprites: [ball],
  });
}

function createHideAndSeek(): Project {
  const guide = createStarterSprite('Guide', '#F97316');
  guide.x = -130;
  guide.blocksXml = xml(`
    <block type="event_when_green_flag" x="32" y="32">
      <next><block type="looks_say_seconds"><field name="MESSAGE">Click every sprite to find a surprise!</field><field name="SECONDS">2</field></block></next>
    </block>`);

  const violet = clickableSurprise('Violet', '#8B5CF6', 20, 65, 'You found a star!');
  const mint = clickableSurprise('Mint', '#10B981', 125, -70, 'Great searching!');

  return makeProject({
    name: 'Hide and Seek',
    description: 'Each character has a sprite-click event with its own reaction.',
    backdropName: 'Secret Garden',
    backdropColor: '#BBF7D0',
    sprites: [guide, violet, mint],
  });
}

function createKeyboardQuest(): Project {
  const hero = createStarterSprite('Pixel Hero', '#0EA5E9');
  hero.blocksXml = xml(`
    <block type="event_when_green_flag" x="32" y="32">
      <next><block type="looks_say_seconds"><field name="MESSAGE">Press Space, A, or B!</field><field name="SECONDS">2</field></block></next>
    </block>
    <block type="event_when_key_pressed" x="32" y="160"><field name="KEY">Space</field>
      <next><block type="control_repeat"><field name="TIMES">4</field>
        <statement name="DO"><block type="motion_turn_degrees"><field name="DEGREES">90</field></block></statement>
      </block></next>
    </block>
    <block type="event_when_key_pressed" x="300" y="160"><field name="KEY">a</field>
      <next><block type="looks_change_size"><field name="AMOUNT">20</field>
        <next><block type="looks_say_seconds"><field name="MESSAGE">Power up!</field><field name="SECONDS">1</field></block></next>
      </block></next>
    </block>
    <block type="event_when_key_pressed" x="300" y="300"><field name="KEY">b</field>
      <next><block type="looks_set_size"><field name="SIZE">100</field>
        <next><block type="motion_goto_xy"><field name="X">0</field><field name="Y">0</field></block></next>
      </block></next>
    </block>`);

  return makeProject({
    name: 'Keyboard Quest',
    description: 'Three key events make the hero spin, power up, and return home.',
    backdropName: 'Quest Blue',
    backdropColor: '#BFDBFE',
    sprites: [hero],
  });
}

function clickableSurprise(name: string, color: string, x: number, y: number, message: string): Sprite {
  const sprite = createStarterSprite(name, color);
  sprite.x = x;
  sprite.y = y;
  sprite.size = 78;
  sprite.blocksXml = xml(`
    <block type="event_when_sprite_clicked" x="32" y="32">
      <next><block type="looks_say_seconds"><field name="MESSAGE">${message}</field><field name="SECONDS">1</field>
        <next><block type="looks_hide">
          <next><block type="control_wait"><field name="SECONDS">1</field>
            <next><block type="looks_show"></block></next>
          </block></next>
        </block></next>
      </block></next>
    </block>`);
  return sprite;
}

type ProjectOptions = {
  name: string;
  description: string;
  backdropName: string;
  backdropColor: string;
  sprites: Sprite[];
};

function makeProject(options: ProjectOptions): Project {
  const createdAt = nowIso();
  const backdropId = createId('backdrop');

  return {
    id: createId('project'),
    name: options.name,
    description: options.description,
    createdAt,
    updatedAt: createdAt,
    sprites: options.sprites,
    backdrops: [{ id: backdropId, name: options.backdropName, color: options.backdropColor }],
    activeSpriteId: options.sprites[0]?.id ?? '',
    stageState: { width: 480, height: 360, backdropId },
    globalVariables: {},
    version: 1,
  };
}

function xml(blocks: string): string {
  return `<xml xmlns="https://developers.google.com/blockly/xml">${blocks}</xml>`;
}
