export const starterSuggestions = [
  'Start with a yellow Events block that says when green flag clicked.',
  'Snap a blue Move block underneath so your character walks.',
  'Add a purple Say block to make your character talk.',
  'Put Move inside Repeat to make a dance.',
];

export const categoryNextSteps: Record<string, string> = {
  event: 'Nice start! Snap a blue Motion or purple Looks block under this one.',
  motion: 'Try wrapping this in an orange Repeat block to make an animation.',
  looks: 'Add Wait after a Say block so people have time to read it.',
  control: 'Drop Motion or Looks blocks inside this loop.',
  sound: 'Add Wait after a sound so the next block does not rush.',
};
