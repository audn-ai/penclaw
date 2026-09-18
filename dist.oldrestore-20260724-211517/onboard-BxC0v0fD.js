import {
  i as getAccessTokenResult,
  n as azLoginDeviceCodeWithOptions,
  o as getLoggedInAccount,
  r as execAz,
  t as azLoginDeviceCode,
} from "./cli-tnciAn7X.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-Da47iiZE.js";
import { g as readResponseTextLimited } from "./provider-http-errors-DLMRBkZU.js";
import "./error-runtime-BIAwr399.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./text-utility-runtime-CJESZCN5.js";
import {
  C as requiresFoundryMaxCompletionTokens,
  S as requiresFoundryMandatoryAdaptiveClaudeThinking,
  a as FOUNDRY_ANTHROPIC_SCOPE,
  d as buildFoundryProviderBaseUrl,
  f as extractFoundryEndpoint,
  i as DEFAULT_GPT5_API,
  j as usesFoundryResponsesByDefault,
  r as DEFAULT_API,
  t as ANTHROPIC_MESSAGES_API,
  x as requiresFoundryEntraIdClaudeAuth,
} from "./shared-Cky42rCK.js";
import "./ssrf-runtime-DJ478vv8.js";
import "./provider-http-BDIltggC.js";
import {
  c as normalizeOptionalString,
  f as normalizeStringifiedOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region extensions/microsoft-foundry/onboard.ts
const FOUNDRY_CONNECTION_TEST_ERROR_BODY_LIMIT_BYTES = 8 * 1024;
function listFoundryResources(subscriptionId) {
  try {
    const accounts = JSON.parse(
      execAz([
        "cognitiveservices",
        "account",
        "list",
        ...(subscriptionId ? ["--subscription", subscriptionId] : []),
        "--query",
        "[].{id:id,name:name,kind:kind,location:location,resourceGroup:resourceGroup,endpoint:properties.endpoint,customSubdomain:properties.customSubDomainName,projects:properties.associatedProjects}",
        "--output",
        "json",
      ]),
    );
    const resources = [];
    for (const account of accounts) {
      if (!account.resourceGroup) continue;
      if (account.kind === "OpenAI") {
        const endpoint = extractFoundryEndpoint(account.endpoint);
        if (!endpoint) continue;
        resources.push({
          id: account.id,
          accountName: account.name,
          kind: "OpenAI",
          location: account.location,
          resourceGroup: account.resourceGroup,
          endpoint,
          projects: [],
        });
        continue;
      }
      if (account.kind !== "AIServices") continue;
      const customSubdomain = normalizeOptionalString(account.customSubdomain);
      const endpoint = customSubdomain
        ? `https://${customSubdomain}.services.ai.azure.com`
        : void 0;
      if (!endpoint) continue;
      resources.push({
        id: account.id,
        accountName: account.name,
        kind: "AIServices",
        location: account.location,
        resourceGroup: account.resourceGroup,
        endpoint,
        projects: Array.isArray(account.projects)
          ? account.projects.filter((project) => typeof project === "string")
          : [],
      });
    }
    return resources;
  } catch {
    return [];
  }
}
function listResourceDeployments(resource, subscriptionId) {
  try {
    return JSON.parse(
      execAz([
        "cognitiveservices",
        "account",
        "deployment",
        "list",
        ...(subscriptionId ? ["--subscription", subscriptionId] : []),
        "-g",
        resource.resourceGroup,
        "-n",
        resource.accountName,
        "--query",
        "[].{name:name,modelName:properties.model.name,modelVersion:properties.model.version,state:properties.provisioningState,sku:sku.name}",
        "--output",
        "json",
      ]),
    ).filter((deployment) => deployment.state === "Succeeded");
  } catch {
    return [];
  }
}
function buildCreateFoundryHint(selectedSub) {
  return [
    `No Azure AI Foundry or Azure OpenAI resources were found in subscription ${selectedSub.name} (${selectedSub.id}).`,
    "Create one in Azure AI Foundry or Azure Portal, then rerun onboard.",
    "Azure AI Foundry: https://ai.azure.com",
    "Azure OpenAI docs: https://learn.microsoft.com/azure/ai-foundry/openai/how-to/create-resource",
  ].join("\n");
}
async function selectFoundryResource(ctx, selectedSub) {
  const resources = listFoundryResources(selectedSub.id);
  if (resources.length === 0) throw new Error(buildCreateFoundryHint(selectedSub));
  if (resources.length === 1) {
    const only = expectDefined(resources[0], "single Microsoft Foundry resource");
    await ctx.prompter.note(
      `Using ${only.kind === "AIServices" ? "Azure AI Foundry" : "Azure OpenAI"} resource: ${only.accountName}`,
      "Foundry Resource",
    );
    return only;
  }
  const selectedResourceId = await ctx.prompter.select({
    message: "Select Azure AI Foundry / Azure OpenAI resource",
    options: resources.map((resource) => ({
      value: resource.id,
      label: `${resource.accountName} (${resource.kind === "AIServices" ? "Azure AI Foundry" : "Azure OpenAI"}${resource.location ? `, ${resource.location}` : ""})`,
      hint: [
        `RG: ${resource.resourceGroup}`,
        resource.projects.length > 0 ? `${resource.projects.length} project(s)` : void 0,
      ]
        .filter(Boolean)
        .join(" | "),
    })),
  });
  return (
    resources.find((resource) => resource.id === selectedResourceId) ??
    expectDefined(resources[0], "fallback Microsoft Foundry resource")
  );
}
async function selectFoundryDeployment(ctx, resource, deployments) {
  const supported = deployments;
  if (supported.length === 0)
    throw new Error(
      [
        `No model deployments were found in ${resource.accountName}.`,
        "Deploy a model in Microsoft Foundry or Azure OpenAI, then rerun onboard.",
      ].join("\n"),
    );
  if (supported.length === 1) {
    const only = expectDefined(supported[0], "single Microsoft Foundry deployment");
    await ctx.prompter.note(`Using deployment: ${only.name}`, "Model Deployment");
    return {
      selected: only,
      supported,
    };
  }
  const selectedDeploymentName = await ctx.prompter.select({
    message: "Select model deployment",
    options: supported.map((deployment) => ({
      value: deployment.name,
      label: deployment.name,
      hint: [deployment.modelName, deployment.modelVersion, deployment.sku]
        .filter(Boolean)
        .join(" | "),
    })),
  });
  return {
    selected:
      supported.find((deployment) => deployment.name === selectedDeploymentName) ??
      expectDefined(supported[0], "fallback Microsoft Foundry deployment"),
    supported,
  };
}
async function promptFoundryApi(ctx, initialApi) {
  return await ctx.prompter.select({
    message: "Select request API",
    options: [
      {
        value: ANTHROPIC_MESSAGES_API,
        label: "Anthropic Messages API",
        hint: "Use for Claude deployments through Microsoft Foundry /anthropic",
      },
      {
        value: DEFAULT_GPT5_API,
        label: "Responses API",
        hint: "Recommended for Azure OpenAI GPT, o-series, and Codex deployments",
      },
      {
        value: "openai-completions",
        label: "Chat Completions API",
        hint: "Use for Foundry models that only expose chat/completions semantics",
      },
    ],
    initialValue: initialApi,
  });
}
async function promptFoundryModelFamily(ctx, initialValue) {
  return await ctx.prompter.select({
    message: "Model family",
    options: [
      {
        value: "claude",
        label: "Claude",
        hint: "Use for Anthropic Claude deployments",
      },
      {
        value: "reasoning-family",
        label: "GPT-5 series / o-series / Codex",
        hint: "Use for Azure OpenAI reasoning and Codex deployments",
      },
      {
        value: "mai-image",
        label: "MAI image model",
        hint: "Use for Microsoft MAI image deployments",
      },
      {
        value: "other-chat",
        label: "Other chat model",
        hint: "Use for other chat/completions style Foundry models",
      },
    ],
    initialValue,
  });
}
async function promptFoundryMaiImageModel(ctx) {
  return await ctx.prompter.select({
    message: "MAI image base model",
    options: [
      {
        value: "MAI-Image-2.5-Flash",
        label: "MAI-Image-2.5-Flash",
        hint: "Latest fast MAI image deployment",
      },
      {
        value: "MAI-Image-2.5",
        label: "MAI-Image-2.5",
        hint: "Latest MAI image deployment",
      },
      {
        value: "MAI-Image-2e",
        label: "MAI-Image-2e",
        hint: "Efficient MAI image deployment",
      },
      {
        value: "MAI-Image-2",
        label: "MAI-Image-2",
        hint: "MAI image deployment",
      },
    ],
    initialValue: "MAI-Image-2.5-Flash",
  });
}
async function promptFoundryClaudeModel(ctx, options) {
  return (
    await ctx.prompter.text({
      message: "Claude base model",
      initialValue: "claude-fable-5",
      placeholder: "claude-fable-5",
      validate: (v) => {
        const val = normalizeStringifiedOptionalString(v) ?? "";
        if (!val) return "Claude base model is required";
        if (!val.toLowerCase().startsWith("claude-"))
          return "Use a Claude model name such as claude-fable-5";
        if (options?.allowEntraOnlyModels === false && requiresFoundryEntraIdClaudeAuth(val))
          return "Claude Mythos deployments require Microsoft Entra ID auth; choose Entra ID auth or use a Claude model that supports API-key auth.";
      },
    })
  ).trim();
}
async function promptEndpointAndModelBase(ctx, options) {
  const endpoint = (
    await ctx.prompter.text({
      message: "Microsoft Foundry endpoint URL",
      placeholder: "https://xxx.services.ai.azure.com or https://xxx.openai.azure.com",
      ...(options?.endpointInitialValue ? { initialValue: options.endpointInitialValue } : {}),
      validate: (v) => {
        const val = normalizeStringifiedOptionalString(v) ?? "";
        if (!val) return "Endpoint URL is required";
        return URL.canParse(val) ? void 0 : "Invalid URL";
      },
    })
  ).trim();
  const modelId = (
    await ctx.prompter.text({
      message: "Default model/deployment name",
      ...(options?.modelInitialValue ? { initialValue: options.modelInitialValue } : {}),
      placeholder: "claude-fable-5",
      validate: (v) => {
        if (!(normalizeStringifiedOptionalString(v) ?? "")) return "Model ID is required";
      },
    })
  ).trim();
  const familyChoice = await promptFoundryModelFamily(
    ctx,
    options?.modelFamilyInitialValue ?? "claude",
  );
  if (familyChoice === "mai-image")
    return {
      endpoint,
      modelId,
      modelNameHint: await promptFoundryMaiImageModel(ctx),
      api: DEFAULT_API,
    };
  if (familyChoice === "claude")
    return {
      endpoint,
      modelId,
      modelNameHint: await promptFoundryClaudeModel(ctx, {
        allowEntraOnlyModels: options?.allowEntraOnlyClaudeModels ?? true,
      }),
      api: ANTHROPIC_MESSAGES_API,
    };
  const resolvedModelName =
    familyChoice === "reasoning-family"
      ? usesFoundryResponsesByDefault(modelId) || requiresFoundryMaxCompletionTokens(modelId)
        ? modelId
        : "gpt-5"
      : void 0;
  const api = await promptFoundryApi(
    ctx,
    familyChoice === "reasoning-family" ? DEFAULT_GPT5_API : DEFAULT_API,
  );
  return {
    endpoint,
    modelId,
    ...(resolvedModelName ? { modelNameHint: resolvedModelName } : {}),
    api,
  };
}
async function promptEndpointAndModelManually(ctx) {
  return promptEndpointAndModelBase(ctx);
}
async function promptApiKeyEndpointAndModel(ctx) {
  return promptEndpointAndModelBase(ctx, {
    endpointInitialValue: process.env.AZURE_OPENAI_ENDPOINT,
    modelInitialValue: "gpt-4o",
    modelFamilyInitialValue: "other-chat",
    allowEntraOnlyClaudeModels: false,
  });
}
function buildFoundryConnectionTest(params) {
  const baseUrl = buildFoundryProviderBaseUrl(
    params.endpoint,
    params.modelId,
    params.modelNameHint,
    params.api,
  );
  if (params.api === "openai-responses")
    return {
      url: `${baseUrl}/responses`,
      body: {
        model: params.modelId,
        input: "hi",
        max_output_tokens: 16,
      },
    };
  if (params.api === "anthropic-messages")
    return {
      url: `${baseUrl}/v1/messages`,
      body: {
        model: params.modelId,
        messages: [
          {
            role: "user",
            content: "hi",
          },
        ],
        max_tokens: 1,
        ...(requiresFoundryMandatoryAdaptiveClaudeThinking(params.modelNameHint ?? params.modelId)
          ? { thinking: { type: "adaptive" } }
          : {}),
      },
    };
  return {
    url: `${baseUrl}/chat/completions`,
    body: {
      model: params.modelId,
      messages: [
        {
          role: "user",
          content: "hi",
        },
      ],
      max_tokens: 1,
    },
  };
}
function extractTenantSuggestions(rawMessage) {
  const suggestions = [];
  const seen = /* @__PURE__ */ new Set();
  for (const match of rawMessage.matchAll(/([0-9a-fA-F-]{36})(?:\s+'([^'\r\n]+)')?/g)) {
    const id = normalizeOptionalString(match[1]);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    suggestions.push({
      id,
      ...(normalizeOptionalString(match[2]) ? { label: normalizeOptionalString(match[2]) } : {}),
    });
  }
  return suggestions;
}
function isValidTenantIdentifier(value) {
  const trimmed = normalizeOptionalString(value) ?? "";
  if (!trimmed) return false;
  const isTenantUuid =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(trimmed);
  const isTenantDomain =
    /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/.test(
      trimmed,
    );
  return isTenantUuid || isTenantDomain;
}
async function promptTenantId(ctx, params) {
  const suggestionLines =
    params?.suggestions && params.suggestions.length > 0
      ? params.suggestions.map((entry) => `- ${entry.id}${entry.label ? ` (${entry.label})` : ""}`)
      : [];
  if (params?.reason || suggestionLines.length > 0)
    await ctx.prompter.note(
      [
        params?.reason,
        suggestionLines.length > 0 ? "Suggested tenants:" : void 0,
        ...suggestionLines,
      ]
        .filter(Boolean)
        .join("\n"),
      "Azure Tenant",
    );
  return (
    (
      await ctx.prompter.text({
        message: params?.required ? "Azure tenant ID" : "Azure tenant ID (optional)",
        placeholder: params?.suggestions?.[0]?.id ?? "00000000-0000-0000-0000-000000000000",
        validate: (value) => {
          const trimmed = normalizeStringifiedOptionalString(value) ?? "";
          if (!trimmed) return params?.required ? "Tenant ID is required" : void 0;
          return isValidTenantIdentifier(trimmed)
            ? void 0
            : "Enter a valid tenant ID or tenant domain";
        },
      })
    ).trim() || void 0
  );
}
async function loginWithTenantFallback(ctx) {
  try {
    await azLoginDeviceCode();
    return { account: getLoggedInAccount() };
  } catch (error) {
    const message = formatErrorMessage(error);
    if (
      !(
        /AADSTS\d+/i.test(message) ||
        /no subscriptions found/i.test(message) ||
        /Please provide a valid tenant/i.test(message) ||
        /tenant.*not found/i.test(message)
      )
    )
      throw error;
    const tenantId = await promptTenantId(ctx, {
      suggestions: extractTenantSuggestions(message),
      required: true,
      reason:
        "Azure login needs a tenant-scoped retry. This often happens when your tenant requires MFA or your account has no Azure subscriptions.",
    });
    await azLoginDeviceCodeWithOptions({
      tenantId,
      allowNoSubscriptions: true,
    });
    return {
      account: getLoggedInAccount(),
      tenantId,
    };
  }
}
async function testFoundryConnection(params) {
  try {
    const { accessToken } = getAccessTokenResult({
      scope: params.api === "anthropic-messages" ? FOUNDRY_ANTHROPIC_SCOPE : void 0,
      subscriptionId: params.subscriptionId,
      tenantId: params.tenantId,
    });
    const testRequest = buildFoundryConnectionTest({
      endpoint: params.endpoint,
      modelId: params.modelId,
      modelNameHint: params.modelNameHint,
      api: params.api,
    });
    const { response: res, release } = await fetchWithSsrFGuard({
      url: testRequest.url,
      init: {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          ...(params.api === "anthropic-messages" ? { "anthropic-version": "2023-06-01" } : {}),
        },
        body: JSON.stringify(testRequest.body),
      },
      timeoutMs: 15e3,
    });
    try {
      if (res.status === 400) {
        const body = await readResponseTextLimited(
          res,
          FOUNDRY_CONNECTION_TEST_ERROR_BODY_LIMIT_BYTES,
        ).catch(() => "");
        await params.ctx.prompter.note(
          `Endpoint is reachable but returned 400 Bad Request - check your deployment name and API version.\n${truncateUtf16Safe(body, 200)}`,
          "Connection Test",
        );
      } else if (!res.ok) {
        const body = await readResponseTextLimited(
          res,
          FOUNDRY_CONNECTION_TEST_ERROR_BODY_LIMIT_BYTES,
        ).catch(() => "");
        await params.ctx.prompter.note(
          `Warning: test request returned ${res.status}. ${truncateUtf16Safe(body, 200)}\nProceeding anyway - you can fix the endpoint later.`,
          "Connection Test",
        );
      } else await params.ctx.prompter.note("Connection test successful!", "✓");
    } finally {
      await release();
    }
  } catch (err) {
    await params.ctx.prompter.note(
      `Warning: connection test failed: ${String(err)}\nProceeding anyway.`,
      "Connection Test",
    );
  }
}
//#endregion
export {
  promptApiKeyEndpointAndModel as a,
  selectFoundryDeployment as c,
  loginWithTenantFallback as i,
  selectFoundryResource as l,
  isValidTenantIdentifier as n,
  promptEndpointAndModelManually as o,
  listResourceDeployments as r,
  promptTenantId as s,
  buildFoundryConnectionTest as t,
  testFoundryConnection as u,
};
