import { SidePanel } from '@jupyterlab/ui-components';
import { CommandRegistry } from '@lumino/commands';
import { Message } from '@lumino/messaging';
import { BoxPanel } from '@lumino/widgets';

import { HTabPanel } from '../common/tabPanel';
import { IGlueSessionTracker } from '../token';
import { IControlPanelModel } from '../types';
import { ConfigPanel } from './config/configPanel';
import { DataPanel } from './data/dataPanel';
import { ControlPanelHeader } from './header';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';

export class ControlPanelWidget extends SidePanel {
  constructor(options: LeftPanelWidget.IOptions) {
    const content = new BoxPanel();
    super({ content });
    this.addClass('gluelab-sidepanel-widget');
    const { model, rendermime, commands } = options;
    this._model = model;
    const header = new ControlPanelHeader();
    this.header.addWidget(header);

    this._tabPanel = new HTabPanel({
      tabBarPosition: 'top',
      tabBarClassList: ['lm-DockPanel-tabBar', 'glue-Panel-tabBar']
    });
    const data = new DataPanel({
      model: this._model,
      commands
    });
    const canvas = new ConfigPanel({ model, rendermime });

    this._tabPanel.addTab(data, 0);
    this._tabPanel.addTab(canvas, 1);
    this._tabPanel.activateTab(0);
    this.addWidget(this._tabPanel);
    BoxPanel.setStretch(this._tabPanel, 1);

    this._model.glueSessionChanged.connect(async (_, changed) => {
      if (changed) {
        header.title.label = changed.context.localPath;
      } else {
        header.title.label = '-';
      }
    });
  }

  protected onActivateRequest(msg: Message): void {
    this._tabPanel.activate();
    this._tabPanel.show();
  }
  dispose(): void {
    super.dispose();
  }

  private _model: IControlPanelModel;
  private _tabPanel: HTabPanel;
}

export namespace LeftPanelWidget {
  export interface IOptions {
    model: IControlPanelModel;
    tracker: IGlueSessionTracker;
    commands: CommandRegistry;
    rendermime: IRenderMimeRegistry;
  }
}
