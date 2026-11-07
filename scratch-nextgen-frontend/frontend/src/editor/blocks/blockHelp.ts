const blockHelp: Record<string, string> = {
  event_when_green_flag: 'This starts your project when you press the green Play button.',
  event_when_sprite_clicked: 'This starts when you click this character on the stage.',
  event_when_key_pressed: 'This starts when you press a key on the keyboard.',
  motion_move_steps: 'Move steps walks your character forward.',
  motion_turn_degrees: 'Turn spins your character.',
  motion_goto_xy: 'Go to x y jumps to a spot on the stage. 0, 0 is the middle.',
  motion_change_x: 'Change x slides your character left or right.',
  motion_change_y: 'Change y slides your character up or down.',
  motion_set_x: 'Set x parks your character on a left-right spot.',
  motion_set_y: 'Set y parks your character on an up-down spot.',
  motion_point_direction: 'Point in direction chooses which way your character faces.',
  motion_if_edge_bounce: 'If on edge, bounce keeps your character on the stage.',
  looks_say_seconds: 'Say shows a speech bubble for a little while.',
  looks_think_seconds: 'Think shows a thought bubble for a little while.',
  looks_show: 'Show makes a hidden character appear again.',
  looks_hide: 'Hide makes the character invisible.',
  looks_change_size: 'Change size makes your character a little bigger or smaller.',
  looks_set_size: 'Set size chooses an exact size.',
  control_wait: 'Wait pauses before the next block.',
  control_repeat: 'Repeat plays the blocks inside again and again. Great for dances.',
  control_forever: 'Forever keeps going until you press Stop.',
  sound_play: 'Play sound starts a sound you added to this character.',
  sound_stop_all: 'Stop all sounds quiets everything right away.',
};

export function explainBlock(blockType?: string): string {
  if (!blockType) {
    return 'Tap a block to learn what it does. Yellow starts, blue moves, purple talks, orange repeats.';
  }

  return blockHelp[blockType] ?? 'Try this block and press Play to see what it does.';
}
