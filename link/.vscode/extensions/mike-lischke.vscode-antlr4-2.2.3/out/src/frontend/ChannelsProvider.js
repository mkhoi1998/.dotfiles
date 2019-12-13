"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode_1 = require("vscode");
const AntlrTreeDataProvider_1 = require("./AntlrTreeDataProvider");
class ChannelsProvider extends AntlrTreeDataProvider_1.AntlrTreeDataProvider {
    getChildren(element) {
        if (!element) {
            var channels;
            if (this.currentFile) {
                channels = this.backend.getChannels(this.currentFile);
            }
            if (channels) {
                let list = [];
                for (let channel of channels) {
                    if (!channel || channel == "null") {
                        continue;
                    }
                    list.push(new ChannelEntry(channel, vscode_1.TreeItemCollapsibleState.None, {
                        title: "<unused>",
                        command: "",
                        arguments: []
                    }));
                }
                return new Promise(resolve => {
                    resolve(list);
                });
            }
        }
        return new Promise(resolve => {
            resolve([]);
        });
    }
}
exports.ChannelsProvider = ChannelsProvider;
class ChannelEntry extends vscode_1.TreeItem {
    constructor(label, collapsibleState, command_) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.iconPath = {
            light: path.join(__dirname, '..', '..', '..', 'misc', 'channel-light.svg'),
            dark: path.join(__dirname, '..', '..', '..', 'misc', 'channel-dark.svg')
        };
        this.contextValue = 'channels';
        this.command = command_;
    }
}
exports.ChannelEntry = ChannelEntry;
//# sourceMappingURL=ChannelsProvider.js.map