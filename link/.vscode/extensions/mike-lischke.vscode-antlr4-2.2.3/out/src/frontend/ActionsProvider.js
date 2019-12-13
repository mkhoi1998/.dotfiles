"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode_1 = require("vscode");
const AntlrTreeDataProvider_1 = require("./AntlrTreeDataProvider");
const Utils_1 = require("./Utils");
class ActionsProvider extends AntlrTreeDataProvider_1.AntlrTreeDataProvider {
    constructor() {
        super(...arguments);
        this.actions = [];
        this.predicates = [];
    }
    update(editor) {
        let position = editor.selection.active;
        let action = Utils_1.Utils.findInListFromPosition(this.actions, position.character, position.line + 1);
        if (action) {
            this.actionTree.reveal(action, { select: true });
            return;
        }
        let predicate = Utils_1.Utils.findInListFromPosition(this.predicates, position.character, position.line + 1);
        if (predicate) {
            this.actionTree.reveal(predicate, { select: true });
            return;
        }
    }
    getParent(element) {
        if (element == this.actionsTreeItem || element == this.predicatesTreeItem) {
            return null;
        }
        if (this.actions.find(action => action == element)) {
            return this.actionsTreeItem;
        }
        return this.predicatesTreeItem;
    }
    getChildren(element) {
        if (!element) {
            let list = [];
            this.actionsTreeItem = new RootEntry("(Named) Actions", "0");
            list.push(this.actionsTreeItem);
            this.predicatesTreeItem = new RootEntry("Semantic Predicates", "1");
            list.push(this.predicatesTreeItem);
            return new Promise(resolve => {
                resolve(list);
            });
        }
        let actions = [];
        let returnPredicates = element.id == "1";
        if (this.currentFile) {
            actions = this.backend.listActions(this.currentFile);
            actions = actions.filter(action => action.isPredicate == returnPredicates);
        }
        let list = [];
        let index = 0;
        for (let action of actions) {
            let caption = index++ + ": ";
            let content = action.description.substr(1, action.description.length - 2);
            if (content.includes("\n")) {
                caption += "<multi line block>";
            }
            else {
                caption += content;
            }
            let item;
            if (returnPredicates) {
                item = new PredicateEntry(caption.trim(), action.definition.range, {
                    title: "",
                    command: "antlr.selectGrammarRange",
                    arguments: [action.definition.range]
                });
            }
            else {
                item = new ActionEntry(caption.trim(), action.definition.range, {
                    title: "",
                    command: "antlr.selectGrammarRange",
                    arguments: [action.definition.range]
                });
            }
            list.push(item);
        }
        if (returnPredicates) {
            this.predicates = list;
        }
        else {
            this.actions = list;
        }
        return new Promise(resolve => {
            resolve(list);
        });
    }
}
exports.ActionsProvider = ActionsProvider;
class RootEntry extends vscode_1.TreeItem {
    constructor(label, id) {
        super(label, vscode_1.TreeItemCollapsibleState.Expanded);
        this.contextValue = 'actions';
        this.id = id;
    }
}
exports.RootEntry = RootEntry;
class ActionEntry extends vscode_1.TreeItem {
    constructor(label, range, command_) {
        super(label, vscode_1.TreeItemCollapsibleState.None);
        this.range = range;
        this.contextValue = 'action';
        this.command = command_;
        this.iconPath = {
            light: path.join(__dirname, '..', '..', '..', 'misc', 'action-light.svg'),
            dark: path.join(__dirname, '..', '..', '..', 'misc', 'action-dark.svg')
        };
    }
}
exports.ActionEntry = ActionEntry;
class PredicateEntry extends vscode_1.TreeItem {
    constructor(label, range, command_) {
        super(label, vscode_1.TreeItemCollapsibleState.None);
        this.range = range;
        this.contextValue = 'predicate';
        this.command = command_;
        this.iconPath = {
            light: path.join(__dirname, '..', '..', '..', 'misc', 'predicate-light.svg'),
            dark: path.join(__dirname, '..', '..', '..', 'misc', 'predicate-dark.svg')
        };
    }
}
exports.PredicateEntry = PredicateEntry;
//# sourceMappingURL=ActionsProvider.js.map