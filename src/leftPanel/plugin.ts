import { ControlPanelModel } from './model';
import { ControlPanelWidget } from './widget';
import { glueIcon } from '../tools';
import {
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { IGlueSessionTracker } from '../token';
import { CommandIDs, INewViewerArgs } from '../commands';
import { UUID } from '@lumino/coreutils';
import { CommandRegistry } from '@lumino/commands';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';

const NAME_SPACE = 'gluelab';

function addCommands(
  commands: CommandRegistry,
  controlModel: ControlPanelModel
): void {
  commands.addCommand(CommandIDs.new1DHistogram, {
    label: '1D Histogram',
    iconClass: 'fa fa-chart-bar',
    execute: (args?: INewViewerArgs) => {
      if (!controlModel.sharedModel) {
        return;
      }

      const tabs = Object.keys(controlModel.sharedModel.tabs);
      const focusedTab = controlModel.sharedModel.getSelectedTab() || 1;
      const layer = args?.dataset || controlModel.selectedDataset;

      if (focusedTab === 0) {
        return;
      }

      controlModel.sharedModel.setTabItem(tabs[focusedTab - 1], UUID.uuid4(), {
        _type: 'glue.viewers.histogram.qt.data_viewer.HistogramViewer',
        pos: args?.position || [0, 0],
        session: 'Session',
        size: args?.size || [600, 400],
        state: {
          values: {
            layer
          }
        }
      });
    }
  });

  commands.addCommand(CommandIDs.new2DScatter, {
    label: '2D Scatter',
    iconClass: 'fa fa-circle',
    execute: (args?: INewViewerArgs) => {
      if (!controlModel.sharedModel) {
        return;
      }

      const tabs = Object.keys(controlModel.sharedModel.tabs);
      const focusedTab = controlModel.sharedModel.getSelectedTab() || 1;
      const layer = args?.dataset || controlModel.selectedDataset;

      if (focusedTab === 0) {
        return;
      }

      controlModel.sharedModel.setTabItem(tabs[focusedTab - 1], UUID.uuid4(), {
        _type: 'glue.viewers.scatter.qt.data_viewer.ScatterViewer',
        pos: args?.position || [0, 0],
        session: 'Session',
        size: args?.size || [600, 400],
        state: {
          values: {
            layer
          }
        }
      });
    }
  });

  commands.addCommand(CommandIDs.new2DImage, {
    label: '2D Image',
    iconClass: 'fa fa-image',
    execute: (args?: INewViewerArgs) => {
      if (!controlModel.sharedModel) {
        return;
      }

      const tabs = Object.keys(controlModel.sharedModel.tabs);
      const focusedTab = controlModel.sharedModel.getSelectedTab() || 1;
      const layer = args?.dataset || controlModel.selectedDataset;

      if (focusedTab === 0) {
        return;
      }

      controlModel.sharedModel.setTabItem(tabs[focusedTab - 1], UUID.uuid4(), {
        _type: 'glue.viewers.image.qt.data_viewer.ImageViewer',
        pos: args?.position || [0, 0],
        session: 'Session',
        size: args?.size || [600, 400],
        state: {
          values: {
            layer
          }
        }
      });
    }
  });

  commands.addCommand(CommandIDs.newTable, {
    label: 'Table',
    iconClass: 'fa fa-table',
    execute: (args?: INewViewerArgs) => {
      if (!controlModel.sharedModel) {
        return;
      }

      const tabs = Object.keys(controlModel.sharedModel.tabs);
      const focusedTab = controlModel.sharedModel.getSelectedTab() || 1;
      const layer = args?.dataset || controlModel.selectedDataset;

      if (focusedTab === 0) {
        return;
      }

      controlModel.sharedModel.setTabItem(tabs[focusedTab - 1], UUID.uuid4(), {
        _type: 'glue.viewers.table.qt.data_viewer.TableViewer',
        pos: args?.position || [0, 0],
        session: 'Session',
        size: args?.size || [600, 400],
        state: {
          values: {
            layer
          }
        }
      });
    }
  });

  commands.addCommand(CommandIDs.openControlPanel, {
    execute: (args?: { cellId?: string }) => {
      if (!controlModel.sharedModel) {
        return;
      }

      const tabs = Object.keys(controlModel.sharedModel.tabs);
      const focusedTab = controlModel.sharedModel.getSelectedTab() || 1;

      if (focusedTab === 0 || !tabs[focusedTab - 1]) {
        return;
      }
      controlModel.displayConfig({
        tabId: tabs[focusedTab - 1],
        cellId: args?.cellId
      });
    }
  });
}

export const controlPanel: JupyterFrontEndPlugin<void> = {
  id: 'gluepyter:control-panel',
  autoStart: true,
  requires: [ILayoutRestorer, IGlueSessionTracker, IRenderMimeRegistry],
  activate: (
    app: JupyterFrontEnd,
    restorer: ILayoutRestorer,
    tracker: IGlueSessionTracker,
    rendermime: IRenderMimeRegistry
  ) => {
    const { shell, commands } = app;

    const controlModel = new ControlPanelModel({ tracker });

    const controlPanel = new ControlPanelWidget({
      model: controlModel,
      tracker,
      commands,
      rendermime
    });

    controlPanel.id = 'glueLab::controlPanel';
    controlPanel.title.caption = 'GlueLab';
    controlPanel.title.icon = glueIcon;

    if (restorer) {
      restorer.add(controlPanel, NAME_SPACE);
    }

    shell.add(controlPanel, 'left', { rank: 2000 });

    addCommands(commands, controlModel);
  }
};
