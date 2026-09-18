import "./gateway-runtime-IrTdjV5_.js";
import fs from "node:fs/promises";
import { n as callGatewayFromCli, t as addGatewayClientOptions } from "./gateway-rpc-DpocbsVi.js";
import { r as validateWorkspaceDoc } from "./schema-Dl6Ohw9o.js";
//#region extensions/workspaces/src/cli.ts
function writeJson(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}
function writeLine(value) {
  process.stdout.write(`${value}\n`);
}
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function parseJson(value, label) {
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error(`invalid ${label} JSON: ${error.message}`, { cause: error });
  }
}
function parseOptionalBoolean(value) {
  const normalized = value.trim().toLowerCase();
  if (["true", "1", "yes", "on"].includes(normalized)) return true;
  if (["false", "0", "no", "off"].includes(normalized)) return false;
  throw new Error(`invalid boolean: ${value}`);
}
function parseWorkspaceGrid(value) {
  const parts = value.split(",").map((entry) => Number(entry.trim()));
  if (parts.length !== 4 || parts.some((entry) => !Number.isInteger(entry)))
    throw new Error("grid must be x,y,w,h");
  const [x, y, w, h] = parts;
  return {
    x,
    y,
    w,
    h,
  };
}
function parseWorkspaceBindingShorthand(value) {
  const eqIndex = value.indexOf("=");
  if (eqIndex <= 0)
    throw new Error("binding must be id=file:<path>, id=rpc:<method>, or id=static:<json>");
  const id = value.slice(0, eqIndex).trim();
  const body = value.slice(eqIndex + 1).trim();
  if (!/^[A-Za-z0-9._-]{1,64}$/.test(id)) throw new Error("binding id is invalid");
  if (body.startsWith("file:")) {
    const fileSpec = body.slice(5);
    const hashIndex = fileSpec.indexOf("#");
    const bindingPath = hashIndex >= 0 ? fileSpec.slice(0, hashIndex) : fileSpec;
    const pointer = hashIndex >= 0 ? fileSpec.slice(hashIndex + 1) : void 0;
    if (!bindingPath) throw new Error("file binding path is required");
    return [
      id,
      {
        source: "file",
        path: bindingPath,
        ...(pointer !== void 0 ? { pointer } : {}),
      },
    ];
  }
  if (body.startsWith("rpc:")) {
    const method = body.slice(4).trim();
    if (!method) throw new Error("rpc binding method is required");
    return [
      id,
      {
        source: "rpc",
        method,
      },
    ];
  }
  if (body.startsWith("static:"))
    return [
      id,
      {
        source: "static",
        value: parseJson(body.slice(7), "static"),
      },
    ];
  throw new Error("binding source must be file, rpc, or static");
}
function collectBinding(value, previous = []) {
  return [...previous, value];
}
function parseBindings(values) {
  if (!values?.length) return;
  return Object.fromEntries(values.map(parseWorkspaceBindingShorthand));
}
async function callWorkspaceGateway(method, options, params) {
  return await callGatewayFromCli(method, options, params, {
    mode: "cli",
    scopes: [
      ...(method === "workspaces.widget.approve"
        ? ["operator.approvals"]
        : ["operator.write", "operator.read"]),
    ],
  });
}
function readWorkspaceResult(value) {
  if (!isRecord(value)) throw new Error("workspace gateway response must be an object");
  const doc = validateWorkspaceDoc(value.doc);
  return {
    doc,
    workspaceVersion:
      typeof value.workspaceVersion === "number" ? value.workspaceVersion : doc.workspaceVersion,
  };
}
async function readWorkspace(options) {
  return readWorkspaceResult(await callWorkspaceGateway("workspaces.get", options)).doc;
}
function orderedTabs(doc) {
  const bySlug = new Map(doc.tabs.map((tab) => [tab.slug, tab]));
  const ordered = doc.prefs.tabOrder.flatMap((slug) => {
    const tab = bySlug.get(slug);
    return tab ? [tab] : [];
  });
  const seen = new Set(ordered.map((tab) => tab.slug));
  return [...ordered, ...doc.tabs.filter((tab) => !seen.has(tab.slug))];
}
function formatTabLine(tab) {
  const hidden = tab.hidden ? "hidden" : "visible";
  return `${tab.slug.padEnd(18)} ${hidden.padEnd(8)} ${tab.title}`;
}
function formatWidgetLine(tab, widget) {
  const grid = `${widget.grid.x},${widget.grid.y},${widget.grid.w},${widget.grid.h}`;
  const state = [widget.hidden ? "hidden" : "visible", widget.collapsed ? "collapsed" : ""]
    .filter(Boolean)
    .join(",");
  return `${tab.padEnd(14)} ${widget.id.padEnd(18)} ${widget.kind.padEnd(20)} ${grid.padEnd(9)} ${state.padEnd(10)} ${widget.title ?? ""}`;
}
function writeTabs(doc, options) {
  const tabs = orderedTabs(doc);
  if (options.json) {
    writeJson({ tabs });
    return;
  }
  for (const tab of tabs) writeLine(formatTabLine(tab));
}
function widgetRows(doc, tabSlug) {
  const tabs = tabSlug ? doc.tabs.filter((tab) => tab.slug === tabSlug) : orderedTabs(doc);
  if (tabSlug && tabs.length === 0) throw new Error(`workspace tab not found: ${tabSlug}`);
  return tabs.flatMap((tab) =>
    tab.widgets.map((widget) => ({
      tab: tab.slug,
      widget,
    })),
  );
}
function writeWidgets(doc, options) {
  const widgets = widgetRows(doc, options.tab);
  if (options.json) {
    writeJson({
      widgets: widgets.map(({ tab, widget }) => ({
        tab,
        ...widget,
      })),
    });
    return;
  }
  for (const { tab, widget } of widgets) writeLine(formatWidgetLine(tab, widget));
}
function requirePatch(patch) {
  if (Object.keys(patch).length === 0) throw new Error("at least one patch option is required");
}
function addGatewayOptions(command) {
  return addGatewayClientOptions(command);
}
function registerWorkspaceCli(options) {
  const workspace = options.program
    .command("workspaces")
    .description("Manage Workspaces tabs and widgets");
  const tabs = workspace.command("tabs").description("Manage workspace tabs");
  const widgets = workspace.command("widgets").description("Manage workspace widgets");
  const layout = workspace.command("layout").description("Manage workspace layout documents");
  addGatewayOptions(
    tabs.command("list").description("List workspace tabs").option("--json", "Print JSON", false),
  ).action(async (commandOptions) => {
    writeTabs(await readWorkspace(commandOptions), commandOptions);
  });
  addGatewayOptions(
    tabs
      .command("create")
      .description("Create a workspace tab")
      .requiredOption("--title <title>", "Tab title")
      .option("--slug <slug>", "Tab slug")
      .option("--icon <icon>", "Icon name"),
  ).action(async (commandOptions) => {
    writeTabs(
      readWorkspaceResult(
        await callWorkspaceGateway("workspaces.tab.create", commandOptions, {
          title: commandOptions.title,
          ...(commandOptions.slug ? { slug: commandOptions.slug } : {}),
          ...(commandOptions.icon ? { icon: commandOptions.icon } : {}),
        }),
      ).doc,
      commandOptions,
    );
  });
  addGatewayOptions(
    tabs.command("delete").argument("<slug>", "Tab slug").description("Delete a workspace tab"),
  ).action(async (slug, commandOptions) => {
    writeTabs(
      readWorkspaceResult(
        await callWorkspaceGateway("workspaces.tab.delete", commandOptions, { slug }),
      ).doc,
      commandOptions,
    );
  });
  addGatewayOptions(
    tabs
      .command("reorder")
      .argument("<slug...>", "Tab slugs")
      .description("Set workspace tab order"),
  ).action(async (order, commandOptions) => {
    writeTabs(
      readWorkspaceResult(
        await callWorkspaceGateway("workspaces.tab.reorder", commandOptions, { order }),
      ).doc,
      commandOptions,
    );
  });
  for (const [verb, hidden] of [
    ["hide", true],
    ["show", false],
  ])
    addGatewayOptions(
      tabs.command(verb).argument("<slug>", "Tab slug").description(`${verb} a workspace tab`),
    ).action(async (slug, commandOptions) => {
      writeTabs(
        readWorkspaceResult(
          await callWorkspaceGateway("workspaces.tab.update", commandOptions, {
            slug,
            patch: { hidden },
          }),
        ).doc,
        commandOptions,
      );
    });
  addGatewayOptions(
    widgets
      .command("list")
      .description("List workspace widgets")
      .option("--tab <slug>", "Tab slug")
      .option("--json", "Print JSON", false),
  ).action(async (commandOptions) => {
    writeWidgets(await readWorkspace(commandOptions), commandOptions);
  });
  addGatewayOptions(
    widgets
      .command("add")
      .description("Add a workspace widget")
      .requiredOption("--tab <slug>", "Tab slug")
      .requiredOption("--kind <kind>", "Widget kind")
      .option("--id <id>", "Widget id")
      .option("--title <title>", "Widget title")
      .option("--grid <x,y,w,h>", "Widget grid", "0,0,4,2")
      .option("--binding <id=source>", "Binding shorthand", collectBinding, [])
      .option("--props <json>", "Widget props JSON"),
  ).action(async (commandOptions) => {
    const bindings = parseBindings(commandOptions.binding);
    writeWidgets(
      readWorkspaceResult(
        await callWorkspaceGateway("workspaces.widget.add", commandOptions, {
          tab: commandOptions.tab,
          widget: {
            ...(commandOptions.id ? { id: commandOptions.id } : {}),
            kind: commandOptions.kind,
            ...(commandOptions.title ? { title: commandOptions.title } : {}),
            grid: parseWorkspaceGrid(commandOptions.grid ?? "0,0,4,2"),
            ...(bindings ? { bindings } : {}),
            ...(commandOptions.props ? { props: parseJson(commandOptions.props, "props") } : {}),
          },
        }),
      ).doc,
      {
        ...commandOptions,
        tab: commandOptions.tab,
      },
    );
  });
  addGatewayOptions(
    widgets
      .command("update")
      .description("Update a workspace widget")
      .requiredOption("--tab <slug>", "Tab slug")
      .requiredOption("--id <id>", "Widget id")
      .option("--title <title>", "Widget title")
      .option("--collapsed <bool>", "Collapsed state", parseOptionalBoolean)
      .option("--hidden <bool>", "Hidden state", parseOptionalBoolean),
  ).action(async (commandOptions) => {
    const patch = {
      ...(commandOptions.title !== void 0 ? { title: commandOptions.title } : {}),
      ...(commandOptions.collapsed !== void 0 ? { collapsed: commandOptions.collapsed } : {}),
      ...(commandOptions.hidden !== void 0 ? { hidden: commandOptions.hidden } : {}),
    };
    requirePatch(patch);
    writeWidgets(
      readWorkspaceResult(
        await callWorkspaceGateway("workspaces.widget.update", commandOptions, {
          tab: commandOptions.tab,
          id: commandOptions.id,
          patch,
        }),
      ).doc,
      {
        ...commandOptions,
        tab: commandOptions.tab,
      },
    );
  });
  addGatewayOptions(
    widgets
      .command("move")
      .description("Move a workspace widget")
      .option("--tab <slug>", "Current tab slug")
      .requiredOption("--id <id>", "Widget id")
      .option("--grid <x,y,w,h>", "New grid")
      .option("--to-tab <slug>", "Destination tab slug"),
  ).action(async (commandOptions) => {
    writeWidgets(
      readWorkspaceResult(
        await callWorkspaceGateway("workspaces.widget.move", commandOptions, {
          ...(commandOptions.tab ? { tab: commandOptions.tab } : {}),
          id: commandOptions.id,
          ...(commandOptions.grid ? { grid: parseWorkspaceGrid(commandOptions.grid) } : {}),
          ...(commandOptions.toTab ? { toTab: commandOptions.toTab } : {}),
        }),
      ).doc,
      {
        ...commandOptions,
        tab: commandOptions.tab,
      },
    );
  });
  addGatewayOptions(
    widgets
      .command("remove")
      .description("Remove a workspace widget")
      .requiredOption("--tab <slug>", "Tab slug")
      .requiredOption("--id <id>", "Widget id"),
  ).action(async (commandOptions) => {
    writeWidgets(
      readWorkspaceResult(
        await callWorkspaceGateway("workspaces.widget.remove", commandOptions, {
          tab: commandOptions.tab,
          id: commandOptions.id,
        }),
      ).doc,
      {
        ...commandOptions,
        tab: commandOptions.tab,
      },
    );
  });
  addGatewayOptions(
    layout
      .command("get")
      .description("Read the Workspaces layout")
      .option("--json", "Print JSON", false),
  ).action(async (commandOptions) => {
    const doc = await readWorkspace(commandOptions);
    if (commandOptions.json)
      writeJson({
        doc,
        workspaceVersion: doc.workspaceVersion,
      });
    else {
      writeLine(`workspaceVersion ${doc.workspaceVersion}`);
      writeTabs(doc, commandOptions);
    }
  });
  addGatewayOptions(
    layout
      .command("set")
      .description("Replace the Workspaces layout")
      .requiredOption("--file <path>", "Workspace JSON file"),
  ).action(async (commandOptions) => {
    const next = readWorkspaceResult(
      await callWorkspaceGateway("workspaces.replace", commandOptions, {
        doc: validateWorkspaceDoc(JSON.parse(await fs.readFile(commandOptions.file, "utf8"))),
      }),
    );
    if (commandOptions.json) writeJson(next);
    else writeLine(`workspaceVersion ${next.workspaceVersion}`);
  });
  addGatewayOptions(
    layout.command("undo").description("Restore the newest workspace undo snapshot"),
  ).action(async (commandOptions) => {
    const next = readWorkspaceResult(
      await callWorkspaceGateway("workspaces.undo", commandOptions, {}),
    );
    if (commandOptions.json) writeJson(next);
    else writeLine(`workspaceVersion ${next.workspaceVersion}`);
  });
  addGatewayOptions(
    workspace
      .command("widget-scaffold")
      .argument("<name>", "Custom widget name")
      .description("Create a custom widget scaffold (starts pending approval)")
      .option("--title <title>", "Widget title"),
  ).action(async (name, commandOptions) => {
    const result = await callWorkspaceGateway("workspaces.widget.scaffold", commandOptions, {
      name,
      ...(commandOptions.title !== void 0 ? { title: commandOptions.title } : {}),
    });
    if (commandOptions.json) {
      writeJson(result);
      return;
    }
    writeLine(`created ${isRecord(result) && typeof result.dir === "string" ? result.dir : name}`);
    writeLine(`pending approval; run: openclaw workspaces widget-approve ${name}`);
  });
  addGatewayOptions(
    workspace
      .command("widget-approve")
      .argument("<name>", "Custom widget name")
      .description("Approve or reject a pending custom widget")
      .option("--reject", "Reject instead of approving"),
  ).action(async (name, commandOptions) => {
    const decision = commandOptions.reject ? "rejected" : "approved";
    const result = await callWorkspaceGateway("workspaces.widget.approve", commandOptions, {
      name,
      decision,
    });
    if (commandOptions.json) writeJson(result);
    else writeLine(`${name} ${decision}`);
  });
}
//#endregion
export { registerWorkspaceCli };
