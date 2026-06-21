const blockHelp: Record<string, string> = {
  event_when_green_flag: 'This block starts your story or game when you click the green flag.',
  event_when_sprite_clicked: 'This starts a script when you click the sprite on the stage.',
  event_when_key_pressed: 'This starts a script when a key is pressed.',
  motion_move_steps: 'Move steps changes where your sprite is standing.',
  motion_turn_degrees: 'Turn degrees spins your sprite.',
  motion_goto_xy: 'Go to x y teleports your sprite to a spot on the stage.',
  motion_change_x: 'Change x moves your sprite sideways.',
  motion_change_y: 'Change y moves your sprite up or down.',
  motion_set_x: 'Set x places your sprite at a horizontal position.',
  motion_set_y: 'Set y places your sprite at a vertical position.',
  motion_point_direction: 'Point in direction chooses which way your sprite faces.',
  motion_if_edge_bounce: 'This helps your sprite bounce when it touches the edge.',
  looks_say_seconds: 'Say shows a speech bubble for a little while.',
  looks_think_seconds: 'Think shows a thought bubble for a little while.',
  looks_show: 'Show makes an invisible sprite appear again.',
  looks_hide: 'Hide makes the sprite invisible.',
  looks_change_size: 'Change size makes your sprite a little bigger or smaller.',
  looks_set_size: 'Set size chooses an exact size for your sprite.',
  control_wait: 'Wait lets your sprite pause before doing the next block.',
  control_repeat: 'Repeat runs the blocks inside again and again.',
  control_forever: 'Forever keeps running until you click stop.',
  sound_play: 'Play sound starts a local sound from this sprite.',
  sound_stop_all: 'Stop all sounds immediately quiets every playing sound.',
};

export function explainBlock(blockType?: string): string {
  if (!blockType) {
    return 'Click a block to learn what it does.';
  }

  return blockHelp[blockType] ?? 'This block is ready for experimenting.';
}
