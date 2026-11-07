export const gradeBands = [
  { id: '1-2', label: 'Class 1–2', hint: 'ages 6–7' },
  { id: '3-5', label: 'Class 3–5', hint: 'ages 8–10' },
  { id: '6-8', label: 'Class 6–8', hint: 'ages 11–13' },
  { id: '9-10', label: 'Class 9–10', hint: 'ages 14–15' },
  { id: '11-12', label: 'Class 11–12', hint: 'ages 16–18' },
] as const;

export const subjects = [
  { id: 'maths', label: 'Maths', blurb: 'Count, share, equations, and change.' },
  { id: 'physics', label: 'Physics', blurb: 'Push, speed, force, and motion.' },
  { id: 'chemistry', label: 'Chemistry', blurb: 'States, atoms, reactions, and moles.' },
  { id: 'biology', label: 'Biology', blurb: 'Living things, cells, and energy.' },
  { id: 'english', label: 'English', blurb: 'Words, sentences, and clear claims.' },
  { id: 'earth', label: 'Earth', blurb: 'Day, water, seasons, and climate.' },
  { id: 'logic', label: 'Logic', blurb: 'Order, repeat, choices, and steps.' },
] as const;

export type BandId = (typeof gradeBands)[number]['id'];
export type SubjectId = (typeof subjects)[number]['id'];
export type LessonDemo = 'count' | 'bounce' | 'slide' | 'grow';

export type Lesson = {
  id: string;
  subject: SubjectId;
  band: BandId;
  title: string;
  ask: string;
  answer: string;
  tryNext: string;
  demo: LessonDemo;
  demoTimes: number;
  color: string;
};

const palette: Record<SubjectId, string> = {
  maths: '#F59E0B',
  physics: '#2563EB',
  chemistry: '#7C3AED',
  biology: '#16A34A',
  english: '#DB2777',
  earth: '#0891B2',
  logic: '#EA580C',
};

function lesson(
  subject: SubjectId,
  band: BandId,
  title: string,
  ask: string,
  answer: string,
  tryNext: string,
  demo: LessonDemo,
  demoTimes = 3,
): Lesson {
  return {
    id: `${subject}-${band}`,
    subject,
    band,
    title,
    ask,
    answer,
    tryNext,
    demo,
    demoTimes,
    color: palette[subject],
  };
}

export const lessons: Lesson[] = [
  lesson('maths', '1-2', 'Count to three', 'How many hops is 2 plus 1?', '2 plus 1 is 3. I hopped 3 times.', 'Change the repeat number and press Play again.', 'count', 3),
  lesson('maths', '3-5', 'Share equally', '24 sweets shared by 6 friends. How many each?', '24 divided by 6 is 4. Each friend gets 4.', 'Try 18 shared by 3. What should the repeat be?', 'count', 4),
  lesson('maths', '6-8', 'Solve 3x + 6 = 15', 'What number makes 3x + 6 equal 15?', 'Subtract 6 to get 3x = 9. Then x = 3.', 'Change 15 to 21. The new x is 5.', 'count', 3),
  lesson('maths', '9-10', 'Factor a quadratic', 'Which numbers make x squared minus 5x plus 6 equal zero?', 'It factors as (x-2)(x-3). The roots are 2 and 3.', 'Check: 2 times 2 is 4, minus 10, plus 6, is 0.', 'count', 2),
  lesson('maths', '11-12', 'Slope of x squared', 'How fast does y = x squared change at x = 3?', 'The derivative is 2x. At x = 3 the slope is 6.', 'At x = 4 the slope is 8. Try saying that.', 'slide', 6),

  lesson('physics', '1-2', 'A push moves things', 'What happens when you push a ball?', 'A push starts motion. No push, it stays still.', 'Make the slide longer by raising the step count.', 'slide', 4),
  lesson('physics', '3-5', 'Faster means more steps', 'Which trip is faster: 2 steps or 6 steps in the same wait?', 'More distance in the same time means a higher speed.', 'Change 6 to 10 and watch the sprite go farther.', 'slide', 6),
  lesson('physics', '6-8', 'Speed is distance over time', 'A racer covers 100 metres in 20 seconds. What is the speed?', 'Speed = 100 / 20 = 5 metres each second.', 'If time becomes 10 seconds, speed becomes 10.', 'bounce', 5),
  lesson('physics', '9-10', 'v = u + at', 'Start from rest. Acceleration is 2. Time is 4 seconds. Find v.', 'v = 0 + 2 times 4. The speed is 8.', 'Units stay metres and seconds. Do not mix them.', 'slide', 4),
  lesson('physics', '11-12', 'Force equals mass times acceleration', 'Mass is 2 kilograms. Acceleration is 3. What is the force?', 'F = ma = 2 times 3 = 6 newtons.', 'Double the mass and the force doubles too.', 'bounce', 3),

  lesson('chemistry', '1-2', 'Three faces of water', 'Ice, water, and steam. Are they different stuff?', 'Same water. Cold makes ice. Heat makes steam.', 'Name one more solid, liquid, and gas at home.', 'grow', 3),
  lesson('chemistry', '3-5', 'Water is H2O', 'What is one particle of water made of?', 'Two hydrogen atoms and one oxygen atom. That is H2O.', 'Salt can dissolve in water. The water is still H2O.', 'grow', 3),
  lesson('chemistry', '6-8', 'A water reaction', 'What do hydrogen and oxygen make when they react?', '2 H2 + O2 makes 2 H2O. Atoms are rearranged, not lost.', 'Count atoms on both sides. They must match.', 'bounce', 2),
  lesson('chemistry', '9-10', 'Acid plus base', 'What do hydrochloric acid and sodium hydroxide make?', 'HCl + NaOH makes NaCl and water. Salt plus water.', 'This is a neutralisation. The salt is table-salt formula.', 'slide', 2),
  lesson('chemistry', '11-12', 'One mole', 'How many particles are in one mole of water?', 'About 6.022 times 10 to the 23. One mole of water is 18 grams.', '18 grams comes from 16 for oxygen plus 1 plus 1.', 'count', 6),

  lesson('biology', '1-2', 'What a plant needs', 'What does a plant need to stay alive?', 'Sunlight, water, and air. A rock does not grow.', 'Name one living thing and one non-living thing.', 'grow', 3),
  lesson('biology', '3-5', 'Plant parts', 'Which part drinks water, and which part makes food?', 'Roots drink. Leaves make food in the light.', 'The stem carries water up to the leaves.', 'slide', 3),
  lesson('biology', '6-8', 'A cell', 'What controls a cell, and what holds it in?', 'The nucleus controls. The membrane holds the cell.', 'Plants also have a cell wall outside the membrane.', 'grow', 2),
  lesson('biology', '9-10', 'Genes', 'What molecule carries instructions to build you?', 'DNA carries genes. A copy is passed to each new cell.', 'Mitosis makes two cells with the same DNA.', 'bounce', 2),
  lesson('biology', '11-12', 'Photosynthesis', 'What do plants make from carbon dioxide and water?', '6 CO2 + 6 H2O, with light, makes sugar and oxygen.', 'The sugar is C6H12O6. Oxygen is the 6 O2.', 'grow', 6),

  lesson('english', '1-2', 'Naming words', 'Which words name a thing: cat, run, sun?', 'Cat and sun are nouns. Run is an action.', 'Add one more naming word to the say block.', 'count', 2),
  lesson('english', '3-5', 'Action words', 'In “The cat runs”, which word is the verb?', 'Runs is the verb. It tells what the cat does.', 'Swap runs for sleeps. The noun stays cat.', 'slide', 2),
  lesson('english', '6-8', 'Match the verb', 'Which is correct: “She run” or “She runs”?', 'She runs. One person takes the s. They run.', 'Try “He walks” and “They walk”.', 'count', 2),
  lesson('english', '9-10', 'Passive voice', 'Turn “The dog chased the ball” into passive.', 'The ball was chased by the dog.', 'The object becomes the subject. The meaning stays.', 'bounce', 2),
  lesson('english', '11-12', 'A claim sentence', 'What belongs in a strong opening sentence?', 'A claim, the word because, and one piece of evidence.', 'Evidence is a fact, not only “I think”.', 'slide', 3),

  lesson('earth', '1-2', 'Day and night', 'Why is it dark at night?', 'Earth turns. Your side faces away from the Sun.', 'The Sun does not go out. We rotate.', 'bounce', 2),
  lesson('earth', '3-5', 'Water cycle', 'Where does rain come from?', 'Water evaporates, makes clouds, then falls as rain.', 'The same water can travel again and again.', 'slide', 3),
  lesson('earth', '6-8', 'Why seasons happen', 'Is summer hotter because Earth is closer to the Sun?', 'No. The tilt changes how directly sunlight hits you.', 'Distance changes a little. Tilt is the main reason.', 'grow', 4),
  lesson('earth', '9-10', 'Earthquakes', 'Why does the ground sometimes shake?', 'Plates of crust move. A sudden slip is a quake.', 'Most quakes happen near plate edges.', 'bounce', 3),
  lesson('earth', '11-12', 'Greenhouse effect', 'How does extra carbon dioxide warm the air?', 'CO2 lets sunlight in and slows heat leaving.', 'That is different from the ozone layer, which blocks UV.', 'slide', 4),

  lesson('logic', '1-2', 'Do it in order', 'What happens if you say hello before you move?', 'The steps run from top to bottom. Order matters.', 'Swap two blocks and press Play. Watch what changes.', 'slide', 2),
  lesson('logic', '3-5', 'Repeat a square', 'How many right turns make a square?', 'Four turns of 90 degrees. A square has four corners.', 'A triangle needs three turns, not four.', 'count', 4),
  lesson('logic', '6-8', 'A choice', 'When should a character move up?', 'Only when the Up key is pressed. That is a condition.', 'Add a Down key so the character can return.', 'bounce', 2),
  lesson('logic', '9-10', 'Remember a score', 'A score starts at 0. You add 1 three times. What is it?', '0 + 1 + 1 + 1 = 3. A variable remembers the total.', 'Start at 10 and add 1. The new total is 11.', 'count', 3),
  lesson('logic', '11-12', 'Input, process, output', 'What are the three parts of a tiny algorithm?', 'Input goes in. A process changes it. Output comes out.', '24 and 6 are inputs. Divide is the process. 4 is the output.', 'count', 4),
];

export function lessonsFor(subject: SubjectId | 'all', band: BandId): Lesson[] {
  return lessons.filter((item) => item.band === band && (subject === 'all' || item.subject === subject));
}

export function lessonById(id: string): Lesson | undefined {
  return lessons.find((item) => item.id === id);
}

export function subjectLabel(id: SubjectId): string {
  return subjects.find((item) => item.id === id)?.label ?? id;
}

export function bandLabel(id: BandId): string {
  return gradeBands.find((item) => item.id === id)?.label ?? id;
}
