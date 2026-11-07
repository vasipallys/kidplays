import { useEffect, useRef } from 'react';
import * as Blockly from 'blockly';
import { registerScratchBlocks } from './blockDefinitions';
import { defaultBlocksXml, scratchToolbox } from './toolbox';

type BlocklyWorkspaceProps = {
  spriteId: string;
  blocksXml?: string;
  showToolbox?: boolean;
  onChange: (xml: string) => void;
  onSelectBlock?: (blockType?: string) => void;
};

export function BlocklyWorkspace({
  spriteId,
  blocksXml,
  showToolbox = true,
  onChange,
  onSelectBlock,
}: BlocklyWorkspaceProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const timeoutRef = useRef<number>();
  const hasPendingChangeRef = useRef(false);
  const showToolboxRef = useRef(showToolbox);
  showToolboxRef.current = showToolbox;

  useEffect(() => {
    registerScratchBlocks();

    if (!hostRef.current) {
      return undefined;
    }

    const workspace = Blockly.inject(hostRef.current, {
      toolbox: scratchToolbox as Blockly.utils.toolbox.ToolboxDefinition,
      trashcan: true,
      scrollbars: true,
      zoom: {
        controls: true,
        wheel: true,
        startScale: 0.88,
        maxScale: 1.5,
        minScale: 0.55,
        scaleSpeed: 1.08,
      },
      move: {
        scrollbars: true,
        drag: true,
        wheel: true,
      },
      renderer: 'zelos',
      grid: {
        spacing: 24,
        length: 2,
        colour: '#DDE7F3',
        snap: true,
      },
    });

    const xmlToLoad = blocksXml?.trim() || defaultBlocksXml;
    try {
      const dom = Blockly.utils.xml.textToDom(xmlToLoad);
      Blockly.Xml.domToWorkspace(dom, workspace);
    } catch (error) {
      console.warn('Unable to load blocks XML, using starter blocks.', error);
      const dom = Blockly.utils.xml.textToDom(defaultBlocksXml);
      Blockly.Xml.domToWorkspace(dom, workspace);
    }

    const saveWorkspace = () => {
      hasPendingChangeRef.current = false;
      const dom = Blockly.Xml.workspaceToDom(workspace);
      onChange(Blockly.Xml.domToText(dom));
    };

    const listener = (event: Blockly.Events.Abstract) => {
      if (event.isUiEvent) {
        const selectedType = (Blockly.Events as any).SELECTED;
        if ((event as any).type === selectedType) {
          const blockId = (event as any).newElementId as string | undefined;
          onSelectBlock?.(blockId ? workspace.getBlockById(blockId)?.type : undefined);
        }
        return;
      }

      window.clearTimeout(timeoutRef.current);
      hasPendingChangeRef.current = true;
      timeoutRef.current = window.setTimeout(saveWorkspace, 300);
    };

    workspace.addChangeListener(listener);
    workspaceRef.current = workspace;
    applyToolboxVisibility(hostRef.current, workspace, showToolboxRef.current);
    const resizeObserver = new ResizeObserver(() => Blockly.svgResize(workspace));
    resizeObserver.observe(hostRef.current);

    return () => {
      window.clearTimeout(timeoutRef.current);
      if (hasPendingChangeRef.current) {
        saveWorkspace();
      }
      resizeObserver.disconnect();
      workspace.removeChangeListener(listener);
      workspace.dispose();
      workspaceRef.current = null;
    };
  }, [spriteId]);

  useEffect(() => {
    const host = hostRef.current;
    const workspace = workspaceRef.current;
    if (!host || !workspace) {
      return;
    }
    applyToolboxVisibility(host, workspace, showToolbox);
  }, [showToolbox]);

  return (
    <div
      ref={hostRef}
      className={`h-full min-h-[440px] w-full overflow-hidden rounded-2xl sm:min-h-[560px] xl:min-h-0 ${showToolbox ? '' : 'hide-block-menu'}`}
      aria-label="Block coding workspace"
    />
  );
}

function applyToolboxVisibility(host: HTMLElement, workspace: Blockly.WorkspaceSvg, visible: boolean) {
  host.classList.toggle('hide-block-menu', !visible);
  if (!visible) {
    workspace.getToolbox()?.getFlyout()?.setVisible(false);
  }
  Blockly.svgResize(workspace);
}
