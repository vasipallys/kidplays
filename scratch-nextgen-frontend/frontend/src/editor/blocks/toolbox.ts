export const defaultBlocksXml = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="event_when_green_flag" x="32" y="32">
    <next>
      <block type="motion_move_steps">
        <field name="STEPS">80</field>
        <next>
          <block type="looks_say_seconds">
            <field name="MESSAGE">Hello!</field>
            <field name="SECONDS">2</field>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>
`;

export const scratchToolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: '⚑ Events',
      colour: '#F59E0B',
      contents: [
        { kind: 'block', type: 'event_when_green_flag' },
        { kind: 'block', type: 'event_when_sprite_clicked' },
        { kind: 'block', type: 'event_when_key_pressed' },
      ],
    },
    {
      kind: 'category',
      name: 'Motion',
      colour: '#2563EB',
      contents: [
        { kind: 'block', type: 'motion_move_steps' },
        { kind: 'block', type: 'motion_turn_degrees' },
        { kind: 'block', type: 'motion_goto_xy' },
        { kind: 'block', type: 'motion_change_x' },
        { kind: 'block', type: 'motion_change_y' },
        { kind: 'block', type: 'motion_set_x' },
        { kind: 'block', type: 'motion_set_y' },
        { kind: 'block', type: 'motion_point_direction' },
        { kind: 'block', type: 'motion_if_edge_bounce' },
      ],
    },
    {
      kind: 'category',
      name: 'Looks',
      colour: '#7C3AED',
      contents: [
        { kind: 'block', type: 'looks_say_seconds' },
        { kind: 'block', type: 'looks_think_seconds' },
        { kind: 'block', type: 'looks_show' },
        { kind: 'block', type: 'looks_hide' },
        { kind: 'block', type: 'looks_change_size' },
        { kind: 'block', type: 'looks_set_size' },
      ],
    },
    {
      kind: 'category',
      name: 'Sound',
      colour: '#DB2777',
      contents: [
        { kind: 'block', type: 'sound_play' },
        { kind: 'block', type: 'sound_stop_all' },
      ],
    },
    {
      kind: 'category',
      name: 'Loops',
      colour: '#EA580C',
      contents: [
        { kind: 'block', type: 'control_wait' },
        { kind: 'block', type: 'control_repeat' },
        { kind: 'block', type: 'control_forever' },
      ],
    },
    {
      kind: 'category',
      name: 'Sensing',
      colour: '#0891B2',
      contents: [{ kind: 'label', text: 'Click a character or press a key to start a script.' }],
    },
    {
      kind: 'category',
      name: 'Variables',
      colour: '#F97316',
      custom: 'VARIABLE',
    },
    {
      kind: 'category',
      name: 'Ideas',
      colour: '#64748B',
      contents: [{ kind: 'label', text: 'Try mixing Event + Motion + Repeat for a dance.' }],
    },
  ],
};

export const paletteCategories = [
  { name: 'Events', color: 'bg-amber-400', hint: 'Start with the green flag, a click, or a key.' },
  { name: 'Motion', color: 'bg-blue-500', hint: 'Move, turn, and bounce your characters.' },
  { name: 'Looks', color: 'bg-violet-500', hint: 'Talk, think, hide, show, and grow.' },
  { name: 'Sound', color: 'bg-pink-500', hint: 'Play sounds you added from this computer.' },
  { name: 'Loops', color: 'bg-orange-500', hint: 'Wait, repeat, and keep going forever.' },
  { name: 'Variables', color: 'bg-amber-600', hint: 'Remember numbers, words, and yes/no values.' },
];
