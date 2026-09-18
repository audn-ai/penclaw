import { t as JsonSchemaObject } from "../json-schema.types-z_ZXZBRr.js";
import { t as validateJsonSchemaValue } from "../schema-validator-BpSHrZSj.js";
import {
  $ as ZodPipe,
  B as ZodLiteral,
  C as ZodEnum,
  J as ZodNullable,
  Q as ZodOptional,
  Qi as $ZodTypeInternals,
  Y as ZodNumber,
  Z as ZodObject,
  _t as ZodURL,
  bt as ZodUnion,
  c as ZodBoolean,
  ea as $catchall,
  ft as ZodTransform,
  it as ZodRecord,
  mt as ZodType,
  na as $strict,
  pt as ZodTuple,
  q as ZodNull,
  r as ZodArray,
  ra as $strip,
  st as ZodString,
  ta as $loose,
  tt as ZodPreprocess,
  v as ZodDefault,
  xt as ZodUnknown,
  y as ZodDiscriminatedUnion,
  z as ZodLazy,
} from "../schemas-CkRCGSfd.js";
import { r as ChannelsConfig } from "../types.channels-CYB_Xphv.js";

//#region src/config/zod-schema.d.ts
declare const OpenClawSchema: ZodObject<
  {
    $schema: ZodOptional<ZodString>;
    meta: ZodOptional<
      ZodObject<
        {
          lastTouchedVersion: ZodOptional<ZodString>;
          lastTouchedAt: ZodOptional<
            ZodUnion<
              readonly [
                ZodString,
                ZodPipe<ZodPipe<ZodNumber, ZodTransform<string, number>>, ZodString>,
              ]
            >
          >;
        },
        $strict
      >
    >;
    env: ZodOptional<
      ZodObject<
        {
          shellEnv: ZodOptional<
            ZodObject<
              {
                enabled: ZodOptional<ZodBoolean>;
                timeoutMs: ZodOptional<ZodNumber>;
              },
              $strict
            >
          >;
          vars: ZodOptional<ZodRecord<ZodString, ZodString>>;
        },
        $catchall<ZodString>
      >
    >;
    wizard: ZodOptional<
      ZodObject<
        {
          lastRunAt: ZodOptional<ZodString>;
          lastRunVersion: ZodOptional<ZodString>;
          lastRunCommit: ZodOptional<ZodString>;
          lastRunCommand: ZodOptional<ZodString>;
          lastRunMode: ZodOptional<ZodUnion<readonly [ZodLiteral<"local">, ZodLiteral<"remote">]>>;
          securityAcknowledgedAt: ZodOptional<ZodString>;
        },
        $strict
      >
    >;
    diagnostics: ZodOptional<
      ZodObject<
        {
          enabled: ZodOptional<ZodBoolean>;
          flags: ZodOptional<ZodArray<ZodString>>;
          stuckSessionWarnMs: ZodOptional<ZodNumber>;
          stuckSessionAbortMs: ZodOptional<ZodNumber>;
          memoryPressureSnapshot: ZodOptional<ZodBoolean>;
          otel: ZodOptional<
            ZodObject<
              {
                enabled: ZodOptional<ZodBoolean>;
                endpoint: ZodOptional<ZodString>;
                tracesEndpoint: ZodOptional<ZodString>;
                metricsEndpoint: ZodOptional<ZodString>;
                logsEndpoint: ZodOptional<ZodString>;
                protocol: ZodOptional<
                  ZodUnion<readonly [ZodLiteral<"http/protobuf">, ZodLiteral<"grpc">]>
                >;
                headers: ZodOptional<ZodRecord<ZodString, ZodString>>;
                serviceName: ZodOptional<ZodString>;
                traces: ZodOptional<ZodBoolean>;
                metrics: ZodOptional<ZodBoolean>;
                logs: ZodOptional<ZodBoolean>;
                logsExporter: ZodOptional<
                  ZodUnion<readonly [ZodLiteral<"otlp">, ZodLiteral<"stdout">, ZodLiteral<"both">]>
                >;
                sampleRate: ZodOptional<ZodNumber>;
                flushIntervalMs: ZodOptional<ZodNumber>;
                captureContent: ZodOptional<
                  ZodUnion<
                    readonly [
                      ZodBoolean,
                      ZodObject<
                        {
                          enabled: ZodOptional<ZodBoolean>;
                          inputMessages: ZodOptional<ZodBoolean>;
                          outputMessages: ZodOptional<ZodBoolean>;
                          toolInputs: ZodOptional<ZodBoolean>;
                          toolOutputs: ZodOptional<ZodBoolean>;
                          systemPrompt: ZodOptional<ZodBoolean>;
                          toolDefinitions: ZodOptional<ZodBoolean>;
                        },
                        $strict
                      >,
                    ]
                  >
                >;
              },
              $strict
            >
          >;
          cacheTrace: ZodOptional<
            ZodObject<
              {
                enabled: ZodOptional<ZodBoolean>;
                filePath: ZodOptional<ZodString>;
                includeMessages: ZodOptional<ZodBoolean>;
                includePrompt: ZodOptional<ZodBoolean>;
                includeSystem: ZodOptional<ZodBoolean>;
              },
              $strict
            >
          >;
        },
        $strict
      >
    >;
    audit: ZodOptional<
      ZodObject<
        {
          enabled: ZodOptional<ZodBoolean>;
          messages: ZodOptional<
            ZodUnion<readonly [ZodLiteral<"off">, ZodLiteral<"direct">, ZodLiteral<"all">]>
          >;
        },
        $strict
      >
    >;
    logging: ZodOptional<
      ZodObject<
        {
          level: ZodOptional<
            ZodUnion<
              readonly [
                ZodLiteral<"silent">,
                ZodLiteral<"fatal">,
                ZodLiteral<"error">,
                ZodLiteral<"warn">,
                ZodLiteral<"info">,
                ZodLiteral<"debug">,
                ZodLiteral<"trace">,
              ]
            >
          >;
          file: ZodOptional<ZodString>;
          maxFileBytes: ZodOptional<ZodNumber>;
          consoleLevel: ZodOptional<
            ZodUnion<
              readonly [
                ZodLiteral<"silent">,
                ZodLiteral<"fatal">,
                ZodLiteral<"error">,
                ZodLiteral<"warn">,
                ZodLiteral<"info">,
                ZodLiteral<"debug">,
                ZodLiteral<"trace">,
              ]
            >
          >;
          consoleStyle: ZodOptional<
            ZodUnion<readonly [ZodLiteral<"pretty">, ZodLiteral<"compact">, ZodLiteral<"json">]>
          >;
          redactSensitive: ZodOptional<ZodUnion<readonly [ZodLiteral<"off">, ZodLiteral<"tools">]>>;
          redactPatterns: ZodOptional<ZodArray<ZodString>>;
        },
        $strict
      >
    >;
    cli: ZodOptional<
      ZodObject<
        {
          banner: ZodOptional<
            ZodObject<
              {
                taglineMode: ZodOptional<
                  ZodUnion<
                    readonly [ZodLiteral<"random">, ZodLiteral<"default">, ZodLiteral<"off">]
                  >
                >;
              },
              $strict
            >
          >;
        },
        $strict
      >
    >;
    crestodian: ZodOptional<
      ZodObject<
        {
          rescue: ZodOptional<
            ZodObject<
              {
                enabled: ZodOptional<ZodUnion<readonly [ZodLiteral<"auto">, ZodBoolean]>>;
                ownerDmOnly: ZodOptional<ZodBoolean>;
                pendingTtlMinutes: ZodOptional<ZodNumber>;
              },
              $strict
            >
          >;
        },
        $strict
      >
    >;
    update: ZodOptional<
      ZodObject<
        {
          channel: ZodOptional<
            ZodUnion<
              readonly [
                ZodLiteral<"stable">,
                ZodLiteral<"extended-stable">,
                ZodLiteral<"beta">,
                ZodLiteral<"dev">,
              ]
            >
          >;
          checkOnStart: ZodOptional<ZodBoolean>;
          auto: ZodOptional<
            ZodObject<
              {
                enabled: ZodOptional<ZodBoolean>;
                stableDelayHours: ZodOptional<ZodNumber>;
                stableJitterHours: ZodOptional<ZodNumber>;
                betaCheckIntervalHours: ZodOptional<ZodNumber>;
              },
              $strict
            >
          >;
        },
        $strict
      >
    >;
    browser: ZodOptional<
      ZodObject<
        {
          enabled: ZodOptional<ZodBoolean>;
          allowSystemProfileImport: ZodOptional<ZodBoolean>;
          evaluateEnabled: ZodOptional<ZodBoolean>;
          cdpUrl: ZodOptional<ZodString>;
          remoteCdpTimeoutMs: ZodOptional<ZodNumber>;
          remoteCdpHandshakeTimeoutMs: ZodOptional<ZodNumber>;
          localLaunchTimeoutMs: ZodOptional<ZodNumber>;
          localCdpReadyTimeoutMs: ZodOptional<ZodNumber>;
          actionTimeoutMs: ZodOptional<ZodNumber>;
          color: ZodOptional<ZodString>;
          executablePath: ZodOptional<ZodString>;
          headless: ZodOptional<ZodBoolean>;
          noSandbox: ZodOptional<ZodBoolean>;
          attachOnly: ZodOptional<ZodBoolean>;
          cdpPortRangeStart: ZodOptional<ZodNumber>;
          defaultProfile: ZodOptional<ZodString>;
          snapshotDefaults: ZodOptional<
            ZodObject<
              {
                mode: ZodOptional<ZodLiteral<"efficient">>;
              },
              $strict
            >
          >;
          ssrfPolicy: ZodOptional<
            ZodObject<
              {
                dangerouslyAllowPrivateNetwork: ZodOptional<ZodBoolean>;
                allowedHostnames: ZodOptional<ZodArray<ZodString>>;
                hostnameAllowlist: ZodOptional<ZodArray<ZodString>>;
              },
              $strict
            >
          >;
          profiles: ZodOptional<
            ZodRecord<
              ZodString,
              ZodObject<
                {
                  cdpPort: ZodOptional<ZodNumber>;
                  cdpUrl: ZodOptional<ZodString>;
                  userDataDir: ZodOptional<ZodString>;
                  mcpCommand: ZodOptional<ZodString>;
                  mcpArgs: ZodOptional<ZodArray<ZodString>>;
                  driver: ZodOptional<
                    ZodUnion<
                      readonly [
                        ZodLiteral<"openclaw">,
                        ZodLiteral<"clawd">,
                        ZodLiteral<"existing-session">,
                        ZodLiteral<"extension">,
                      ]
                    >
                  >;
                  headless: ZodOptional<ZodBoolean>;
                  executablePath: ZodOptional<ZodString>;
                  attachOnly: ZodOptional<ZodBoolean>;
                  color: ZodString;
                },
                $strict
              >
            >
          >;
          extraArgs: ZodOptional<ZodArray<ZodString>>;
          tabCleanup: ZodOptional<
            ZodObject<
              {
                enabled: ZodOptional<ZodBoolean>;
                idleMinutes: ZodOptional<ZodNumber>;
                maxTabsPerSession: ZodOptional<ZodNumber>;
                sweepMinutes: ZodOptional<ZodNumber>;
              },
              $strict
            >
          >;
        },
        $strict
      >
    >;
    ui: ZodOptional<
      ZodObject<
        {
          seamColor: ZodOptional<ZodString>;
          assistant: ZodOptional<
            ZodObject<
              {
                name: ZodOptional<ZodString>;
                avatar: ZodOptional<ZodString>;
              },
              $strict
            >
          >;
        },
        $strict
      >
    >;
    tui: ZodOptional<
      ZodObject<
        {
          footer: ZodOptional<
            ZodObject<
              {
                showRemoteHost: ZodOptional<ZodBoolean>;
              },
              $strict
            >
          >;
        },
        $strict
      >
    >;
    secrets: ZodOptional<
      ZodObject<
        {
          providers: ZodOptional<
            ZodObject<
              {},
              $catchall<
                ZodUnion<
                  readonly [
                    ZodObject<
                      {
                        source: ZodLiteral<"env">;
                        allowlist: ZodOptional<ZodArray<ZodString>>;
                      },
                      $strict
                    >,
                    ZodObject<
                      {
                        source: ZodLiteral<"file">;
                        path: ZodString;
                        mode: ZodOptional<
                          ZodUnion<readonly [ZodLiteral<"singleValue">, ZodLiteral<"json">]>
                        >;
                        timeoutMs: ZodOptional<ZodNumber>;
                        maxBytes: ZodOptional<ZodNumber>;
                        allowInsecurePath: ZodOptional<ZodBoolean>;
                      },
                      $strict
                    >,
                    ZodUnion<
                      readonly [
                        ZodObject<
                          {
                            source: ZodLiteral<"exec">;
                            command: ZodString;
                            args: ZodOptional<ZodArray<ZodString>>;
                            timeoutMs: ZodOptional<ZodNumber>;
                            noOutputTimeoutMs: ZodOptional<ZodNumber>;
                            maxOutputBytes: ZodOptional<ZodNumber>;
                            jsonOnly: ZodOptional<ZodBoolean>;
                            env: ZodOptional<ZodRecord<ZodString, ZodString>>;
                            passEnv: ZodOptional<ZodArray<ZodString>>;
                            trustedDirs: ZodOptional<ZodArray<ZodString>>;
                            allowInsecurePath: ZodOptional<ZodBoolean>;
                            allowSymlinkCommand: ZodOptional<ZodBoolean>;
                          },
                          $strict
                        >,
                        ZodObject<
                          {
                            source: ZodLiteral<"exec">;
                            pluginIntegration: ZodObject<
                              {
                                pluginId: ZodString;
                                integrationId: ZodString;
                              },
                              $strict
                            >;
                          },
                          $strict
                        >,
                      ]
                    >,
                  ]
                >
              >
            >
          >;
          defaults: ZodOptional<
            ZodObject<
              {
                env: ZodOptional<ZodString>;
                file: ZodOptional<ZodString>;
                exec: ZodOptional<ZodString>;
              },
              $strict
            >
          >;
          resolution: ZodOptional<
            ZodObject<
              {
                maxProviderConcurrency: ZodOptional<ZodNumber>;
                maxRefsPerProvider: ZodOptional<ZodNumber>;
                maxBatchBytes: ZodOptional<ZodNumber>;
              },
              $strict
            >
          >;
        },
        $strict
      >
    >;
    marketplaces: ZodOptional<
      ZodObject<
        {
          feeds: ZodOptional<
            ZodRecord<
              ZodString,
              ZodObject<
                {
                  url: ZodString;
                  verification: ZodOptional<
                    ZodUnion<
                      readonly [
                        ZodObject<
                          {
                            mode: ZodLiteral<"unsigned">;
                          },
                          $strict
                        >,
                        ZodObject<
                          {
                            mode: ZodLiteral<"signed">;
                            keys: ZodArray<
                              ZodObject<
                                {
                                  keyId: ZodString;
                                  publicKey: ZodString;
                                },
                                $strict
                              >
                            >;
                            threshold: ZodOptional<ZodNumber>;
                          },
                          $strict
                        >,
                      ]
                    >
                  >;
                },
                $strict
              >
            >
          >;
          sources: ZodOptional<
            ZodRecord<
              ZodString,
              ZodUnion<
                readonly [
                  ZodObject<
                    {
                      type: ZodLiteral<"npm">;
                    },
                    $strict
                  >,
                  ZodObject<
                    {
                      type: ZodLiteral<"clawhub">;
                    },
                    $strict
                  >,
                  ZodObject<
                    {
                      type: ZodLiteral<"git">;
                    },
                    $strict
                  >,
                ]
              >
            >
          >;
        },
        $strict
      >
    >;
    auth: ZodOptional<
      ZodObject<
        {
          profiles: ZodOptional<
            ZodRecord<
              ZodString,
              ZodObject<
                {
                  provider: ZodString;
                  mode: ZodUnion<
                    readonly [
                      ZodLiteral<"api_key">,
                      ZodLiteral<"aws-sdk">,
                      ZodLiteral<"oauth">,
                      ZodLiteral<"token">,
                    ]
                  >;
                  email: ZodOptional<ZodString>;
                  displayName: ZodOptional<ZodString>;
                },
                $strict
              >
            >
          >;
          order: ZodOptional<ZodRecord<ZodString, ZodArray<ZodString>>>;
          cooldowns: ZodOptional<
            ZodObject<
              {
                billingBackoffHours: ZodOptional<ZodNumber>;
                billingBackoffHoursByProvider: ZodOptional<ZodRecord<ZodString, ZodNumber>>;
                billingMaxHours: ZodOptional<ZodNumber>;
                authPermanentBackoffMinutes: ZodOptional<ZodNumber>;
                authPermanentMaxMinutes: ZodOptional<ZodNumber>;
                failureWindowHours: ZodOptional<ZodNumber>;
                overloadedProfileRotations: ZodOptional<ZodNumber>;
                overloadedBackoffMs: ZodOptional<ZodNumber>;
                rateLimitedProfileRotations: ZodOptional<ZodNumber>;
              },
              $strict
            >
          >;
        },
        $strict
      >
    >;
    accessGroups: ZodOptional<
      ZodRecord<
        ZodString,
        ZodDiscriminatedUnion<
          [
            ZodObject<
              {
                type: ZodLiteral<"discord.channelAudience">;
                guildId: ZodString;
                channelId: ZodString;
                membership: ZodOptional<ZodLiteral<"canViewChannel">>;
              },
              $strict
            >,
            ZodObject<
              {
                type: ZodLiteral<"message.senders">;
                members: ZodRecord<ZodString, ZodArray<ZodString>>;
              },
              $strict
            >,
          ],
          "type"
        >
      >
    >;
    acp: ZodOptional<
      ZodObject<
        {
          enabled: ZodOptional<ZodBoolean>;
          dispatch: ZodOptional<
            ZodObject<
              {
                enabled: ZodOptional<ZodBoolean>;
              },
              $strict
            >
          >;
          backend: ZodOptional<ZodString>;
          fallbacks: ZodOptional<ZodArray<ZodString>>;
          defaultAgent: ZodOptional<ZodString>;
          allowedAgents: ZodOptional<ZodArray<ZodString>>;
          maxConcurrentSessions: ZodOptional<ZodNumber>;
          stream: ZodOptional<
            ZodObject<
              {
                coalesceIdleMs: ZodOptional<ZodNumber>;
                maxChunkChars: ZodOptional<ZodNumber>;
                repeatSuppression: ZodOptional<ZodBoolean>;
                deliveryMode: ZodOptional<
                  ZodUnion<readonly [ZodLiteral<"live">, ZodLiteral<"final_only">]>
                >;
                hiddenBoundarySeparator: ZodOptional<
                  ZodUnion<
                    readonly [
                      ZodLiteral<"none">,
                      ZodLiteral<"space">,
                      ZodLiteral<"newline">,
                      ZodLiteral<"paragraph">,
                    ]
                  >
                >;
                maxOutputChars: ZodOptional<ZodNumber>;
                maxSessionUpdateChars: ZodOptional<ZodNumber>;
                tagVisibility: ZodOptional<ZodRecord<ZodString, ZodBoolean>>;
              },
              $strict
            >
          >;
          runtime: ZodOptional<
            ZodObject<
              {
                ttlMinutes: ZodOptional<ZodNumber>;
                installCommand: ZodOptional<ZodString>;
              },
              $strict
            >
          >;
        },
        $strict
      >
    >;
    models: ZodOptional<
      ZodObject<
        {
          mode: ZodOptional<ZodUnion<readonly [ZodLiteral<"merge">, ZodLiteral<"replace">]>>;
          providers: ZodOptional<
            ZodRecord<
              ZodString,
              ZodObject<
                {
                  baseUrl: ZodOptional<ZodString>;
                  apiKey: ZodOptional<
                    ZodUnion<
                      readonly [
                        ZodString,
                        ZodDiscriminatedUnion<
                          [
                            ZodObject<
                              {
                                source: ZodLiteral<"env">;
                                provider: ZodString;
                                id: ZodString;
                              },
                              $strict
                            >,
                            ZodObject<
                              {
                                source: ZodLiteral<"file">;
                                provider: ZodString;
                                id: ZodString;
                              },
                              $strict
                            >,
                            ZodObject<
                              {
                                source: ZodLiteral<"exec">;
                                provider: ZodString;
                                id: ZodString;
                              },
                              $strict
                            >,
                          ],
                          "source"
                        >,
                      ]
                    >
                  >;
                  auth: ZodOptional<
                    ZodUnion<
                      readonly [
                        ZodLiteral<"api-key">,
                        ZodLiteral<"aws-sdk">,
                        ZodLiteral<"oauth">,
                        ZodLiteral<"token">,
                      ]
                    >
                  >;
                  api: ZodOptional<
                    ZodEnum<{
                      "openai-completions": "openai-completions";
                      "openai-responses": "openai-responses";
                      "openai-chatgpt-responses": "openai-chatgpt-responses";
                      "anthropic-messages": "anthropic-messages";
                      "google-generative-ai": "google-generative-ai";
                      "google-vertex": "google-vertex";
                      "github-copilot": "github-copilot";
                      "bedrock-converse-stream": "bedrock-converse-stream";
                      ollama: "ollama";
                      "azure-openai-responses": "azure-openai-responses";
                    }>
                  >;
                  contextWindow: ZodOptional<ZodNumber>;
                  contextTokens: ZodOptional<ZodNumber>;
                  maxTokens: ZodOptional<ZodNumber>;
                  timeoutSeconds: ZodOptional<ZodNumber>;
                  region: ZodOptional<ZodString>;
                  injectNumCtxForOpenAICompat: ZodOptional<ZodBoolean>;
                  params: ZodOptional<ZodRecord<ZodString, ZodUnknown>>;
                  agentRuntime: ZodOptional<
                    ZodObject<
                      {
                        id: ZodOptional<ZodString>;
                      },
                      $strict
                    >
                  >;
                  localService: ZodOptional<
                    ZodObject<
                      {
                        command: ZodString;
                        args: ZodOptional<ZodArray<ZodString>>;
                        cwd: ZodOptional<ZodString>;
                        env: ZodOptional<ZodRecord<ZodString, ZodString>>;
                        healthUrl: ZodOptional<ZodString>;
                        readyTimeoutMs: ZodOptional<ZodNumber>;
                        idleStopMs: ZodOptional<ZodNumber>;
                      },
                      $strict
                    >
                  >;
                  headers: ZodOptional<
                    ZodRecord<
                      ZodString,
                      ZodUnion<
                        readonly [
                          ZodString,
                          ZodDiscriminatedUnion<
                            [
                              ZodObject<
                                {
                                  source: ZodLiteral<"env">;
                                  provider: ZodString;
                                  id: ZodString;
                                },
                                $strict
                              >,
                              ZodObject<
                                {
                                  source: ZodLiteral<"file">;
                                  provider: ZodString;
                                  id: ZodString;
                                },
                                $strict
                              >,
                              ZodObject<
                                {
                                  source: ZodLiteral<"exec">;
                                  provider: ZodString;
                                  id: ZodString;
                                },
                                $strict
                              >,
                            ],
                            "source"
                          >,
                        ]
                      >
                    >
                  >;
                  authHeader: ZodOptional<ZodBoolean>;
                  request: ZodOptional<
                    ZodObject<
                      {
                        allowPrivateNetwork: ZodOptional<ZodBoolean>;
                        headers: ZodOptional<
                          ZodRecord<
                            ZodString,
                            ZodUnion<
                              readonly [
                                ZodString,
                                ZodDiscriminatedUnion<
                                  [
                                    ZodObject<
                                      {
                                        source: ZodLiteral<"env">;
                                        provider: ZodString;
                                        id: ZodString;
                                      },
                                      $strict
                                    >,
                                    ZodObject<
                                      {
                                        source: ZodLiteral<"file">;
                                        provider: ZodString;
                                        id: ZodString;
                                      },
                                      $strict
                                    >,
                                    ZodObject<
                                      {
                                        source: ZodLiteral<"exec">;
                                        provider: ZodString;
                                        id: ZodString;
                                      },
                                      $strict
                                    >,
                                  ],
                                  "source"
                                >,
                              ]
                            >
                          >
                        >;
                        auth: ZodOptional<
                          ZodUnion<
                            readonly [
                              ZodObject<
                                {
                                  mode: ZodLiteral<"provider-default">;
                                },
                                $strict
                              >,
                              ZodObject<
                                {
                                  mode: ZodLiteral<"authorization-bearer">;
                                  token: ZodUnion<
                                    readonly [
                                      ZodString,
                                      ZodDiscriminatedUnion<
                                        [
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"env">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"file">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"exec">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                        ],
                                        "source"
                                      >,
                                    ]
                                  >;
                                },
                                $strict
                              >,
                              ZodObject<
                                {
                                  mode: ZodLiteral<"header">;
                                  headerName: ZodString;
                                  value: ZodUnion<
                                    readonly [
                                      ZodString,
                                      ZodDiscriminatedUnion<
                                        [
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"env">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"file">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"exec">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                        ],
                                        "source"
                                      >,
                                    ]
                                  >;
                                  prefix: ZodOptional<ZodString>;
                                },
                                $strict
                              >,
                            ]
                          >
                        >;
                        proxy: ZodOptional<
                          ZodUnion<
                            readonly [
                              ZodObject<
                                {
                                  mode: ZodLiteral<"env-proxy">;
                                  tls: ZodOptional<
                                    ZodObject<
                                      {
                                        ca: ZodOptional<
                                          ZodUnion<
                                            readonly [
                                              ZodString,
                                              ZodDiscriminatedUnion<
                                                [
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"env">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"file">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"exec">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                ],
                                                "source"
                                              >,
                                            ]
                                          >
                                        >;
                                        cert: ZodOptional<
                                          ZodUnion<
                                            readonly [
                                              ZodString,
                                              ZodDiscriminatedUnion<
                                                [
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"env">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"file">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"exec">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                ],
                                                "source"
                                              >,
                                            ]
                                          >
                                        >;
                                        key: ZodOptional<
                                          ZodUnion<
                                            readonly [
                                              ZodString,
                                              ZodDiscriminatedUnion<
                                                [
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"env">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"file">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"exec">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                ],
                                                "source"
                                              >,
                                            ]
                                          >
                                        >;
                                        passphrase: ZodOptional<
                                          ZodUnion<
                                            readonly [
                                              ZodString,
                                              ZodDiscriminatedUnion<
                                                [
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"env">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"file">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"exec">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                ],
                                                "source"
                                              >,
                                            ]
                                          >
                                        >;
                                        serverName: ZodOptional<ZodString>;
                                        insecureSkipVerify: ZodOptional<ZodBoolean>;
                                      },
                                      $strict
                                    >
                                  >;
                                },
                                $strict
                              >,
                              ZodObject<
                                {
                                  mode: ZodLiteral<"explicit-proxy">;
                                  url: ZodString;
                                  tls: ZodOptional<
                                    ZodObject<
                                      {
                                        ca: ZodOptional<
                                          ZodUnion<
                                            readonly [
                                              ZodString,
                                              ZodDiscriminatedUnion<
                                                [
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"env">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"file">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"exec">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                ],
                                                "source"
                                              >,
                                            ]
                                          >
                                        >;
                                        cert: ZodOptional<
                                          ZodUnion<
                                            readonly [
                                              ZodString,
                                              ZodDiscriminatedUnion<
                                                [
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"env">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"file">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"exec">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                ],
                                                "source"
                                              >,
                                            ]
                                          >
                                        >;
                                        key: ZodOptional<
                                          ZodUnion<
                                            readonly [
                                              ZodString,
                                              ZodDiscriminatedUnion<
                                                [
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"env">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"file">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"exec">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                ],
                                                "source"
                                              >,
                                            ]
                                          >
                                        >;
                                        passphrase: ZodOptional<
                                          ZodUnion<
                                            readonly [
                                              ZodString,
                                              ZodDiscriminatedUnion<
                                                [
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"env">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"file">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"exec">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                ],
                                                "source"
                                              >,
                                            ]
                                          >
                                        >;
                                        serverName: ZodOptional<ZodString>;
                                        insecureSkipVerify: ZodOptional<ZodBoolean>;
                                      },
                                      $strict
                                    >
                                  >;
                                },
                                $strict
                              >,
                            ]
                          >
                        >;
                        tls: ZodOptional<
                          ZodObject<
                            {
                              ca: ZodOptional<
                                ZodUnion<
                                  readonly [
                                    ZodString,
                                    ZodDiscriminatedUnion<
                                      [
                                        ZodObject<
                                          {
                                            source: ZodLiteral<"env">;
                                            provider: ZodString;
                                            id: ZodString;
                                          },
                                          $strict
                                        >,
                                        ZodObject<
                                          {
                                            source: ZodLiteral<"file">;
                                            provider: ZodString;
                                            id: ZodString;
                                          },
                                          $strict
                                        >,
                                        ZodObject<
                                          {
                                            source: ZodLiteral<"exec">;
                                            provider: ZodString;
                                            id: ZodString;
                                          },
                                          $strict
                                        >,
                                      ],
                                      "source"
                                    >,
                                  ]
                                >
                              >;
                              cert: ZodOptional<
                                ZodUnion<
                                  readonly [
                                    ZodString,
                                    ZodDiscriminatedUnion<
                                      [
                                        ZodObject<
                                          {
                                            source: ZodLiteral<"env">;
                                            provider: ZodString;
                                            id: ZodString;
                                          },
                                          $strict
                                        >,
                                        ZodObject<
                                          {
                                            source: ZodLiteral<"file">;
                                            provider: ZodString;
                                            id: ZodString;
                                          },
                                          $strict
                                        >,
                                        ZodObject<
                                          {
                                            source: ZodLiteral<"exec">;
                                            provider: ZodString;
                                            id: ZodString;
                                          },
                                          $strict
                                        >,
                                      ],
                                      "source"
                                    >,
                                  ]
                                >
                              >;
                              key: ZodOptional<
                                ZodUnion<
                                  readonly [
                                    ZodString,
                                    ZodDiscriminatedUnion<
                                      [
                                        ZodObject<
                                          {
                                            source: ZodLiteral<"env">;
                                            provider: ZodString;
                                            id: ZodString;
                                          },
                                          $strict
                                        >,
                                        ZodObject<
                                          {
                                            source: ZodLiteral<"file">;
                                            provider: ZodString;
                                            id: ZodString;
                                          },
                                          $strict
                                        >,
                                        ZodObject<
                                          {
                                            source: ZodLiteral<"exec">;
                                            provider: ZodString;
                                            id: ZodString;
                                          },
                                          $strict
                                        >,
                                      ],
                                      "source"
                                    >,
                                  ]
                                >
                              >;
                              passphrase: ZodOptional<
                                ZodUnion<
                                  readonly [
                                    ZodString,
                                    ZodDiscriminatedUnion<
                                      [
                                        ZodObject<
                                          {
                                            source: ZodLiteral<"env">;
                                            provider: ZodString;
                                            id: ZodString;
                                          },
                                          $strict
                                        >,
                                        ZodObject<
                                          {
                                            source: ZodLiteral<"file">;
                                            provider: ZodString;
                                            id: ZodString;
                                          },
                                          $strict
                                        >,
                                        ZodObject<
                                          {
                                            source: ZodLiteral<"exec">;
                                            provider: ZodString;
                                            id: ZodString;
                                          },
                                          $strict
                                        >,
                                      ],
                                      "source"
                                    >,
                                  ]
                                >
                              >;
                              serverName: ZodOptional<ZodString>;
                              insecureSkipVerify: ZodOptional<ZodBoolean>;
                            },
                            $strict
                          >
                        >;
                      },
                      $strict
                    >
                  >;
                  models: ZodOptional<
                    ZodArray<
                      ZodObject<
                        {
                          id: ZodString;
                          name: ZodString;
                          api: ZodOptional<
                            ZodEnum<{
                              "openai-completions": "openai-completions";
                              "openai-responses": "openai-responses";
                              "openai-chatgpt-responses": "openai-chatgpt-responses";
                              "anthropic-messages": "anthropic-messages";
                              "google-generative-ai": "google-generative-ai";
                              "google-vertex": "google-vertex";
                              "github-copilot": "github-copilot";
                              "bedrock-converse-stream": "bedrock-converse-stream";
                              ollama: "ollama";
                              "azure-openai-responses": "azure-openai-responses";
                            }>
                          >;
                          baseUrl: ZodOptional<ZodString>;
                          reasoning: ZodOptional<ZodBoolean>;
                          input: ZodOptional<
                            ZodArray<
                              ZodUnion<
                                readonly [
                                  ZodLiteral<"text">,
                                  ZodLiteral<"image">,
                                  ZodLiteral<"video">,
                                  ZodLiteral<"audio">,
                                ]
                              >
                            >
                          >;
                          cost: ZodOptional<
                            ZodObject<
                              {
                                input: ZodOptional<ZodNumber>;
                                output: ZodOptional<ZodNumber>;
                                cacheRead: ZodOptional<ZodNumber>;
                                cacheWrite: ZodOptional<ZodNumber>;
                                tieredPricing: ZodOptional<
                                  ZodArray<
                                    ZodObject<
                                      {
                                        input: ZodNumber;
                                        output: ZodNumber;
                                        cacheRead: ZodNumber;
                                        cacheWrite: ZodNumber;
                                        range: ZodUnion<
                                          readonly [
                                            ZodTuple<[ZodNumber, ZodNumber], null>,
                                            ZodTuple<[ZodNumber], null>,
                                          ]
                                        >;
                                      },
                                      $strict
                                    >
                                  >
                                >;
                              },
                              $strict
                            >
                          >;
                          contextWindow: ZodOptional<ZodNumber>;
                          contextTokens: ZodOptional<ZodNumber>;
                          maxTokens: ZodOptional<ZodNumber>;
                          thinkingLevelMap: ZodOptional<
                            ZodObject<
                              {
                                off: ZodOptional<ZodNullable<ZodString>>;
                                minimal: ZodOptional<ZodNullable<ZodString>>;
                                low: ZodOptional<ZodNullable<ZodString>>;
                                medium: ZodOptional<ZodNullable<ZodString>>;
                                high: ZodOptional<ZodNullable<ZodString>>;
                                xhigh: ZodOptional<ZodNullable<ZodString>>;
                                max: ZodOptional<ZodNullable<ZodString>>;
                              },
                              $strict
                            >
                          >;
                          params: ZodOptional<ZodRecord<ZodString, ZodUnknown>>;
                          agentRuntime: ZodOptional<
                            ZodObject<
                              {
                                id: ZodOptional<ZodString>;
                              },
                              $strict
                            >
                          >;
                          headers: ZodOptional<ZodRecord<ZodString, ZodString>>;
                          compat: ZodOptional<
                            ZodObject<
                              {
                                supportsStore: ZodOptional<ZodBoolean>;
                                supportsPromptCacheKey: ZodOptional<ZodBoolean>;
                                supportsDeveloperRole: ZodOptional<ZodBoolean>;
                                supportsReasoningEffort: ZodOptional<ZodBoolean>;
                                supportsTemperature: ZodOptional<ZodBoolean>;
                                supportsUsageInStreaming: ZodOptional<ZodBoolean>;
                                supportsTools: ZodOptional<ZodBoolean>;
                                supportsStrictMode: ZodOptional<ZodBoolean>;
                                requiresStringContent: ZodOptional<ZodBoolean>;
                                strictMessageKeys: ZodOptional<ZodBoolean>;
                                visibleReasoningDetailTypes: ZodOptional<ZodArray<ZodString>>;
                                supportedReasoningEfforts: ZodOptional<ZodArray<ZodString>>;
                                reasoningEffortMap: ZodOptional<ZodRecord<ZodString, ZodString>>;
                                maxTokensField: ZodOptional<
                                  ZodUnion<
                                    readonly [
                                      ZodLiteral<"max_completion_tokens">,
                                      ZodLiteral<"max_tokens">,
                                    ]
                                  >
                                >;
                                thinkingFormat: ZodOptional<
                                  ZodEnum<{
                                    openai: "openai";
                                    deepseek: "deepseek";
                                    openrouter: "openrouter";
                                    together: "together";
                                    zai: "zai";
                                    qwen: "qwen";
                                    "qwen-chat-template": "qwen-chat-template";
                                  }>
                                >;
                                requiresToolResultName: ZodOptional<ZodBoolean>;
                                requiresAssistantAfterToolResult: ZodOptional<ZodBoolean>;
                                requiresThinkingAsText: ZodOptional<ZodBoolean>;
                                requiresReasoningContentOnAssistantMessages: ZodOptional<ZodBoolean>;
                                toolSchemaProfile: ZodOptional<ZodString>;
                                unsupportedToolSchemaKeywords: ZodOptional<ZodArray<ZodString>>;
                                nativeWebSearchTool: ZodOptional<ZodBoolean>;
                                toolCallArgumentsEncoding: ZodOptional<ZodString>;
                                requiresMistralToolIds: ZodOptional<ZodBoolean>;
                                requiresOpenAiAnthropicToolPayload: ZodOptional<ZodBoolean>;
                              },
                              $strict
                            >
                          >;
                          mediaInput: ZodOptional<
                            ZodObject<
                              {
                                image: ZodOptional<
                                  ZodObject<
                                    {
                                      maxBytes: ZodOptional<ZodNumber>;
                                      maxPixels: ZodOptional<ZodNumber>;
                                      maxSidePx: ZodOptional<ZodNumber>;
                                      preferredSidePx: ZodOptional<ZodNumber>;
                                      tokenMode: ZodOptional<
                                        ZodUnion<
                                          readonly [
                                            ZodLiteral<"tile">,
                                            ZodLiteral<"detail">,
                                            ZodLiteral<"provider">,
                                          ]
                                        >
                                      >;
                                    },
                                    $strict
                                  >
                                >;
                              },
                              $strict
                            >
                          >;
                          metadataSource: ZodOptional<ZodLiteral<"models-add">>;
                        },
                        $strict
                      >
                    >
                  >;
                },
                $strict
              >
            >
          >;
          pricing: ZodOptional<
            ZodObject<
              {
                enabled: ZodOptional<ZodBoolean>;
              },
              $strict
            >
          >;
        },
        $strict
      >
    >;
    nodeHost: ZodOptional<
      ZodObject<
        {
          agentRuns: ZodOptional<
            ZodObject<
              {
                claude: ZodOptional<
                  ZodObject<
                    {
                      enabled: ZodOptional<ZodBoolean>;
                    },
                    $strict
                  >
                >;
              },
              $strict
            >
          >;
          browserProxy: ZodOptional<
            ZodObject<
              {
                enabled: ZodOptional<ZodBoolean>;
                allowProfiles: ZodOptional<ZodArray<ZodString>>;
              },
              $strict
            >
          >;
          mcp: ZodOptional<
            ZodObject<
              {
                servers: ZodOptional<
                  ZodRecord<
                    ZodString,
                    ZodObject<
                      {
                        enabled: ZodOptional<ZodBoolean>;
                        command: ZodOptional<ZodString>;
                        args: ZodOptional<ZodArray<ZodString>>;
                        env: ZodOptional<
                          ZodRecord<
                            ZodString,
                            ZodUnion<readonly [ZodString, ZodNumber, ZodBoolean]>
                          >
                        >;
                        cwd: ZodOptional<ZodString>;
                        workingDirectory: ZodOptional<ZodString>;
                        url: ZodOptional<ZodString>;
                        transport: ZodOptional<
                          ZodUnion<
                            readonly [
                              ZodLiteral<"stdio">,
                              ZodLiteral<"sse">,
                              ZodLiteral<"streamable-http">,
                            ]
                          >
                        >;
                        headers: ZodOptional<
                          ZodRecord<
                            ZodString,
                            ZodUnion<readonly [ZodString, ZodNumber, ZodBoolean]>
                          >
                        >;
                        connectionTimeoutMs: ZodOptional<ZodNumber>;
                        connectTimeout: ZodOptional<ZodNumber>;
                        connect_timeout: ZodOptional<ZodNumber>;
                        requestTimeoutMs: ZodOptional<ZodNumber>;
                        timeout: ZodOptional<ZodNumber>;
                        supportsParallelToolCalls: ZodOptional<ZodBoolean>;
                        supports_parallel_tool_calls: ZodOptional<ZodBoolean>;
                        auth: ZodOptional<ZodLiteral<"oauth">>;
                        oauth: ZodOptional<
                          ZodObject<
                            {
                              authProfileId: ZodOptional<ZodString>;
                              scope: ZodOptional<ZodString>;
                              redirectUrl: ZodOptional<ZodString>;
                              clientMetadataUrl: ZodOptional<ZodString>;
                            },
                            $strict
                          >
                        >;
                        sslVerify: ZodOptional<ZodBoolean>;
                        ssl_verify: ZodOptional<ZodBoolean>;
                        clientCert: ZodOptional<ZodString>;
                        client_cert: ZodOptional<ZodString>;
                        clientKey: ZodOptional<ZodString>;
                        client_key: ZodOptional<ZodString>;
                        toolFilter: ZodOptional<
                          ZodObject<
                            {
                              include: ZodOptional<ZodArray<ZodString>>;
                              exclude: ZodOptional<ZodArray<ZodString>>;
                            },
                            $strict
                          >
                        >;
                        codex: ZodOptional<
                          ZodObject<
                            {
                              agents: ZodOptional<ZodArray<ZodString>>;
                              defaultToolsApprovalMode: ZodOptional<
                                ZodEnum<{
                                  auto: "auto";
                                  prompt: "prompt";
                                  approve: "approve";
                                }>
                              >;
                              default_tools_approval_mode: ZodOptional<
                                ZodEnum<{
                                  auto: "auto";
                                  prompt: "prompt";
                                  approve: "approve";
                                }>
                              >;
                            },
                            $strict
                          >
                        >;
                      },
                      $catchall<ZodUnknown>
                    >
                  >
                >;
              },
              $strict
            >
          >;
          skills: ZodOptional<
            ZodObject<
              {
                enabled: ZodOptional<ZodBoolean>;
              },
              $strict
            >
          >;
        },
        $strict
      >
    >;
    agents: ZodOptional<
      ZodObject<
        {
          defaults: ZodOptional<
            ZodLazy<
              ZodOptional<
                ZodObject<
                  {
                    params: ZodOptional<ZodRecord<ZodString, ZodUnknown>>;
                    model: ZodOptional<
                      ZodUnion<
                        readonly [
                          ZodString,
                          ZodObject<
                            {
                              primary: ZodOptional<ZodString>;
                              fallbacks: ZodOptional<ZodArray<ZodString>>;
                            },
                            $strict
                          >,
                        ]
                      >
                    >;
                    utilityModel: ZodOptional<ZodString>;
                    imageModel: ZodOptional<
                      ZodUnion<
                        readonly [
                          ZodString,
                          ZodObject<
                            {
                              primary: ZodOptional<ZodString>;
                              fallbacks: ZodOptional<ZodArray<ZodString>>;
                              timeoutMs: ZodOptional<ZodNumber>;
                            },
                            $strict
                          >,
                        ]
                      >
                    >;
                    imageGenerationModel: ZodOptional<
                      ZodUnion<
                        readonly [
                          ZodString,
                          ZodObject<
                            {
                              primary: ZodOptional<ZodString>;
                              fallbacks: ZodOptional<ZodArray<ZodString>>;
                              timeoutMs: ZodOptional<ZodNumber>;
                            },
                            $strict
                          >,
                        ]
                      >
                    >;
                    videoGenerationModel: ZodOptional<
                      ZodUnion<
                        readonly [
                          ZodString,
                          ZodObject<
                            {
                              primary: ZodOptional<ZodString>;
                              fallbacks: ZodOptional<ZodArray<ZodString>>;
                              timeoutMs: ZodOptional<ZodNumber>;
                            },
                            $strict
                          >,
                        ]
                      >
                    >;
                    musicGenerationModel: ZodOptional<
                      ZodUnion<
                        readonly [
                          ZodString,
                          ZodObject<
                            {
                              primary: ZodOptional<ZodString>;
                              fallbacks: ZodOptional<ZodArray<ZodString>>;
                              timeoutMs: ZodOptional<ZodNumber>;
                            },
                            $strict
                          >,
                        ]
                      >
                    >;
                    voiceModel: ZodOptional<
                      ZodUnion<
                        readonly [
                          ZodString,
                          ZodObject<
                            {
                              primary: ZodOptional<ZodString>;
                              fallbacks: ZodOptional<ZodArray<ZodString>>;
                              timeoutMs: ZodOptional<ZodNumber>;
                            },
                            $strict
                          >,
                        ]
                      >
                    >;
                    mediaGenerationAutoProviderFallback: ZodOptional<ZodBoolean>;
                    pdfModel: ZodOptional<
                      ZodUnion<
                        readonly [
                          ZodString,
                          ZodObject<
                            {
                              primary: ZodOptional<ZodString>;
                              fallbacks: ZodOptional<ZodArray<ZodString>>;
                              timeoutMs: ZodOptional<ZodNumber>;
                            },
                            $strict
                          >,
                        ]
                      >
                    >;
                    pdfMaxBytesMb: ZodOptional<ZodNumber>;
                    pdfMaxPages: ZodOptional<ZodNumber>;
                    models: ZodOptional<
                      ZodRecord<
                        ZodString,
                        ZodObject<
                          {
                            alias: ZodOptional<ZodString>;
                            params: ZodOptional<ZodRecord<ZodString, ZodUnknown>>;
                            agentRuntime: ZodOptional<
                              ZodObject<
                                {
                                  id: ZodOptional<ZodString>;
                                },
                                $strict
                              >
                            >;
                            streaming: ZodOptional<ZodBoolean>;
                          },
                          $strict
                        >
                      >
                    >;
                    workspace: ZodOptional<ZodString>;
                    skills: ZodOptional<ZodArray<ZodString>>;
                    silentReply: ZodOptional<
                      ZodObject<
                        {
                          group: ZodOptional<
                            ZodUnion<readonly [ZodLiteral<"allow">, ZodLiteral<"disallow">]>
                          >;
                          internal: ZodOptional<
                            ZodUnion<readonly [ZodLiteral<"allow">, ZodLiteral<"disallow">]>
                          >;
                        },
                        $strict
                      >
                    >;
                    repoRoot: ZodOptional<ZodString>;
                    promptOverlays: ZodOptional<
                      ZodObject<
                        {
                          gpt5: ZodOptional<
                            ZodObject<
                              {
                                personality: ZodOptional<
                                  ZodUnion<
                                    readonly [
                                      ZodLiteral<"friendly">,
                                      ZodLiteral<"on">,
                                      ZodLiteral<"off">,
                                    ]
                                  >
                                >;
                              },
                              $strict
                            >
                          >;
                        },
                        $strict
                      >
                    >;
                    skipBootstrap: ZodOptional<ZodBoolean>;
                    skipOptionalBootstrapFiles: ZodOptional<
                      ZodArray<
                        ZodEnum<{
                          "IDENTITY.md": "IDENTITY.md";
                          "USER.md": "USER.md";
                          "SOUL.md": "SOUL.md";
                          "HEARTBEAT.md": "HEARTBEAT.md";
                        }>
                      >
                    >;
                    contextInjection: ZodOptional<
                      ZodUnion<
                        readonly [
                          ZodLiteral<"always">,
                          ZodLiteral<"continuation-skip">,
                          ZodLiteral<"never">,
                        ]
                      >
                    >;
                    bootstrapMaxChars: ZodOptional<ZodNumber>;
                    bootstrapTotalMaxChars: ZodOptional<ZodNumber>;
                    experimental: ZodOptional<
                      ZodObject<
                        {
                          localModelLean: ZodOptional<ZodBoolean>;
                        },
                        $strict
                      >
                    >;
                    bootstrapPromptTruncationWarning: ZodOptional<
                      ZodUnion<
                        readonly [ZodLiteral<"off">, ZodLiteral<"once">, ZodLiteral<"always">]
                      >
                    >;
                    userTimezone: ZodOptional<ZodString>;
                    startupContext: ZodOptional<
                      ZodObject<
                        {
                          enabled: ZodOptional<ZodBoolean>;
                          applyOn: ZodOptional<
                            ZodArray<ZodUnion<readonly [ZodLiteral<"new">, ZodLiteral<"reset">]>>
                          >;
                          dailyMemoryDays: ZodOptional<ZodNumber>;
                          maxFileBytes: ZodOptional<ZodNumber>;
                          maxFileChars: ZodOptional<ZodNumber>;
                          maxTotalChars: ZodOptional<ZodNumber>;
                        },
                        $strict
                      >
                    >;
                    contextLimits: ZodOptional<
                      ZodObject<
                        {
                          memoryGetMaxChars: ZodOptional<ZodNumber>;
                          memoryGetDefaultLines: ZodOptional<ZodNumber>;
                          toolResultMaxChars: ZodOptional<ZodNumber>;
                          postCompactionMaxChars: ZodOptional<ZodNumber>;
                        },
                        $strict
                      >
                    >;
                    timeFormat: ZodOptional<
                      ZodUnion<readonly [ZodLiteral<"auto">, ZodLiteral<"12">, ZodLiteral<"24">]>
                    >;
                    envelopeTimezone: ZodOptional<ZodString>;
                    envelopeTimestamp: ZodOptional<
                      ZodUnion<readonly [ZodLiteral<"on">, ZodLiteral<"off">]>
                    >;
                    envelopeElapsed: ZodOptional<
                      ZodUnion<readonly [ZodLiteral<"on">, ZodLiteral<"off">]>
                    >;
                    contextTokens: ZodOptional<ZodNumber>;
                    cliBackends: ZodOptional<
                      ZodRecord<
                        ZodString,
                        ZodObject<
                          {
                            command: ZodString;
                            args: ZodOptional<ZodArray<ZodString>>;
                            output: ZodOptional<
                              ZodUnion<
                                readonly [
                                  ZodLiteral<"json">,
                                  ZodLiteral<"text">,
                                  ZodLiteral<"jsonl">,
                                ]
                              >
                            >;
                            resumeOutput: ZodOptional<
                              ZodUnion<
                                readonly [
                                  ZodLiteral<"json">,
                                  ZodLiteral<"text">,
                                  ZodLiteral<"jsonl">,
                                ]
                              >
                            >;
                            jsonlDialect: ZodOptional<
                              ZodUnion<
                                readonly [
                                  ZodLiteral<"claude-stream-json">,
                                  ZodLiteral<"gemini-stream-json">,
                                ]
                              >
                            >;
                            liveSession: ZodOptional<ZodLiteral<"claude-stdio">>;
                            input: ZodOptional<
                              ZodUnion<readonly [ZodLiteral<"arg">, ZodLiteral<"stdin">]>
                            >;
                            maxPromptArgChars: ZodOptional<ZodNumber>;
                            env: ZodOptional<ZodRecord<ZodString, ZodString>>;
                            clearEnv: ZodOptional<ZodArray<ZodString>>;
                            modelArg: ZodOptional<ZodString>;
                            modelAliases: ZodOptional<ZodRecord<ZodString, ZodString>>;
                            sessionArg: ZodOptional<ZodString>;
                            sessionArgs: ZodOptional<ZodArray<ZodString>>;
                            resumeArgs: ZodOptional<ZodArray<ZodString>>;
                            forkArg: ZodOptional<ZodString>;
                            sessionMode: ZodOptional<
                              ZodUnion<
                                readonly [
                                  ZodLiteral<"always">,
                                  ZodLiteral<"existing">,
                                  ZodLiteral<"none">,
                                ]
                              >
                            >;
                            sessionIdFields: ZodOptional<ZodArray<ZodString>>;
                            systemPromptArg: ZodOptional<ZodString>;
                            systemPromptFileArg: ZodOptional<ZodString>;
                            systemPromptFileConfigArg: ZodOptional<ZodString>;
                            systemPromptFileConfigKey: ZodOptional<ZodString>;
                            systemPromptMode: ZodOptional<
                              ZodUnion<readonly [ZodLiteral<"append">, ZodLiteral<"replace">]>
                            >;
                            systemPromptWhen: ZodOptional<
                              ZodUnion<
                                readonly [
                                  ZodLiteral<"first">,
                                  ZodLiteral<"always">,
                                  ZodLiteral<"never">,
                                ]
                              >
                            >;
                            imageArg: ZodOptional<ZodString>;
                            imageMode: ZodOptional<
                              ZodUnion<readonly [ZodLiteral<"repeat">, ZodLiteral<"list">]>
                            >;
                            imagePathScope: ZodOptional<
                              ZodUnion<readonly [ZodLiteral<"temp">, ZodLiteral<"workspace">]>
                            >;
                            serialize: ZodOptional<ZodBoolean>;
                            reseedFromRawTranscriptWhenUncompacted: ZodOptional<ZodBoolean>;
                            reliability: ZodOptional<
                              ZodObject<
                                {
                                  outputLimits: ZodOptional<
                                    ZodObject<
                                      {
                                        maxTurnRawChars: ZodOptional<ZodNumber>;
                                        maxTurnLines: ZodOptional<ZodNumber>;
                                      },
                                      $strict
                                    >
                                  >;
                                  watchdog: ZodOptional<
                                    ZodObject<
                                      {
                                        fresh: ZodOptional<
                                          ZodObject<
                                            {
                                              noOutputTimeoutMs: ZodOptional<ZodNumber>;
                                              noOutputTimeoutRatio: ZodOptional<ZodNumber>;
                                              minMs: ZodOptional<ZodNumber>;
                                              maxMs: ZodOptional<ZodNumber>;
                                            },
                                            $strict
                                          >
                                        >;
                                        resume: ZodOptional<
                                          ZodObject<
                                            {
                                              noOutputTimeoutMs: ZodOptional<ZodNumber>;
                                              noOutputTimeoutRatio: ZodOptional<ZodNumber>;
                                              minMs: ZodOptional<ZodNumber>;
                                              maxMs: ZodOptional<ZodNumber>;
                                            },
                                            $strict
                                          >
                                        >;
                                      },
                                      $strict
                                    >
                                  >;
                                },
                                $strict
                              >
                            >;
                          },
                          $strict
                        >
                      >
                    >;
                    memorySearch: ZodOptional<
                      ZodObject<
                        {
                          enabled: ZodOptional<ZodBoolean>;
                          sources: ZodOptional<
                            ZodArray<
                              ZodUnion<readonly [ZodLiteral<"memory">, ZodLiteral<"sessions">]>
                            >
                          >;
                          extraPaths: ZodOptional<ZodArray<ZodString>>;
                          qmd: ZodOptional<
                            ZodObject<
                              {
                                extraCollections: ZodOptional<
                                  ZodArray<
                                    ZodObject<
                                      {
                                        path: ZodString;
                                        name: ZodOptional<ZodString>;
                                        pattern: ZodOptional<ZodString>;
                                      },
                                      $strict
                                    >
                                  >
                                >;
                              },
                              $strict
                            >
                          >;
                          multimodal: ZodOptional<
                            ZodObject<
                              {
                                enabled: ZodOptional<ZodBoolean>;
                                modalities: ZodOptional<
                                  ZodArray<
                                    ZodUnion<
                                      readonly [
                                        ZodLiteral<"image">,
                                        ZodLiteral<"audio">,
                                        ZodLiteral<"all">,
                                      ]
                                    >
                                  >
                                >;
                                maxFileBytes: ZodOptional<ZodNumber>;
                              },
                              $strict
                            >
                          >;
                          experimental: ZodOptional<
                            ZodObject<
                              {
                                sessionMemory: ZodOptional<ZodBoolean>;
                              },
                              $strict
                            >
                          >;
                          provider: ZodOptional<ZodString>;
                          remote: ZodOptional<
                            ZodObject<
                              {
                                baseUrl: ZodOptional<ZodString>;
                                apiKey: ZodOptional<
                                  ZodUnion<
                                    readonly [
                                      ZodString,
                                      ZodDiscriminatedUnion<
                                        [
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"env">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"file">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"exec">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                        ],
                                        "source"
                                      >,
                                    ]
                                  >
                                >;
                                headers: ZodOptional<ZodRecord<ZodString, ZodString>>;
                                nonBatchConcurrency: ZodOptional<ZodNumber>;
                                batch: ZodOptional<
                                  ZodObject<
                                    {
                                      enabled: ZodOptional<ZodBoolean>;
                                      wait: ZodOptional<ZodBoolean>;
                                      concurrency: ZodOptional<ZodNumber>;
                                      pollIntervalMs: ZodOptional<ZodNumber>;
                                      timeoutMinutes: ZodOptional<ZodNumber>;
                                    },
                                    $strict
                                  >
                                >;
                              },
                              $strict
                            >
                          >;
                          fallback: ZodOptional<ZodString>;
                          model: ZodOptional<ZodString>;
                          inputType: ZodOptional<ZodString>;
                          queryInputType: ZodOptional<ZodString>;
                          documentInputType: ZodOptional<ZodString>;
                          outputDimensionality: ZodOptional<ZodNumber>;
                          local: ZodOptional<
                            ZodObject<
                              {
                                modelPath: ZodOptional<ZodString>;
                                modelCacheDir: ZodOptional<ZodString>;
                                contextSize: ZodOptional<
                                  ZodUnion<readonly [ZodNumber, ZodLiteral<"auto">]>
                                >;
                              },
                              $strict
                            >
                          >;
                          store: ZodOptional<
                            ZodObject<
                              {
                                driver: ZodOptional<ZodLiteral<"sqlite">>;
                                fts: ZodOptional<
                                  ZodObject<
                                    {
                                      tokenizer: ZodOptional<
                                        ZodUnion<
                                          readonly [ZodLiteral<"unicode61">, ZodLiteral<"trigram">]
                                        >
                                      >;
                                    },
                                    $strict
                                  >
                                >;
                                vector: ZodOptional<
                                  ZodObject<
                                    {
                                      enabled: ZodOptional<ZodBoolean>;
                                      extensionPath: ZodOptional<ZodString>;
                                    },
                                    $strict
                                  >
                                >;
                              },
                              $strict
                            >
                          >;
                          chunking: ZodOptional<
                            ZodObject<
                              {
                                tokens: ZodOptional<ZodNumber>;
                                overlap: ZodOptional<ZodNumber>;
                              },
                              $strict
                            >
                          >;
                          sync: ZodOptional<
                            ZodObject<
                              {
                                onSessionStart: ZodOptional<ZodBoolean>;
                                onSearch: ZodOptional<ZodBoolean>;
                                watch: ZodOptional<ZodBoolean>;
                                watchDebounceMs: ZodOptional<ZodNumber>;
                                intervalMinutes: ZodOptional<ZodNumber>;
                                embeddingBatchTimeoutSeconds: ZodOptional<ZodNumber>;
                                sessions: ZodOptional<
                                  ZodObject<
                                    {
                                      deltaBytes: ZodOptional<ZodNumber>;
                                      deltaMessages: ZodOptional<ZodNumber>;
                                      postCompactionForce: ZodOptional<ZodBoolean>;
                                    },
                                    $strict
                                  >
                                >;
                              },
                              $strict
                            >
                          >;
                          query: ZodOptional<
                            ZodObject<
                              {
                                maxResults: ZodOptional<ZodNumber>;
                                minScore: ZodOptional<ZodNumber>;
                                hybrid: ZodOptional<
                                  ZodObject<
                                    {
                                      enabled: ZodOptional<ZodBoolean>;
                                      vectorWeight: ZodOptional<ZodNumber>;
                                      textWeight: ZodOptional<ZodNumber>;
                                      candidateMultiplier: ZodOptional<ZodNumber>;
                                      mmr: ZodOptional<
                                        ZodObject<
                                          {
                                            enabled: ZodOptional<ZodBoolean>;
                                            lambda: ZodOptional<ZodNumber>;
                                          },
                                          $strict
                                        >
                                      >;
                                      temporalDecay: ZodOptional<
                                        ZodObject<
                                          {
                                            enabled: ZodOptional<ZodBoolean>;
                                            halfLifeDays: ZodOptional<ZodNumber>;
                                          },
                                          $strict
                                        >
                                      >;
                                    },
                                    $strict
                                  >
                                >;
                              },
                              $strict
                            >
                          >;
                          cache: ZodOptional<
                            ZodObject<
                              {
                                enabled: ZodOptional<ZodBoolean>;
                                maxEntries: ZodOptional<ZodNumber>;
                              },
                              $strict
                            >
                          >;
                        },
                        $strict
                      >
                    >;
                    contextPruning: ZodOptional<
                      ZodObject<
                        {
                          mode: ZodOptional<
                            ZodUnion<readonly [ZodLiteral<"off">, ZodLiteral<"cache-ttl">]>
                          >;
                          ttl: ZodOptional<ZodString>;
                          keepLastAssistants: ZodOptional<ZodNumber>;
                          softTrimRatio: ZodOptional<ZodNumber>;
                          hardClearRatio: ZodOptional<ZodNumber>;
                          minPrunableToolChars: ZodOptional<ZodNumber>;
                          tools: ZodOptional<
                            ZodObject<
                              {
                                allow: ZodOptional<ZodArray<ZodString>>;
                                deny: ZodOptional<ZodArray<ZodString>>;
                              },
                              $strict
                            >
                          >;
                          softTrim: ZodOptional<
                            ZodObject<
                              {
                                maxChars: ZodOptional<ZodNumber>;
                                headChars: ZodOptional<ZodNumber>;
                                tailChars: ZodOptional<ZodNumber>;
                              },
                              $strict
                            >
                          >;
                          hardClear: ZodOptional<
                            ZodObject<
                              {
                                enabled: ZodOptional<ZodBoolean>;
                                placeholder: ZodOptional<ZodString>;
                              },
                              $strict
                            >
                          >;
                        },
                        $strict
                      >
                    >;
                    compaction: ZodOptional<
                      ZodObject<
                        {
                          mode: ZodOptional<
                            ZodUnion<readonly [ZodLiteral<"default">, ZodLiteral<"safeguard">]>
                          >;
                          provider: ZodOptional<ZodString>;
                          reserveTokens: ZodOptional<ZodNumber>;
                          keepRecentTokens: ZodOptional<ZodNumber>;
                          reserveTokensFloor: ZodOptional<ZodNumber>;
                          maxHistoryShare: ZodOptional<ZodNumber>;
                          customInstructions: ZodOptional<ZodString>;
                          identifierPolicy: ZodOptional<
                            ZodUnion<
                              readonly [
                                ZodLiteral<"strict">,
                                ZodLiteral<"off">,
                                ZodLiteral<"custom">,
                              ]
                            >
                          >;
                          identifierInstructions: ZodOptional<ZodString>;
                          recentTurnsPreserve: ZodOptional<ZodNumber>;
                          qualityGuard: ZodOptional<
                            ZodObject<
                              {
                                enabled: ZodOptional<ZodBoolean>;
                                maxRetries: ZodOptional<ZodNumber>;
                              },
                              $strict
                            >
                          >;
                          midTurnPrecheck: ZodOptional<
                            ZodObject<
                              {
                                enabled: ZodOptional<ZodBoolean>;
                              },
                              $strict
                            >
                          >;
                          postIndexSync: ZodOptional<
                            ZodEnum<{
                              off: "off";
                              async: "async";
                              await: "await";
                            }>
                          >;
                          postCompactionSections: ZodOptional<ZodArray<ZodString>>;
                          model: ZodOptional<ZodString>;
                          timeoutSeconds: ZodOptional<ZodNumber>;
                          memoryFlush: ZodOptional<
                            ZodObject<
                              {
                                enabled: ZodOptional<ZodBoolean>;
                                model: ZodOptional<ZodString>;
                                softThresholdTokens: ZodOptional<ZodNumber>;
                                forceFlushTranscriptBytes: ZodOptional<
                                  ZodUnion<readonly [ZodNumber, ZodString]>
                                >;
                                prompt: ZodOptional<ZodString>;
                                systemPrompt: ZodOptional<ZodString>;
                              },
                              $strict
                            >
                          >;
                          truncateAfterCompaction: ZodOptional<ZodBoolean>;
                          maxActiveTranscriptBytes: ZodOptional<
                            ZodUnion<readonly [ZodNumber, ZodString]>
                          >;
                          notifyUser: ZodOptional<ZodBoolean>;
                        },
                        $strict
                      >
                    >;
                    runRetries: ZodOptional<
                      ZodObject<
                        {
                          base: ZodOptional<ZodNumber>;
                          perProfile: ZodOptional<ZodNumber>;
                          min: ZodOptional<ZodNumber>;
                          max: ZodOptional<ZodNumber>;
                        },
                        $strict
                      >
                    >;
                    embeddedAgent: ZodOptional<
                      ZodObject<
                        {
                          projectSettingsPolicy: ZodOptional<
                            ZodUnion<
                              readonly [
                                ZodLiteral<"trusted">,
                                ZodLiteral<"sanitize">,
                                ZodLiteral<"ignore">,
                              ]
                            >
                          >;
                          executionContract: ZodOptional<
                            ZodUnion<readonly [ZodLiteral<"default">, ZodLiteral<"strict-agentic">]>
                          >;
                        },
                        $strict
                      >
                    >;
                    thinkingDefault: ZodOptional<
                      ZodUnion<
                        readonly [
                          ZodLiteral<"off">,
                          ZodLiteral<"minimal">,
                          ZodLiteral<"low">,
                          ZodLiteral<"medium">,
                          ZodLiteral<"high">,
                          ZodLiteral<"xhigh">,
                          ZodLiteral<"adaptive">,
                          ZodLiteral<"max">,
                          ZodLiteral<"ultra">,
                        ]
                      >
                    >;
                    verboseDefault: ZodOptional<
                      ZodUnion<readonly [ZodLiteral<"off">, ZodLiteral<"on">, ZodLiteral<"full">]>
                    >;
                    toolProgressDetail: ZodOptional<
                      ZodUnion<readonly [ZodLiteral<"explain">, ZodLiteral<"raw">]>
                    >;
                    reasoningDefault: ZodOptional<
                      ZodUnion<readonly [ZodLiteral<"off">, ZodLiteral<"on">, ZodLiteral<"stream">]>
                    >;
                    elevatedDefault: ZodOptional<
                      ZodUnion<
                        readonly [
                          ZodLiteral<"off">,
                          ZodLiteral<"on">,
                          ZodLiteral<"ask">,
                          ZodLiteral<"full">,
                        ]
                      >
                    >;
                    blockStreamingDefault: ZodOptional<
                      ZodUnion<readonly [ZodLiteral<"off">, ZodLiteral<"on">]>
                    >;
                    blockStreamingBreak: ZodOptional<
                      ZodUnion<readonly [ZodLiteral<"text_end">, ZodLiteral<"message_end">]>
                    >;
                    blockStreamingChunk: ZodOptional<
                      ZodObject<
                        {
                          minChars: ZodOptional<ZodNumber>;
                          maxChars: ZodOptional<ZodNumber>;
                          breakPreference: ZodOptional<
                            ZodUnion<
                              readonly [
                                ZodLiteral<"paragraph">,
                                ZodLiteral<"newline">,
                                ZodLiteral<"sentence">,
                              ]
                            >
                          >;
                        },
                        $strict
                      >
                    >;
                    blockStreamingCoalesce: ZodOptional<
                      ZodObject<
                        {
                          minChars: ZodOptional<ZodNumber>;
                          maxChars: ZodOptional<ZodNumber>;
                          idleMs: ZodOptional<ZodNumber>;
                        },
                        $strict
                      >
                    >;
                    humanDelay: ZodOptional<
                      ZodObject<
                        {
                          mode: ZodOptional<
                            ZodUnion<
                              readonly [
                                ZodLiteral<"off">,
                                ZodLiteral<"natural">,
                                ZodLiteral<"custom">,
                              ]
                            >
                          >;
                          minMs: ZodOptional<ZodNumber>;
                          maxMs: ZodOptional<ZodNumber>;
                        },
                        $strict
                      >
                    >;
                    timeoutSeconds: ZodOptional<ZodNumber>;
                    mediaMaxMb: ZodOptional<ZodNumber>;
                    imageMaxDimensionPx: ZodOptional<ZodNumber>;
                    imageQuality: ZodOptional<
                      ZodEnum<{
                        auto: "auto";
                        high: "high";
                        balanced: "balanced";
                        efficient: "efficient";
                      }>
                    >;
                    typingIntervalSeconds: ZodOptional<ZodNumber>;
                    typingMode: ZodOptional<
                      ZodUnion<
                        readonly [
                          ZodLiteral<"never">,
                          ZodLiteral<"instant">,
                          ZodLiteral<"thinking">,
                          ZodLiteral<"message">,
                        ]
                      >
                    >;
                    heartbeat: ZodOptional<
                      ZodObject<
                        {
                          every: ZodOptional<ZodString>;
                          activeHours: ZodOptional<
                            ZodObject<
                              {
                                start: ZodOptional<ZodString>;
                                end: ZodOptional<ZodString>;
                                timezone: ZodOptional<ZodString>;
                              },
                              $strict
                            >
                          >;
                          model: ZodOptional<ZodString>;
                          session: ZodOptional<ZodString>;
                          includeReasoning: ZodOptional<ZodBoolean>;
                          target: ZodOptional<ZodString>;
                          directPolicy: ZodOptional<
                            ZodUnion<readonly [ZodLiteral<"allow">, ZodLiteral<"block">]>
                          >;
                          to: ZodOptional<ZodString>;
                          accountId: ZodOptional<ZodString>;
                          prompt: ZodOptional<ZodString>;
                          includeSystemPromptSection: ZodOptional<ZodBoolean>;
                          ackMaxChars: ZodOptional<ZodNumber>;
                          suppressToolErrorWarnings: ZodOptional<ZodBoolean>;
                          timeoutSeconds: ZodOptional<ZodNumber>;
                          lightContext: ZodOptional<ZodBoolean>;
                          isolatedSession: ZodOptional<ZodBoolean>;
                          skipWhenBusy: ZodOptional<ZodBoolean>;
                        },
                        $strict
                      >
                    >;
                    maxConcurrent: ZodOptional<ZodNumber>;
                    subagents: ZodOptional<
                      ZodObject<
                        {
                          delegationMode: ZodOptional<
                            ZodEnum<{
                              prefer: "prefer";
                              suggest: "suggest";
                            }>
                          >;
                          allowAgents: ZodOptional<ZodArray<ZodString>>;
                          maxConcurrent: ZodOptional<ZodNumber>;
                          maxSpawnDepth: ZodOptional<ZodNumber>;
                          maxChildrenPerAgent: ZodOptional<ZodNumber>;
                          archiveAfterMinutes: ZodOptional<ZodNumber>;
                          model: ZodOptional<
                            ZodUnion<
                              readonly [
                                ZodString,
                                ZodObject<
                                  {
                                    primary: ZodOptional<ZodString>;
                                    fallbacks: ZodOptional<ZodArray<ZodString>>;
                                  },
                                  $strict
                                >,
                              ]
                            >
                          >;
                          thinking: ZodOptional<ZodString>;
                          runTimeoutSeconds: ZodOptional<ZodNumber>;
                          announceTimeoutMs: ZodOptional<ZodNumber>;
                          requireAgentId: ZodOptional<ZodBoolean>;
                        },
                        $strict
                      >
                    >;
                    sandbox: ZodOptional<
                      ZodObject<
                        {
                          mode: ZodOptional<
                            ZodUnion<
                              readonly [
                                ZodLiteral<"off">,
                                ZodLiteral<"non-main">,
                                ZodLiteral<"all">,
                              ]
                            >
                          >;
                          backend: ZodOptional<ZodString>;
                          workspaceAccess: ZodOptional<
                            ZodUnion<
                              readonly [ZodLiteral<"none">, ZodLiteral<"ro">, ZodLiteral<"rw">]
                            >
                          >;
                          sessionToolsVisibility: ZodOptional<
                            ZodUnion<readonly [ZodLiteral<"spawned">, ZodLiteral<"all">]>
                          >;
                          scope: ZodOptional<
                            ZodUnion<
                              readonly [
                                ZodLiteral<"session">,
                                ZodLiteral<"agent">,
                                ZodLiteral<"shared">,
                              ]
                            >
                          >;
                          workspaceRoot: ZodOptional<ZodString>;
                          docker: ZodOptional<
                            ZodObject<
                              {
                                image: ZodOptional<ZodString>;
                                containerPrefix: ZodOptional<ZodString>;
                                workdir: ZodOptional<ZodString>;
                                readOnlyRoot: ZodOptional<ZodBoolean>;
                                tmpfs: ZodOptional<ZodArray<ZodString>>;
                                network: ZodOptional<ZodString>;
                                runtime: ZodOptional<ZodString>;
                                user: ZodOptional<ZodString>;
                                capDrop: ZodOptional<ZodArray<ZodString>>;
                                env: ZodOptional<ZodRecord<ZodString, ZodString>>;
                                setupCommand: ZodOptional<
                                  ZodPipe<
                                    ZodPipe<
                                      ZodUnion<readonly [ZodString, ZodArray<ZodString>]>,
                                      ZodTransform<string, string | string[]>
                                    >,
                                    ZodString
                                  >
                                >;
                                pidsLimit: ZodOptional<ZodNumber>;
                                memory: ZodOptional<ZodUnion<readonly [ZodString, ZodNumber]>>;
                                memorySwap: ZodOptional<ZodUnion<readonly [ZodString, ZodNumber]>>;
                                cpus: ZodOptional<ZodNumber>;
                                gpus: ZodOptional<ZodString>;
                                ulimits: ZodOptional<
                                  ZodRecord<
                                    ZodString,
                                    ZodUnion<
                                      readonly [
                                        ZodString,
                                        ZodNumber,
                                        ZodObject<
                                          {
                                            soft: ZodOptional<ZodNumber>;
                                            hard: ZodOptional<ZodNumber>;
                                          },
                                          $strict
                                        >,
                                      ]
                                    >
                                  >
                                >;
                                seccompProfile: ZodOptional<ZodString>;
                                apparmorProfile: ZodOptional<ZodString>;
                                dns: ZodOptional<ZodArray<ZodString>>;
                                extraHosts: ZodOptional<ZodArray<ZodString>>;
                                ports: ZodOptional<ZodArray<ZodString>>;
                                binds: ZodOptional<ZodArray<ZodString>>;
                                dangerouslyAllowReservedContainerTargets: ZodOptional<ZodBoolean>;
                                dangerouslyAllowExternalBindSources: ZodOptional<ZodBoolean>;
                                dangerouslyAllowContainerNamespaceJoin: ZodOptional<ZodBoolean>;
                              },
                              $strict
                            >
                          >;
                          ssh: ZodOptional<
                            ZodObject<
                              {
                                target: ZodOptional<ZodString>;
                                command: ZodOptional<ZodString>;
                                workspaceRoot: ZodOptional<ZodString>;
                                strictHostKeyChecking: ZodOptional<ZodBoolean>;
                                updateHostKeys: ZodOptional<ZodBoolean>;
                                identityFile: ZodOptional<ZodString>;
                                certificateFile: ZodOptional<ZodString>;
                                knownHostsFile: ZodOptional<ZodString>;
                                identityData: ZodOptional<
                                  ZodUnion<
                                    readonly [
                                      ZodString,
                                      ZodDiscriminatedUnion<
                                        [
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"env">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"file">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"exec">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                        ],
                                        "source"
                                      >,
                                    ]
                                  >
                                >;
                                certificateData: ZodOptional<
                                  ZodUnion<
                                    readonly [
                                      ZodString,
                                      ZodDiscriminatedUnion<
                                        [
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"env">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"file">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"exec">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                        ],
                                        "source"
                                      >,
                                    ]
                                  >
                                >;
                                knownHostsData: ZodOptional<
                                  ZodUnion<
                                    readonly [
                                      ZodString,
                                      ZodDiscriminatedUnion<
                                        [
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"env">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"file">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"exec">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                        ],
                                        "source"
                                      >,
                                    ]
                                  >
                                >;
                              },
                              $strict
                            >
                          >;
                          browser: ZodOptional<
                            ZodObject<
                              {
                                enabled: ZodOptional<ZodBoolean>;
                                image: ZodOptional<ZodString>;
                                containerPrefix: ZodOptional<ZodString>;
                                network: ZodOptional<ZodString>;
                                cdpPort: ZodOptional<ZodNumber>;
                                cdpSourceRange: ZodOptional<ZodString>;
                                vncPort: ZodOptional<ZodNumber>;
                                noVncPort: ZodOptional<ZodNumber>;
                                headless: ZodOptional<ZodBoolean>;
                                enableNoVnc: ZodOptional<ZodBoolean>;
                                allowHostControl: ZodOptional<ZodBoolean>;
                                autoStart: ZodOptional<ZodBoolean>;
                                autoStartTimeoutMs: ZodOptional<ZodNumber>;
                                binds: ZodOptional<ZodArray<ZodString>>;
                              },
                              $strict
                            >
                          >;
                          prune: ZodOptional<
                            ZodObject<
                              {
                                idleHours: ZodOptional<ZodNumber>;
                                maxAgeDays: ZodOptional<ZodNumber>;
                              },
                              $strict
                            >
                          >;
                        },
                        $strict
                      >
                    >;
                  },
                  $strict
                >
              >
            >
          >;
          list: ZodOptional<
            ZodArray<
              ZodObject<
                {
                  id: ZodString;
                  default: ZodOptional<ZodBoolean>;
                  name: ZodOptional<ZodString>;
                  description: ZodOptional<ZodString>;
                  workspace: ZodOptional<ZodString>;
                  agentDir: ZodOptional<ZodString>;
                  model: ZodOptional<
                    ZodUnion<
                      readonly [
                        ZodString,
                        ZodObject<
                          {
                            primary: ZodOptional<ZodString>;
                            fallbacks: ZodOptional<ZodArray<ZodString>>;
                          },
                          $strict
                        >,
                      ]
                    >
                  >;
                  utilityModel: ZodOptional<ZodString>;
                  models: ZodOptional<
                    ZodRecord<
                      ZodString,
                      ZodObject<
                        {
                          alias: ZodOptional<ZodString>;
                          params: ZodOptional<ZodRecord<ZodString, ZodUnknown>>;
                          agentRuntime: ZodOptional<
                            ZodObject<
                              {
                                id: ZodOptional<ZodString>;
                              },
                              $strict
                            >
                          >;
                          streaming: ZodOptional<ZodBoolean>;
                        },
                        $strict
                      >
                    >
                  >;
                  thinkingDefault: ZodOptional<
                    ZodEnum<{
                      off: "off";
                      minimal: "minimal";
                      low: "low";
                      medium: "medium";
                      high: "high";
                      xhigh: "xhigh";
                      adaptive: "adaptive";
                      max: "max";
                      ultra: "ultra";
                    }>
                  >;
                  verboseDefault: ZodOptional<
                    ZodEnum<{
                      off: "off";
                      full: "full";
                      on: "on";
                    }>
                  >;
                  toolProgressDetail: ZodOptional<
                    ZodEnum<{
                      raw: "raw";
                      explain: "explain";
                    }>
                  >;
                  reasoningDefault: ZodOptional<
                    ZodEnum<{
                      off: "off";
                      on: "on";
                      stream: "stream";
                    }>
                  >;
                  fastModeDefault: ZodOptional<ZodUnion<readonly [ZodBoolean, ZodLiteral<"auto">]>>;
                  contextInjection: ZodOptional<
                    ZodUnion<
                      readonly [
                        ZodLiteral<"always">,
                        ZodLiteral<"continuation-skip">,
                        ZodLiteral<"never">,
                      ]
                    >
                  >;
                  bootstrapMaxChars: ZodOptional<ZodNumber>;
                  bootstrapTotalMaxChars: ZodOptional<ZodNumber>;
                  experimental: ZodOptional<
                    ZodObject<
                      {
                        localModelLean: ZodOptional<ZodBoolean>;
                      },
                      $strict
                    >
                  >;
                  skills: ZodOptional<ZodArray<ZodString>>;
                  memorySearch: ZodOptional<
                    ZodObject<
                      {
                        enabled: ZodOptional<ZodBoolean>;
                        sources: ZodOptional<
                          ZodArray<
                            ZodUnion<readonly [ZodLiteral<"memory">, ZodLiteral<"sessions">]>
                          >
                        >;
                        extraPaths: ZodOptional<ZodArray<ZodString>>;
                        qmd: ZodOptional<
                          ZodObject<
                            {
                              extraCollections: ZodOptional<
                                ZodArray<
                                  ZodObject<
                                    {
                                      path: ZodString;
                                      name: ZodOptional<ZodString>;
                                      pattern: ZodOptional<ZodString>;
                                    },
                                    $strict
                                  >
                                >
                              >;
                            },
                            $strict
                          >
                        >;
                        multimodal: ZodOptional<
                          ZodObject<
                            {
                              enabled: ZodOptional<ZodBoolean>;
                              modalities: ZodOptional<
                                ZodArray<
                                  ZodUnion<
                                    readonly [
                                      ZodLiteral<"image">,
                                      ZodLiteral<"audio">,
                                      ZodLiteral<"all">,
                                    ]
                                  >
                                >
                              >;
                              maxFileBytes: ZodOptional<ZodNumber>;
                            },
                            $strict
                          >
                        >;
                        experimental: ZodOptional<
                          ZodObject<
                            {
                              sessionMemory: ZodOptional<ZodBoolean>;
                            },
                            $strict
                          >
                        >;
                        provider: ZodOptional<ZodString>;
                        remote: ZodOptional<
                          ZodObject<
                            {
                              baseUrl: ZodOptional<ZodString>;
                              apiKey: ZodOptional<
                                ZodUnion<
                                  readonly [
                                    ZodString,
                                    ZodDiscriminatedUnion<
                                      [
                                        ZodObject<
                                          {
                                            source: ZodLiteral<"env">;
                                            provider: ZodString;
                                            id: ZodString;
                                          },
                                          $strict
                                        >,
                                        ZodObject<
                                          {
                                            source: ZodLiteral<"file">;
                                            provider: ZodString;
                                            id: ZodString;
                                          },
                                          $strict
                                        >,
                                        ZodObject<
                                          {
                                            source: ZodLiteral<"exec">;
                                            provider: ZodString;
                                            id: ZodString;
                                          },
                                          $strict
                                        >,
                                      ],
                                      "source"
                                    >,
                                  ]
                                >
                              >;
                              headers: ZodOptional<ZodRecord<ZodString, ZodString>>;
                              nonBatchConcurrency: ZodOptional<ZodNumber>;
                              batch: ZodOptional<
                                ZodObject<
                                  {
                                    enabled: ZodOptional<ZodBoolean>;
                                    wait: ZodOptional<ZodBoolean>;
                                    concurrency: ZodOptional<ZodNumber>;
                                    pollIntervalMs: ZodOptional<ZodNumber>;
                                    timeoutMinutes: ZodOptional<ZodNumber>;
                                  },
                                  $strict
                                >
                              >;
                            },
                            $strict
                          >
                        >;
                        fallback: ZodOptional<ZodString>;
                        model: ZodOptional<ZodString>;
                        inputType: ZodOptional<ZodString>;
                        queryInputType: ZodOptional<ZodString>;
                        documentInputType: ZodOptional<ZodString>;
                        outputDimensionality: ZodOptional<ZodNumber>;
                        local: ZodOptional<
                          ZodObject<
                            {
                              modelPath: ZodOptional<ZodString>;
                              modelCacheDir: ZodOptional<ZodString>;
                              contextSize: ZodOptional<
                                ZodUnion<readonly [ZodNumber, ZodLiteral<"auto">]>
                              >;
                            },
                            $strict
                          >
                        >;
                        store: ZodOptional<
                          ZodObject<
                            {
                              driver: ZodOptional<ZodLiteral<"sqlite">>;
                              fts: ZodOptional<
                                ZodObject<
                                  {
                                    tokenizer: ZodOptional<
                                      ZodUnion<
                                        readonly [ZodLiteral<"unicode61">, ZodLiteral<"trigram">]
                                      >
                                    >;
                                  },
                                  $strict
                                >
                              >;
                              vector: ZodOptional<
                                ZodObject<
                                  {
                                    enabled: ZodOptional<ZodBoolean>;
                                    extensionPath: ZodOptional<ZodString>;
                                  },
                                  $strict
                                >
                              >;
                            },
                            $strict
                          >
                        >;
                        chunking: ZodOptional<
                          ZodObject<
                            {
                              tokens: ZodOptional<ZodNumber>;
                              overlap: ZodOptional<ZodNumber>;
                            },
                            $strict
                          >
                        >;
                        sync: ZodOptional<
                          ZodObject<
                            {
                              onSessionStart: ZodOptional<ZodBoolean>;
                              onSearch: ZodOptional<ZodBoolean>;
                              watch: ZodOptional<ZodBoolean>;
                              watchDebounceMs: ZodOptional<ZodNumber>;
                              intervalMinutes: ZodOptional<ZodNumber>;
                              embeddingBatchTimeoutSeconds: ZodOptional<ZodNumber>;
                              sessions: ZodOptional<
                                ZodObject<
                                  {
                                    deltaBytes: ZodOptional<ZodNumber>;
                                    deltaMessages: ZodOptional<ZodNumber>;
                                    postCompactionForce: ZodOptional<ZodBoolean>;
                                  },
                                  $strict
                                >
                              >;
                            },
                            $strict
                          >
                        >;
                        query: ZodOptional<
                          ZodObject<
                            {
                              maxResults: ZodOptional<ZodNumber>;
                              minScore: ZodOptional<ZodNumber>;
                              hybrid: ZodOptional<
                                ZodObject<
                                  {
                                    enabled: ZodOptional<ZodBoolean>;
                                    vectorWeight: ZodOptional<ZodNumber>;
                                    textWeight: ZodOptional<ZodNumber>;
                                    candidateMultiplier: ZodOptional<ZodNumber>;
                                    mmr: ZodOptional<
                                      ZodObject<
                                        {
                                          enabled: ZodOptional<ZodBoolean>;
                                          lambda: ZodOptional<ZodNumber>;
                                        },
                                        $strict
                                      >
                                    >;
                                    temporalDecay: ZodOptional<
                                      ZodObject<
                                        {
                                          enabled: ZodOptional<ZodBoolean>;
                                          halfLifeDays: ZodOptional<ZodNumber>;
                                        },
                                        $strict
                                      >
                                    >;
                                  },
                                  $strict
                                >
                              >;
                            },
                            $strict
                          >
                        >;
                        cache: ZodOptional<
                          ZodObject<
                            {
                              enabled: ZodOptional<ZodBoolean>;
                              maxEntries: ZodOptional<ZodNumber>;
                            },
                            $strict
                          >
                        >;
                      },
                      $strict
                    >
                  >;
                  humanDelay: ZodOptional<
                    ZodObject<
                      {
                        mode: ZodOptional<
                          ZodUnion<
                            readonly [
                              ZodLiteral<"off">,
                              ZodLiteral<"natural">,
                              ZodLiteral<"custom">,
                            ]
                          >
                        >;
                        minMs: ZodOptional<ZodNumber>;
                        maxMs: ZodOptional<ZodNumber>;
                      },
                      $strict
                    >
                  >;
                  tts: ZodOptional<
                    ZodObject<
                      {
                        auto: ZodOptional<
                          ZodEnum<{
                            off: "off";
                            always: "always";
                            tagged: "tagged";
                            inbound: "inbound";
                          }>
                        >;
                        enabled: ZodOptional<ZodBoolean>;
                        mode: ZodOptional<
                          ZodEnum<{
                            all: "all";
                            final: "final";
                          }>
                        >;
                        provider: ZodOptional<ZodString>;
                        persona: ZodOptional<ZodString>;
                        personas: ZodOptional<
                          ZodRecord<
                            ZodString,
                            ZodObject<
                              {
                                label: ZodOptional<ZodString>;
                                description: ZodOptional<ZodString>;
                                provider: ZodOptional<ZodString>;
                                fallbackPolicy: ZodOptional<
                                  ZodUnion<
                                    readonly [
                                      ZodLiteral<"preserve-persona">,
                                      ZodLiteral<"provider-defaults">,
                                      ZodLiteral<"fail">,
                                    ]
                                  >
                                >;
                                prompt: ZodOptional<
                                  ZodObject<
                                    {
                                      profile: ZodOptional<ZodString>;
                                      scene: ZodOptional<ZodString>;
                                      sampleContext: ZodOptional<ZodString>;
                                      style: ZodOptional<ZodString>;
                                      accent: ZodOptional<ZodString>;
                                      pacing: ZodOptional<ZodString>;
                                      constraints: ZodOptional<ZodArray<ZodString>>;
                                    },
                                    $strict
                                  >
                                >;
                                providers: ZodOptional<
                                  ZodRecord<
                                    ZodString,
                                    ZodObject<
                                      {
                                        apiKey: ZodOptional<
                                          ZodUnion<
                                            readonly [
                                              ZodString,
                                              ZodDiscriminatedUnion<
                                                [
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"env">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"file">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"exec">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                ],
                                                "source"
                                              >,
                                            ]
                                          >
                                        >;
                                      },
                                      $catchall<
                                        ZodUnion<
                                          readonly [
                                            ZodString,
                                            ZodNumber,
                                            ZodBoolean,
                                            ZodNull,
                                            ZodArray<ZodUnknown>,
                                            ZodRecord<ZodString, ZodUnknown>,
                                          ]
                                        >
                                      >
                                    >
                                  >
                                >;
                              },
                              $strict
                            >
                          >
                        >;
                        summaryModel: ZodOptional<ZodString>;
                        modelOverrides: ZodOptional<
                          ZodObject<
                            {
                              enabled: ZodOptional<ZodBoolean>;
                              allowText: ZodOptional<ZodBoolean>;
                              allowProvider: ZodOptional<ZodBoolean>;
                              allowVoice: ZodOptional<ZodBoolean>;
                              allowModelId: ZodOptional<ZodBoolean>;
                              allowVoiceSettings: ZodOptional<ZodBoolean>;
                              allowNormalization: ZodOptional<ZodBoolean>;
                              allowSeed: ZodOptional<ZodBoolean>;
                            },
                            $strict
                          >
                        >;
                        providers: ZodOptional<
                          ZodRecord<
                            ZodString,
                            ZodObject<
                              {
                                apiKey: ZodOptional<
                                  ZodUnion<
                                    readonly [
                                      ZodString,
                                      ZodDiscriminatedUnion<
                                        [
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"env">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"file">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"exec">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                        ],
                                        "source"
                                      >,
                                    ]
                                  >
                                >;
                              },
                              $catchall<
                                ZodUnion<
                                  readonly [
                                    ZodString,
                                    ZodNumber,
                                    ZodBoolean,
                                    ZodNull,
                                    ZodArray<ZodUnknown>,
                                    ZodRecord<ZodString, ZodUnknown>,
                                  ]
                                >
                              >
                            >
                          >
                        >;
                        prefsPath: ZodOptional<ZodString>;
                        maxTextLength: ZodOptional<ZodNumber>;
                        timeoutMs: ZodOptional<ZodNumber>;
                      },
                      $strict
                    >
                  >;
                  skillsLimits: ZodOptional<
                    ZodObject<
                      {
                        maxSkillsPromptChars: ZodOptional<ZodNumber>;
                      },
                      $strict
                    >
                  >;
                  contextLimits: ZodOptional<
                    ZodObject<
                      {
                        memoryGetMaxChars: ZodOptional<ZodNumber>;
                        memoryGetDefaultLines: ZodOptional<ZodNumber>;
                        toolResultMaxChars: ZodOptional<ZodNumber>;
                        postCompactionMaxChars: ZodOptional<ZodNumber>;
                      },
                      $strict
                    >
                  >;
                  contextTokens: ZodOptional<ZodNumber>;
                  heartbeat: ZodOptional<
                    ZodObject<
                      {
                        every: ZodOptional<ZodString>;
                        activeHours: ZodOptional<
                          ZodObject<
                            {
                              start: ZodOptional<ZodString>;
                              end: ZodOptional<ZodString>;
                              timezone: ZodOptional<ZodString>;
                            },
                            $strict
                          >
                        >;
                        model: ZodOptional<ZodString>;
                        session: ZodOptional<ZodString>;
                        includeReasoning: ZodOptional<ZodBoolean>;
                        target: ZodOptional<ZodString>;
                        directPolicy: ZodOptional<
                          ZodUnion<readonly [ZodLiteral<"allow">, ZodLiteral<"block">]>
                        >;
                        to: ZodOptional<ZodString>;
                        accountId: ZodOptional<ZodString>;
                        prompt: ZodOptional<ZodString>;
                        includeSystemPromptSection: ZodOptional<ZodBoolean>;
                        ackMaxChars: ZodOptional<ZodNumber>;
                        suppressToolErrorWarnings: ZodOptional<ZodBoolean>;
                        timeoutSeconds: ZodOptional<ZodNumber>;
                        lightContext: ZodOptional<ZodBoolean>;
                        isolatedSession: ZodOptional<ZodBoolean>;
                        skipWhenBusy: ZodOptional<ZodBoolean>;
                      },
                      $strict
                    >
                  >;
                  identity: ZodOptional<
                    ZodObject<
                      {
                        name: ZodOptional<ZodString>;
                        theme: ZodOptional<ZodString>;
                        emoji: ZodOptional<ZodString>;
                        avatar: ZodOptional<ZodString>;
                      },
                      $strict
                    >
                  >;
                  groupChat: ZodOptional<
                    ZodObject<
                      {
                        mentionPatterns: ZodOptional<ZodArray<ZodString>>;
                        historyLimit: ZodOptional<ZodNumber>;
                        unmentionedInbound: ZodOptional<
                          ZodEnum<{
                            user_request: "user_request";
                            room_event: "room_event";
                          }>
                        >;
                        visibleReplies: ZodOptional<
                          ZodUnion<
                            readonly [
                              ZodEnum<{
                                automatic: "automatic";
                                message_tool: "message_tool";
                              }>,
                              ZodBoolean,
                            ]
                          >
                        >;
                      },
                      $strict
                    >
                  >;
                  subagents: ZodOptional<
                    ZodObject<
                      {
                        delegationMode: ZodOptional<
                          ZodEnum<{
                            prefer: "prefer";
                            suggest: "suggest";
                          }>
                        >;
                        allowAgents: ZodOptional<ZodArray<ZodString>>;
                        model: ZodOptional<
                          ZodUnion<
                            readonly [
                              ZodString,
                              ZodObject<
                                {
                                  primary: ZodOptional<ZodString>;
                                  fallbacks: ZodOptional<ZodArray<ZodString>>;
                                },
                                $strict
                              >,
                            ]
                          >
                        >;
                        thinking: ZodOptional<ZodString>;
                        requireAgentId: ZodOptional<ZodBoolean>;
                      },
                      $strict
                    >
                  >;
                  runRetries: ZodOptional<
                    ZodObject<
                      {
                        base: ZodOptional<ZodNumber>;
                        perProfile: ZodOptional<ZodNumber>;
                        min: ZodOptional<ZodNumber>;
                        max: ZodOptional<ZodNumber>;
                      },
                      $strict
                    >
                  >;
                  embeddedAgent: ZodOptional<
                    ZodObject<
                      {
                        executionContract: ZodOptional<
                          ZodUnion<readonly [ZodLiteral<"default">, ZodLiteral<"strict-agentic">]>
                        >;
                      },
                      $strict
                    >
                  >;
                  sandbox: ZodOptional<
                    ZodObject<
                      {
                        mode: ZodOptional<
                          ZodUnion<
                            readonly [ZodLiteral<"off">, ZodLiteral<"non-main">, ZodLiteral<"all">]
                          >
                        >;
                        backend: ZodOptional<ZodString>;
                        workspaceAccess: ZodOptional<
                          ZodUnion<
                            readonly [ZodLiteral<"none">, ZodLiteral<"ro">, ZodLiteral<"rw">]
                          >
                        >;
                        sessionToolsVisibility: ZodOptional<
                          ZodUnion<readonly [ZodLiteral<"spawned">, ZodLiteral<"all">]>
                        >;
                        scope: ZodOptional<
                          ZodUnion<
                            readonly [
                              ZodLiteral<"session">,
                              ZodLiteral<"agent">,
                              ZodLiteral<"shared">,
                            ]
                          >
                        >;
                        workspaceRoot: ZodOptional<ZodString>;
                        docker: ZodOptional<
                          ZodObject<
                            {
                              image: ZodOptional<ZodString>;
                              containerPrefix: ZodOptional<ZodString>;
                              workdir: ZodOptional<ZodString>;
                              readOnlyRoot: ZodOptional<ZodBoolean>;
                              tmpfs: ZodOptional<ZodArray<ZodString>>;
                              network: ZodOptional<ZodString>;
                              runtime: ZodOptional<ZodString>;
                              user: ZodOptional<ZodString>;
                              capDrop: ZodOptional<ZodArray<ZodString>>;
                              env: ZodOptional<ZodRecord<ZodString, ZodString>>;
                              setupCommand: ZodOptional<
                                ZodPipe<
                                  ZodPipe<
                                    ZodUnion<readonly [ZodString, ZodArray<ZodString>]>,
                                    ZodTransform<string, string | string[]>
                                  >,
                                  ZodString
                                >
                              >;
                              pidsLimit: ZodOptional<ZodNumber>;
                              memory: ZodOptional<ZodUnion<readonly [ZodString, ZodNumber]>>;
                              memorySwap: ZodOptional<ZodUnion<readonly [ZodString, ZodNumber]>>;
                              cpus: ZodOptional<ZodNumber>;
                              gpus: ZodOptional<ZodString>;
                              ulimits: ZodOptional<
                                ZodRecord<
                                  ZodString,
                                  ZodUnion<
                                    readonly [
                                      ZodString,
                                      ZodNumber,
                                      ZodObject<
                                        {
                                          soft: ZodOptional<ZodNumber>;
                                          hard: ZodOptional<ZodNumber>;
                                        },
                                        $strict
                                      >,
                                    ]
                                  >
                                >
                              >;
                              seccompProfile: ZodOptional<ZodString>;
                              apparmorProfile: ZodOptional<ZodString>;
                              dns: ZodOptional<ZodArray<ZodString>>;
                              extraHosts: ZodOptional<ZodArray<ZodString>>;
                              ports: ZodOptional<ZodArray<ZodString>>;
                              binds: ZodOptional<ZodArray<ZodString>>;
                              dangerouslyAllowReservedContainerTargets: ZodOptional<ZodBoolean>;
                              dangerouslyAllowExternalBindSources: ZodOptional<ZodBoolean>;
                              dangerouslyAllowContainerNamespaceJoin: ZodOptional<ZodBoolean>;
                            },
                            $strict
                          >
                        >;
                        ssh: ZodOptional<
                          ZodObject<
                            {
                              target: ZodOptional<ZodString>;
                              command: ZodOptional<ZodString>;
                              workspaceRoot: ZodOptional<ZodString>;
                              strictHostKeyChecking: ZodOptional<ZodBoolean>;
                              updateHostKeys: ZodOptional<ZodBoolean>;
                              identityFile: ZodOptional<ZodString>;
                              certificateFile: ZodOptional<ZodString>;
                              knownHostsFile: ZodOptional<ZodString>;
                              identityData: ZodOptional<
                                ZodUnion<
                                  readonly [
                                    ZodString,
                                    ZodDiscriminatedUnion<
                                      [
                                        ZodObject<
                                          {
                                            source: ZodLiteral<"env">;
                                            provider: ZodString;
                                            id: ZodString;
                                          },
                                          $strict
                                        >,
                                        ZodObject<
                                          {
                                            source: ZodLiteral<"file">;
                                            provider: ZodString;
                                            id: ZodString;
                                          },
                                          $strict
                                        >,
                                        ZodObject<
                                          {
                                            source: ZodLiteral<"exec">;
                                            provider: ZodString;
                                            id: ZodString;
                                          },
                                          $strict
                                        >,
                                      ],
                                      "source"
                                    >,
                                  ]
                                >
                              >;
                              certificateData: ZodOptional<
                                ZodUnion<
                                  readonly [
                                    ZodString,
                                    ZodDiscriminatedUnion<
                                      [
                                        ZodObject<
                                          {
                                            source: ZodLiteral<"env">;
                                            provider: ZodString;
                                            id: ZodString;
                                          },
                                          $strict
                                        >,
                                        ZodObject<
                                          {
                                            source: ZodLiteral<"file">;
                                            provider: ZodString;
                                            id: ZodString;
                                          },
                                          $strict
                                        >,
                                        ZodObject<
                                          {
                                            source: ZodLiteral<"exec">;
                                            provider: ZodString;
                                            id: ZodString;
                                          },
                                          $strict
                                        >,
                                      ],
                                      "source"
                                    >,
                                  ]
                                >
                              >;
                              knownHostsData: ZodOptional<
                                ZodUnion<
                                  readonly [
                                    ZodString,
                                    ZodDiscriminatedUnion<
                                      [
                                        ZodObject<
                                          {
                                            source: ZodLiteral<"env">;
                                            provider: ZodString;
                                            id: ZodString;
                                          },
                                          $strict
                                        >,
                                        ZodObject<
                                          {
                                            source: ZodLiteral<"file">;
                                            provider: ZodString;
                                            id: ZodString;
                                          },
                                          $strict
                                        >,
                                        ZodObject<
                                          {
                                            source: ZodLiteral<"exec">;
                                            provider: ZodString;
                                            id: ZodString;
                                          },
                                          $strict
                                        >,
                                      ],
                                      "source"
                                    >,
                                  ]
                                >
                              >;
                            },
                            $strict
                          >
                        >;
                        browser: ZodOptional<
                          ZodObject<
                            {
                              enabled: ZodOptional<ZodBoolean>;
                              image: ZodOptional<ZodString>;
                              containerPrefix: ZodOptional<ZodString>;
                              network: ZodOptional<ZodString>;
                              cdpPort: ZodOptional<ZodNumber>;
                              cdpSourceRange: ZodOptional<ZodString>;
                              vncPort: ZodOptional<ZodNumber>;
                              noVncPort: ZodOptional<ZodNumber>;
                              headless: ZodOptional<ZodBoolean>;
                              enableNoVnc: ZodOptional<ZodBoolean>;
                              allowHostControl: ZodOptional<ZodBoolean>;
                              autoStart: ZodOptional<ZodBoolean>;
                              autoStartTimeoutMs: ZodOptional<ZodNumber>;
                              binds: ZodOptional<ZodArray<ZodString>>;
                            },
                            $strict
                          >
                        >;
                        prune: ZodOptional<
                          ZodObject<
                            {
                              idleHours: ZodOptional<ZodNumber>;
                              maxAgeDays: ZodOptional<ZodNumber>;
                            },
                            $strict
                          >
                        >;
                      },
                      $strict
                    >
                  >;
                  params: ZodOptional<ZodRecord<ZodString, ZodUnknown>>;
                  tools: ZodOptional<
                    ZodObject<
                      {
                        codeMode: ZodOptional<
                          ZodUnion<
                            readonly [
                              ZodBoolean,
                              ZodObject<
                                {
                                  enabled: ZodOptional<ZodBoolean>;
                                  runtime: ZodOptional<ZodLiteral<"quickjs-wasi">>;
                                  mode: ZodOptional<ZodLiteral<"only">>;
                                  languages: ZodOptional<
                                    ZodArray<
                                      ZodEnum<{
                                        javascript: "javascript";
                                        typescript: "typescript";
                                      }>
                                    >
                                  >;
                                  timeoutMs: ZodOptional<ZodNumber>;
                                  memoryLimitBytes: ZodOptional<ZodNumber>;
                                  maxOutputBytes: ZodOptional<ZodNumber>;
                                  maxSnapshotBytes: ZodOptional<ZodNumber>;
                                  maxPendingToolCalls: ZodOptional<ZodNumber>;
                                  snapshotTtlSeconds: ZodOptional<ZodNumber>;
                                  searchDefaultLimit: ZodOptional<ZodNumber>;
                                  maxSearchLimit: ZodOptional<ZodNumber>;
                                },
                                $strict
                              >,
                            ]
                          >
                        >;
                        elevated: ZodOptional<
                          ZodObject<
                            {
                              enabled: ZodOptional<ZodBoolean>;
                              allowFrom: ZodOptional<
                                ZodRecord<
                                  ZodString,
                                  ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>
                                >
                              >;
                            },
                            $strict
                          >
                        >;
                        exec: ZodOptional<
                          ZodObject<
                            {
                              approvalRunningNoticeMs: ZodOptional<ZodNumber>;
                              host: ZodOptional<
                                ZodEnum<{
                                  node: "node";
                                  auto: "auto";
                                  gateway: "gateway";
                                  sandbox: "sandbox";
                                }>
                              >;
                              mode: ZodOptional<
                                ZodEnum<{
                                  full: "full";
                                  auto: "auto";
                                  deny: "deny";
                                  ask: "ask";
                                  allowlist: "allowlist";
                                }>
                              >;
                              security: ZodOptional<
                                ZodEnum<{
                                  full: "full";
                                  deny: "deny";
                                  allowlist: "allowlist";
                                }>
                              >;
                              ask: ZodOptional<
                                ZodEnum<{
                                  off: "off";
                                  always: "always";
                                  "on-miss": "on-miss";
                                }>
                              >;
                              node: ZodOptional<ZodString>;
                              pathPrepend: ZodOptional<ZodArray<ZodString>>;
                              safeBins: ZodOptional<ZodArray<ZodString>>;
                              strictInlineEval: ZodOptional<ZodBoolean>;
                              commandHighlighting: ZodOptional<ZodBoolean>;
                              safeBinTrustedDirs: ZodOptional<ZodArray<ZodString>>;
                              safeBinProfiles: ZodOptional<
                                ZodRecord<
                                  ZodString,
                                  ZodObject<
                                    {
                                      minPositional: ZodOptional<ZodNumber>;
                                      maxPositional: ZodOptional<ZodNumber>;
                                      allowedValueFlags: ZodOptional<ZodArray<ZodString>>;
                                      deniedFlags: ZodOptional<ZodArray<ZodString>>;
                                    },
                                    $strict
                                  >
                                >
                              >;
                              reviewer: ZodOptional<
                                ZodObject<
                                  {
                                    model: ZodOptional<
                                      ZodUnion<
                                        readonly [
                                          ZodString,
                                          ZodObject<
                                            {
                                              primary: ZodOptional<ZodString>;
                                              fallbacks: ZodOptional<ZodArray<ZodString>>;
                                            },
                                            $strict
                                          >,
                                        ]
                                      >
                                    >;
                                    timeoutMs: ZodOptional<ZodNumber>;
                                  },
                                  $strict
                                >
                              >;
                              backgroundMs: ZodOptional<ZodNumber>;
                              timeoutSec: ZodOptional<ZodNumber>;
                              cleanupMs: ZodOptional<ZodNumber>;
                              notifyOnExit: ZodOptional<ZodBoolean>;
                              notifyOnExitEmptySuccess: ZodOptional<ZodBoolean>;
                              applyPatch: ZodOptional<
                                ZodObject<
                                  {
                                    enabled: ZodOptional<ZodBoolean>;
                                    workspaceOnly: ZodOptional<ZodBoolean>;
                                    allowModels: ZodOptional<ZodArray<ZodString>>;
                                  },
                                  $strict
                                >
                              >;
                            },
                            $strict
                          >
                        >;
                        fs: ZodOptional<
                          ZodObject<
                            {
                              workspaceOnly: ZodOptional<ZodBoolean>;
                            },
                            $strict
                          >
                        >;
                        loopDetection: ZodOptional<
                          ZodObject<
                            {
                              enabled: ZodOptional<ZodBoolean>;
                              historySize: ZodOptional<ZodNumber>;
                              warningThreshold: ZodOptional<ZodNumber>;
                              unknownToolThreshold: ZodOptional<ZodNumber>;
                              criticalThreshold: ZodOptional<ZodNumber>;
                              globalCircuitBreakerThreshold: ZodOptional<ZodNumber>;
                              detectors: ZodOptional<
                                ZodObject<
                                  {
                                    genericRepeat: ZodOptional<ZodBoolean>;
                                    knownPollNoProgress: ZodOptional<ZodBoolean>;
                                    pingPong: ZodOptional<ZodBoolean>;
                                  },
                                  $strict
                                >
                              >;
                              postCompactionGuard: ZodOptional<
                                ZodObject<
                                  {
                                    windowSize: ZodOptional<ZodNumber>;
                                  },
                                  $strict
                                >
                              >;
                            },
                            $strict
                          >
                        >;
                        message: ZodOptional<
                          ZodObject<
                            {
                              allowCrossContextSend: ZodOptional<ZodBoolean>;
                              crossContext: ZodOptional<
                                ZodObject<
                                  {
                                    allowWithinProvider: ZodOptional<ZodBoolean>;
                                    allowAcrossProviders: ZodOptional<ZodBoolean>;
                                    marker: ZodOptional<
                                      ZodObject<
                                        {
                                          enabled: ZodOptional<ZodBoolean>;
                                          prefix: ZodOptional<ZodString>;
                                          suffix: ZodOptional<ZodString>;
                                        },
                                        $strict
                                      >
                                    >;
                                  },
                                  $strict
                                >
                              >;
                              actions: ZodOptional<
                                ZodObject<
                                  {
                                    allow: ZodOptional<ZodArray<ZodString>>;
                                  },
                                  $strict
                                >
                              >;
                              broadcast: ZodOptional<
                                ZodObject<
                                  {
                                    enabled: ZodOptional<ZodBoolean>;
                                  },
                                  $strict
                                >
                              >;
                            },
                            $strict
                          >
                        >;
                        sandbox: ZodOptional<
                          ZodObject<
                            {
                              tools: ZodOptional<
                                ZodObject<
                                  {
                                    allow: ZodOptional<ZodArray<ZodString>>;
                                    alsoAllow: ZodOptional<ZodArray<ZodString>>;
                                    deny: ZodOptional<ZodArray<ZodString>>;
                                  },
                                  $strict
                                >
                              >;
                            },
                            $strict
                          >
                        >;
                        profile: ZodOptional<
                          ZodUnion<
                            readonly [
                              ZodLiteral<"minimal">,
                              ZodLiteral<"coding">,
                              ZodLiteral<"messaging">,
                              ZodLiteral<"full">,
                            ]
                          >
                        >;
                        allow: ZodOptional<ZodArray<ZodString>>;
                        alsoAllow: ZodOptional<ZodArray<ZodString>>;
                        deny: ZodOptional<ZodArray<ZodString>>;
                        byProvider: ZodOptional<
                          ZodRecord<
                            ZodString,
                            ZodObject<
                              {
                                allow: ZodOptional<ZodArray<ZodString>>;
                                alsoAllow: ZodOptional<ZodArray<ZodString>>;
                                deny: ZodOptional<ZodArray<ZodString>>;
                                profile: ZodOptional<
                                  ZodUnion<
                                    readonly [
                                      ZodLiteral<"minimal">,
                                      ZodLiteral<"coding">,
                                      ZodLiteral<"messaging">,
                                      ZodLiteral<"full">,
                                    ]
                                  >
                                >;
                              },
                              $strict
                            >
                          >
                        >;
                        toolsBySender: ZodOptional<
                          ZodRecord<
                            ZodString,
                            ZodOptional<
                              ZodObject<
                                {
                                  allow: ZodOptional<ZodArray<ZodString>>;
                                  alsoAllow: ZodOptional<ZodArray<ZodString>>;
                                  deny: ZodOptional<ZodArray<ZodString>>;
                                },
                                $strict
                              >
                            >
                          >
                        >;
                      },
                      $strict
                    >
                  >;
                  runtime: ZodOptional<
                    ZodUnion<
                      readonly [
                        ZodObject<
                          {
                            type: ZodLiteral<"embedded">;
                          },
                          $strict
                        >,
                        ZodObject<
                          {
                            type: ZodLiteral<"acp">;
                            acp: ZodOptional<
                              ZodObject<
                                {
                                  agent: ZodOptional<ZodString>;
                                  backend: ZodOptional<ZodString>;
                                  mode: ZodOptional<
                                    ZodEnum<{
                                      persistent: "persistent";
                                      oneshot: "oneshot";
                                    }>
                                  >;
                                  cwd: ZodOptional<ZodString>;
                                },
                                $strict
                              >
                            >;
                          },
                          $strict
                        >,
                      ]
                    >
                  >;
                },
                $strict
              >
            >
          >;
        },
        $strict
      >
    >;
    tools: ZodOptional<
      ZodObject<
        {
          web: ZodOptional<
            ZodObject<
              {
                search: ZodOptional<
                  ZodPreprocess<
                    ZodObject<
                      {
                        enabled: ZodOptional<ZodBoolean>;
                        provider: ZodOptional<ZodString>;
                        maxResults: ZodOptional<ZodNumber>;
                        timeoutSeconds: ZodOptional<ZodNumber>;
                        cacheTtlMinutes: ZodOptional<ZodNumber>;
                        apiKey: ZodOptional<
                          ZodUnion<
                            readonly [
                              ZodString,
                              ZodDiscriminatedUnion<
                                [
                                  ZodObject<
                                    {
                                      source: ZodLiteral<"env">;
                                      provider: ZodString;
                                      id: ZodString;
                                    },
                                    $strict
                                  >,
                                  ZodObject<
                                    {
                                      source: ZodLiteral<"file">;
                                      provider: ZodString;
                                      id: ZodString;
                                    },
                                    $strict
                                  >,
                                  ZodObject<
                                    {
                                      source: ZodLiteral<"exec">;
                                      provider: ZodString;
                                      id: ZodString;
                                    },
                                    $strict
                                  >,
                                ],
                                "source"
                              >,
                            ]
                          >
                        >;
                        openaiCodex: ZodOptional<
                          ZodObject<
                            {
                              enabled: ZodOptional<ZodBoolean>;
                              mode: ZodOptional<
                                ZodUnion<readonly [ZodLiteral<"cached">, ZodLiteral<"live">]>
                              >;
                              allowedDomains: ZodOptional<
                                ZodPipe<
                                  ZodArray<ZodString>,
                                  ZodTransform<string[] | undefined, string[]>
                                >
                              >;
                              contextSize: ZodOptional<
                                ZodUnion<
                                  readonly [
                                    ZodLiteral<"low">,
                                    ZodLiteral<"medium">,
                                    ZodLiteral<"high">,
                                  ]
                                >
                              >;
                              userLocation: ZodOptional<
                                ZodPipe<
                                  ZodObject<
                                    {
                                      country: ZodOptional<
                                        ZodPipe<ZodString, ZodTransform<string | undefined, string>>
                                      >;
                                      region: ZodOptional<
                                        ZodPipe<ZodString, ZodTransform<string | undefined, string>>
                                      >;
                                      city: ZodOptional<
                                        ZodPipe<ZodString, ZodTransform<string | undefined, string>>
                                      >;
                                      timezone: ZodOptional<
                                        ZodPipe<ZodString, ZodTransform<string | undefined, string>>
                                      >;
                                    },
                                    $strict
                                  >,
                                  ZodTransform<
                                    | {
                                        country?: string | undefined;
                                        region?: string | undefined;
                                        city?: string | undefined;
                                        timezone?: string | undefined;
                                      }
                                    | undefined,
                                    {
                                      country?: string | undefined;
                                      region?: string | undefined;
                                      city?: string | undefined;
                                      timezone?: string | undefined;
                                    }
                                  >
                                >
                              >;
                            },
                            $strict
                          >
                        >;
                      },
                      $catchall<ZodUnknown>
                    >
                  >
                >;
                fetch: ZodOptional<
                  ZodObject<
                    {
                      enabled: ZodOptional<ZodBoolean>;
                      provider: ZodOptional<ZodString>;
                      maxChars: ZodOptional<ZodNumber>;
                      maxCharsCap: ZodOptional<ZodNumber>;
                      maxResponseBytes: ZodOptional<ZodNumber>;
                      timeoutSeconds: ZodOptional<ZodNumber>;
                      cacheTtlMinutes: ZodOptional<ZodNumber>;
                      maxRedirects: ZodOptional<ZodNumber>;
                      userAgent: ZodOptional<ZodString>;
                      readability: ZodOptional<ZodBoolean>;
                      useTrustedEnvProxy: ZodOptional<ZodBoolean>;
                      ssrfPolicy: ZodOptional<
                        ZodObject<
                          {
                            allowRfc2544BenchmarkRange: ZodOptional<ZodBoolean>;
                            allowIpv6UniqueLocalRange: ZodOptional<ZodBoolean>;
                          },
                          $strict
                        >
                      >;
                      firecrawl: ZodOptional<
                        ZodObject<
                          {
                            enabled: ZodOptional<ZodBoolean>;
                            apiKey: ZodOptional<
                              ZodUnion<
                                readonly [
                                  ZodString,
                                  ZodDiscriminatedUnion<
                                    [
                                      ZodObject<
                                        {
                                          source: ZodLiteral<"env">;
                                          provider: ZodString;
                                          id: ZodString;
                                        },
                                        $strict
                                      >,
                                      ZodObject<
                                        {
                                          source: ZodLiteral<"file">;
                                          provider: ZodString;
                                          id: ZodString;
                                        },
                                        $strict
                                      >,
                                      ZodObject<
                                        {
                                          source: ZodLiteral<"exec">;
                                          provider: ZodString;
                                          id: ZodString;
                                        },
                                        $strict
                                      >,
                                    ],
                                    "source"
                                  >,
                                ]
                              >
                            >;
                            baseUrl: ZodOptional<ZodString>;
                            onlyMainContent: ZodOptional<ZodBoolean>;
                            maxAgeMs: ZodOptional<ZodNumber>;
                            timeoutSeconds: ZodOptional<ZodNumber>;
                          },
                          $strict
                        >
                      >;
                    },
                    $strict
                  >
                >;
                x_search: ZodOptional<
                  ZodObject<
                    {
                      enabled: ZodOptional<ZodBoolean>;
                      model: ZodOptional<ZodString>;
                      inlineCitations: ZodOptional<ZodBoolean>;
                      maxTurns: ZodOptional<ZodNumber>;
                      timeoutSeconds: ZodOptional<ZodNumber>;
                      cacheTtlMinutes: ZodOptional<ZodNumber>;
                    },
                    $strict
                  >
                >;
              },
              $strict
            >
          >;
          media: ZodOptional<
            ZodObject<
              {
                models: ZodOptional<
                  ZodArray<
                    ZodOptional<
                      ZodObject<
                        {
                          profile: ZodOptional<ZodString>;
                          preferredProfile: ZodOptional<ZodString>;
                          prompt: ZodOptional<ZodString>;
                          timeoutSeconds: ZodOptional<ZodNumber>;
                          language: ZodOptional<ZodString>;
                          providerOptions: ZodOptional<
                            ZodRecord<
                              ZodString,
                              ZodRecord<
                                ZodString,
                                ZodUnion<readonly [ZodString, ZodNumber, ZodBoolean]>
                              >
                            >
                          >;
                          deepgram: ZodOptional<
                            ZodObject<
                              {
                                detectLanguage: ZodOptional<ZodBoolean>;
                                punctuate: ZodOptional<ZodBoolean>;
                                smartFormat: ZodOptional<ZodBoolean>;
                              },
                              $strict
                            >
                          >;
                          baseUrl: ZodOptional<ZodString>;
                          headers: ZodOptional<ZodRecord<ZodString, ZodString>>;
                          request: ZodOptional<
                            ZodObject<
                              {
                                headers: ZodOptional<
                                  ZodRecord<
                                    ZodString,
                                    ZodUnion<
                                      readonly [
                                        ZodString,
                                        ZodDiscriminatedUnion<
                                          [
                                            ZodObject<
                                              {
                                                source: ZodLiteral<"env">;
                                                provider: ZodString;
                                                id: ZodString;
                                              },
                                              $strict
                                            >,
                                            ZodObject<
                                              {
                                                source: ZodLiteral<"file">;
                                                provider: ZodString;
                                                id: ZodString;
                                              },
                                              $strict
                                            >,
                                            ZodObject<
                                              {
                                                source: ZodLiteral<"exec">;
                                                provider: ZodString;
                                                id: ZodString;
                                              },
                                              $strict
                                            >,
                                          ],
                                          "source"
                                        >,
                                      ]
                                    >
                                  >
                                >;
                                auth: ZodOptional<
                                  ZodUnion<
                                    readonly [
                                      ZodObject<
                                        {
                                          mode: ZodLiteral<"provider-default">;
                                        },
                                        $strict
                                      >,
                                      ZodObject<
                                        {
                                          mode: ZodLiteral<"authorization-bearer">;
                                          token: ZodUnion<
                                            readonly [
                                              ZodString,
                                              ZodDiscriminatedUnion<
                                                [
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"env">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"file">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"exec">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                ],
                                                "source"
                                              >,
                                            ]
                                          >;
                                        },
                                        $strict
                                      >,
                                      ZodObject<
                                        {
                                          mode: ZodLiteral<"header">;
                                          headerName: ZodString;
                                          value: ZodUnion<
                                            readonly [
                                              ZodString,
                                              ZodDiscriminatedUnion<
                                                [
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"env">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"file">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                  ZodObject<
                                                    {
                                                      source: ZodLiteral<"exec">;
                                                      provider: ZodString;
                                                      id: ZodString;
                                                    },
                                                    $strict
                                                  >,
                                                ],
                                                "source"
                                              >,
                                            ]
                                          >;
                                          prefix: ZodOptional<ZodString>;
                                        },
                                        $strict
                                      >,
                                    ]
                                  >
                                >;
                                proxy: ZodOptional<
                                  ZodUnion<
                                    readonly [
                                      ZodObject<
                                        {
                                          mode: ZodLiteral<"env-proxy">;
                                          tls: ZodOptional<
                                            ZodObject<
                                              {
                                                ca: ZodOptional<
                                                  ZodUnion<
                                                    readonly [
                                                      ZodString,
                                                      ZodDiscriminatedUnion<
                                                        [
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"env">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"file">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"exec">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                        ],
                                                        "source"
                                                      >,
                                                    ]
                                                  >
                                                >;
                                                cert: ZodOptional<
                                                  ZodUnion<
                                                    readonly [
                                                      ZodString,
                                                      ZodDiscriminatedUnion<
                                                        [
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"env">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"file">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"exec">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                        ],
                                                        "source"
                                                      >,
                                                    ]
                                                  >
                                                >;
                                                key: ZodOptional<
                                                  ZodUnion<
                                                    readonly [
                                                      ZodString,
                                                      ZodDiscriminatedUnion<
                                                        [
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"env">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"file">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"exec">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                        ],
                                                        "source"
                                                      >,
                                                    ]
                                                  >
                                                >;
                                                passphrase: ZodOptional<
                                                  ZodUnion<
                                                    readonly [
                                                      ZodString,
                                                      ZodDiscriminatedUnion<
                                                        [
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"env">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"file">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"exec">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                        ],
                                                        "source"
                                                      >,
                                                    ]
                                                  >
                                                >;
                                                serverName: ZodOptional<ZodString>;
                                                insecureSkipVerify: ZodOptional<ZodBoolean>;
                                              },
                                              $strict
                                            >
                                          >;
                                        },
                                        $strict
                                      >,
                                      ZodObject<
                                        {
                                          mode: ZodLiteral<"explicit-proxy">;
                                          url: ZodString;
                                          tls: ZodOptional<
                                            ZodObject<
                                              {
                                                ca: ZodOptional<
                                                  ZodUnion<
                                                    readonly [
                                                      ZodString,
                                                      ZodDiscriminatedUnion<
                                                        [
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"env">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"file">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"exec">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                        ],
                                                        "source"
                                                      >,
                                                    ]
                                                  >
                                                >;
                                                cert: ZodOptional<
                                                  ZodUnion<
                                                    readonly [
                                                      ZodString,
                                                      ZodDiscriminatedUnion<
                                                        [
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"env">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"file">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"exec">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                        ],
                                                        "source"
                                                      >,
                                                    ]
                                                  >
                                                >;
                                                key: ZodOptional<
                                                  ZodUnion<
                                                    readonly [
                                                      ZodString,
                                                      ZodDiscriminatedUnion<
                                                        [
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"env">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"file">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"exec">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                        ],
                                                        "source"
                                                      >,
                                                    ]
                                                  >
                                                >;
                                                passphrase: ZodOptional<
                                                  ZodUnion<
                                                    readonly [
                                                      ZodString,
                                                      ZodDiscriminatedUnion<
                                                        [
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"env">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"file">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"exec">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                        ],
                                                        "source"
                                                      >,
                                                    ]
                                                  >
                                                >;
                                                serverName: ZodOptional<ZodString>;
                                                insecureSkipVerify: ZodOptional<ZodBoolean>;
                                              },
                                              $strict
                                            >
                                          >;
                                        },
                                        $strict
                                      >,
                                    ]
                                  >
                                >;
                                tls: ZodOptional<
                                  ZodObject<
                                    {
                                      ca: ZodOptional<
                                        ZodUnion<
                                          readonly [
                                            ZodString,
                                            ZodDiscriminatedUnion<
                                              [
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"env">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"file">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"exec">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                              ],
                                              "source"
                                            >,
                                          ]
                                        >
                                      >;
                                      cert: ZodOptional<
                                        ZodUnion<
                                          readonly [
                                            ZodString,
                                            ZodDiscriminatedUnion<
                                              [
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"env">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"file">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"exec">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                              ],
                                              "source"
                                            >,
                                          ]
                                        >
                                      >;
                                      key: ZodOptional<
                                        ZodUnion<
                                          readonly [
                                            ZodString,
                                            ZodDiscriminatedUnion<
                                              [
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"env">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"file">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"exec">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                              ],
                                              "source"
                                            >,
                                          ]
                                        >
                                      >;
                                      passphrase: ZodOptional<
                                        ZodUnion<
                                          readonly [
                                            ZodString,
                                            ZodDiscriminatedUnion<
                                              [
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"env">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"file">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"exec">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                              ],
                                              "source"
                                            >,
                                          ]
                                        >
                                      >;
                                      serverName: ZodOptional<ZodString>;
                                      insecureSkipVerify: ZodOptional<ZodBoolean>;
                                    },
                                    $strict
                                  >
                                >;
                              },
                              $strict
                            >
                          >;
                          provider: ZodOptional<ZodString>;
                          model: ZodOptional<ZodString>;
                          capabilities: ZodOptional<
                            ZodArray<
                              ZodUnion<
                                readonly [
                                  ZodLiteral<"image">,
                                  ZodLiteral<"audio">,
                                  ZodLiteral<"video">,
                                ]
                              >
                            >
                          >;
                          type: ZodOptional<
                            ZodUnion<readonly [ZodLiteral<"provider">, ZodLiteral<"cli">]>
                          >;
                          command: ZodOptional<ZodString>;
                          args: ZodOptional<ZodArray<ZodString>>;
                          maxChars: ZodOptional<ZodNumber>;
                          maxBytes: ZodOptional<ZodNumber>;
                        },
                        $strict
                      >
                    >
                  >
                >;
                concurrency: ZodOptional<ZodNumber>;
                asyncCompletion: ZodOptional<
                  ZodObject<
                    {
                      directSend: ZodOptional<ZodBoolean>;
                    },
                    $strict
                  >
                >;
                image: ZodOptional<
                  ZodOptional<
                    ZodObject<
                      {
                        attachments: ZodOptional<
                          ZodObject<
                            {
                              mode: ZodOptional<
                                ZodUnion<readonly [ZodLiteral<"first">, ZodLiteral<"all">]>
                              >;
                              maxAttachments: ZodOptional<ZodNumber>;
                              prefer: ZodOptional<
                                ZodUnion<
                                  readonly [
                                    ZodLiteral<"first">,
                                    ZodLiteral<"last">,
                                    ZodLiteral<"path">,
                                    ZodLiteral<"url">,
                                  ]
                                >
                              >;
                            },
                            $strict
                          >
                        >;
                        models: ZodOptional<
                          ZodArray<
                            ZodOptional<
                              ZodObject<
                                {
                                  profile: ZodOptional<ZodString>;
                                  preferredProfile: ZodOptional<ZodString>;
                                  prompt: ZodOptional<ZodString>;
                                  timeoutSeconds: ZodOptional<ZodNumber>;
                                  language: ZodOptional<ZodString>;
                                  providerOptions: ZodOptional<
                                    ZodRecord<
                                      ZodString,
                                      ZodRecord<
                                        ZodString,
                                        ZodUnion<readonly [ZodString, ZodNumber, ZodBoolean]>
                                      >
                                    >
                                  >;
                                  deepgram: ZodOptional<
                                    ZodObject<
                                      {
                                        detectLanguage: ZodOptional<ZodBoolean>;
                                        punctuate: ZodOptional<ZodBoolean>;
                                        smartFormat: ZodOptional<ZodBoolean>;
                                      },
                                      $strict
                                    >
                                  >;
                                  baseUrl: ZodOptional<ZodString>;
                                  headers: ZodOptional<ZodRecord<ZodString, ZodString>>;
                                  request: ZodOptional<
                                    ZodObject<
                                      {
                                        headers: ZodOptional<
                                          ZodRecord<
                                            ZodString,
                                            ZodUnion<
                                              readonly [
                                                ZodString,
                                                ZodDiscriminatedUnion<
                                                  [
                                                    ZodObject<
                                                      {
                                                        source: ZodLiteral<"env">;
                                                        provider: ZodString;
                                                        id: ZodString;
                                                      },
                                                      $strict
                                                    >,
                                                    ZodObject<
                                                      {
                                                        source: ZodLiteral<"file">;
                                                        provider: ZodString;
                                                        id: ZodString;
                                                      },
                                                      $strict
                                                    >,
                                                    ZodObject<
                                                      {
                                                        source: ZodLiteral<"exec">;
                                                        provider: ZodString;
                                                        id: ZodString;
                                                      },
                                                      $strict
                                                    >,
                                                  ],
                                                  "source"
                                                >,
                                              ]
                                            >
                                          >
                                        >;
                                        auth: ZodOptional<
                                          ZodUnion<
                                            readonly [
                                              ZodObject<
                                                {
                                                  mode: ZodLiteral<"provider-default">;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  mode: ZodLiteral<"authorization-bearer">;
                                                  token: ZodUnion<
                                                    readonly [
                                                      ZodString,
                                                      ZodDiscriminatedUnion<
                                                        [
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"env">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"file">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"exec">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                        ],
                                                        "source"
                                                      >,
                                                    ]
                                                  >;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  mode: ZodLiteral<"header">;
                                                  headerName: ZodString;
                                                  value: ZodUnion<
                                                    readonly [
                                                      ZodString,
                                                      ZodDiscriminatedUnion<
                                                        [
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"env">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"file">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"exec">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                        ],
                                                        "source"
                                                      >,
                                                    ]
                                                  >;
                                                  prefix: ZodOptional<ZodString>;
                                                },
                                                $strict
                                              >,
                                            ]
                                          >
                                        >;
                                        proxy: ZodOptional<
                                          ZodUnion<
                                            readonly [
                                              ZodObject<
                                                {
                                                  mode: ZodLiteral<"env-proxy">;
                                                  tls: ZodOptional<
                                                    ZodObject<
                                                      {
                                                        ca: ZodOptional<
                                                          ZodUnion<
                                                            readonly [
                                                              ZodString,
                                                              ZodDiscriminatedUnion<
                                                                [
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"env">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"file">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"exec">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                ],
                                                                "source"
                                                              >,
                                                            ]
                                                          >
                                                        >;
                                                        cert: ZodOptional<
                                                          ZodUnion<
                                                            readonly [
                                                              ZodString,
                                                              ZodDiscriminatedUnion<
                                                                [
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"env">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"file">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"exec">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                ],
                                                                "source"
                                                              >,
                                                            ]
                                                          >
                                                        >;
                                                        key: ZodOptional<
                                                          ZodUnion<
                                                            readonly [
                                                              ZodString,
                                                              ZodDiscriminatedUnion<
                                                                [
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"env">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"file">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"exec">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                ],
                                                                "source"
                                                              >,
                                                            ]
                                                          >
                                                        >;
                                                        passphrase: ZodOptional<
                                                          ZodUnion<
                                                            readonly [
                                                              ZodString,
                                                              ZodDiscriminatedUnion<
                                                                [
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"env">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"file">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"exec">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                ],
                                                                "source"
                                                              >,
                                                            ]
                                                          >
                                                        >;
                                                        serverName: ZodOptional<ZodString>;
                                                        insecureSkipVerify: ZodOptional<ZodBoolean>;
                                                      },
                                                      $strict
                                                    >
                                                  >;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  mode: ZodLiteral<"explicit-proxy">;
                                                  url: ZodString;
                                                  tls: ZodOptional<
                                                    ZodObject<
                                                      {
                                                        ca: ZodOptional<
                                                          ZodUnion<
                                                            readonly [
                                                              ZodString,
                                                              ZodDiscriminatedUnion<
                                                                [
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"env">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"file">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"exec">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                ],
                                                                "source"
                                                              >,
                                                            ]
                                                          >
                                                        >;
                                                        cert: ZodOptional<
                                                          ZodUnion<
                                                            readonly [
                                                              ZodString,
                                                              ZodDiscriminatedUnion<
                                                                [
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"env">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"file">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"exec">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                ],
                                                                "source"
                                                              >,
                                                            ]
                                                          >
                                                        >;
                                                        key: ZodOptional<
                                                          ZodUnion<
                                                            readonly [
                                                              ZodString,
                                                              ZodDiscriminatedUnion<
                                                                [
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"env">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"file">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"exec">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                ],
                                                                "source"
                                                              >,
                                                            ]
                                                          >
                                                        >;
                                                        passphrase: ZodOptional<
                                                          ZodUnion<
                                                            readonly [
                                                              ZodString,
                                                              ZodDiscriminatedUnion<
                                                                [
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"env">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"file">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"exec">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                ],
                                                                "source"
                                                              >,
                                                            ]
                                                          >
                                                        >;
                                                        serverName: ZodOptional<ZodString>;
                                                        insecureSkipVerify: ZodOptional<ZodBoolean>;
                                                      },
                                                      $strict
                                                    >
                                                  >;
                                                },
                                                $strict
                                              >,
                                            ]
                                          >
                                        >;
                                        tls: ZodOptional<
                                          ZodObject<
                                            {
                                              ca: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              cert: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              key: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              passphrase: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              serverName: ZodOptional<ZodString>;
                                              insecureSkipVerify: ZodOptional<ZodBoolean>;
                                            },
                                            $strict
                                          >
                                        >;
                                      },
                                      $strict
                                    >
                                  >;
                                  provider: ZodOptional<ZodString>;
                                  model: ZodOptional<ZodString>;
                                  capabilities: ZodOptional<
                                    ZodArray<
                                      ZodUnion<
                                        readonly [
                                          ZodLiteral<"image">,
                                          ZodLiteral<"audio">,
                                          ZodLiteral<"video">,
                                        ]
                                      >
                                    >
                                  >;
                                  type: ZodOptional<
                                    ZodUnion<readonly [ZodLiteral<"provider">, ZodLiteral<"cli">]>
                                  >;
                                  command: ZodOptional<ZodString>;
                                  args: ZodOptional<ZodArray<ZodString>>;
                                  maxChars: ZodOptional<ZodNumber>;
                                  maxBytes: ZodOptional<ZodNumber>;
                                },
                                $strict
                              >
                            >
                          >
                        >;
                        echoTranscript: ZodOptional<ZodBoolean>;
                        echoFormat: ZodOptional<ZodString>;
                        prompt: ZodOptional<ZodString>;
                        timeoutSeconds: ZodOptional<ZodNumber>;
                        language: ZodOptional<ZodString>;
                        providerOptions: ZodOptional<
                          ZodRecord<
                            ZodString,
                            ZodRecord<
                              ZodString,
                              ZodUnion<readonly [ZodString, ZodNumber, ZodBoolean]>
                            >
                          >
                        >;
                        deepgram: ZodOptional<
                          ZodObject<
                            {
                              detectLanguage: ZodOptional<ZodBoolean>;
                              punctuate: ZodOptional<ZodBoolean>;
                              smartFormat: ZodOptional<ZodBoolean>;
                            },
                            $strict
                          >
                        >;
                        baseUrl: ZodOptional<ZodString>;
                        headers: ZodOptional<ZodRecord<ZodString, ZodString>>;
                        request: ZodOptional<
                          ZodObject<
                            {
                              headers: ZodOptional<
                                ZodRecord<
                                  ZodString,
                                  ZodUnion<
                                    readonly [
                                      ZodString,
                                      ZodDiscriminatedUnion<
                                        [
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"env">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"file">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"exec">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                        ],
                                        "source"
                                      >,
                                    ]
                                  >
                                >
                              >;
                              auth: ZodOptional<
                                ZodUnion<
                                  readonly [
                                    ZodObject<
                                      {
                                        mode: ZodLiteral<"provider-default">;
                                      },
                                      $strict
                                    >,
                                    ZodObject<
                                      {
                                        mode: ZodLiteral<"authorization-bearer">;
                                        token: ZodUnion<
                                          readonly [
                                            ZodString,
                                            ZodDiscriminatedUnion<
                                              [
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"env">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"file">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"exec">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                              ],
                                              "source"
                                            >,
                                          ]
                                        >;
                                      },
                                      $strict
                                    >,
                                    ZodObject<
                                      {
                                        mode: ZodLiteral<"header">;
                                        headerName: ZodString;
                                        value: ZodUnion<
                                          readonly [
                                            ZodString,
                                            ZodDiscriminatedUnion<
                                              [
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"env">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"file">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"exec">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                              ],
                                              "source"
                                            >,
                                          ]
                                        >;
                                        prefix: ZodOptional<ZodString>;
                                      },
                                      $strict
                                    >,
                                  ]
                                >
                              >;
                              proxy: ZodOptional<
                                ZodUnion<
                                  readonly [
                                    ZodObject<
                                      {
                                        mode: ZodLiteral<"env-proxy">;
                                        tls: ZodOptional<
                                          ZodObject<
                                            {
                                              ca: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              cert: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              key: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              passphrase: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              serverName: ZodOptional<ZodString>;
                                              insecureSkipVerify: ZodOptional<ZodBoolean>;
                                            },
                                            $strict
                                          >
                                        >;
                                      },
                                      $strict
                                    >,
                                    ZodObject<
                                      {
                                        mode: ZodLiteral<"explicit-proxy">;
                                        url: ZodString;
                                        tls: ZodOptional<
                                          ZodObject<
                                            {
                                              ca: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              cert: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              key: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              passphrase: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              serverName: ZodOptional<ZodString>;
                                              insecureSkipVerify: ZodOptional<ZodBoolean>;
                                            },
                                            $strict
                                          >
                                        >;
                                      },
                                      $strict
                                    >,
                                  ]
                                >
                              >;
                              tls: ZodOptional<
                                ZodObject<
                                  {
                                    ca: ZodOptional<
                                      ZodUnion<
                                        readonly [
                                          ZodString,
                                          ZodDiscriminatedUnion<
                                            [
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"env">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"file">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"exec">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                            ],
                                            "source"
                                          >,
                                        ]
                                      >
                                    >;
                                    cert: ZodOptional<
                                      ZodUnion<
                                        readonly [
                                          ZodString,
                                          ZodDiscriminatedUnion<
                                            [
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"env">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"file">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"exec">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                            ],
                                            "source"
                                          >,
                                        ]
                                      >
                                    >;
                                    key: ZodOptional<
                                      ZodUnion<
                                        readonly [
                                          ZodString,
                                          ZodDiscriminatedUnion<
                                            [
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"env">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"file">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"exec">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                            ],
                                            "source"
                                          >,
                                        ]
                                      >
                                    >;
                                    passphrase: ZodOptional<
                                      ZodUnion<
                                        readonly [
                                          ZodString,
                                          ZodDiscriminatedUnion<
                                            [
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"env">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"file">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"exec">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                            ],
                                            "source"
                                          >,
                                        ]
                                      >
                                    >;
                                    serverName: ZodOptional<ZodString>;
                                    insecureSkipVerify: ZodOptional<ZodBoolean>;
                                  },
                                  $strict
                                >
                              >;
                            },
                            $strict
                          >
                        >;
                        enabled: ZodOptional<ZodBoolean>;
                        scope: ZodOptional<
                          ZodObject<
                            {
                              default: ZodOptional<
                                ZodUnion<readonly [ZodLiteral<"allow">, ZodLiteral<"deny">]>
                              >;
                              rules: ZodOptional<
                                ZodArray<
                                  ZodObject<
                                    {
                                      action: ZodUnion<
                                        readonly [ZodLiteral<"allow">, ZodLiteral<"deny">]
                                      >;
                                      match: ZodOptional<
                                        ZodObject<
                                          {
                                            channel: ZodOptional<ZodString>;
                                            chatType: ZodOptional<
                                              ZodUnion<
                                                readonly [
                                                  ZodLiteral<"direct">,
                                                  ZodLiteral<"group">,
                                                  ZodLiteral<"channel">,
                                                  ZodLiteral<"dm">,
                                                ]
                                              >
                                            >;
                                            keyPrefix: ZodOptional<ZodString>;
                                            rawKeyPrefix: ZodOptional<ZodString>;
                                          },
                                          $strict
                                        >
                                      >;
                                    },
                                    $strict
                                  >
                                >
                              >;
                            },
                            $strict
                          >
                        >;
                        maxBytes: ZodOptional<ZodNumber>;
                        maxChars: ZodOptional<ZodNumber>;
                      },
                      $strict
                    >
                  >
                >;
                audio: ZodOptional<
                  ZodOptional<
                    ZodObject<
                      {
                        attachments: ZodOptional<
                          ZodObject<
                            {
                              mode: ZodOptional<
                                ZodUnion<readonly [ZodLiteral<"first">, ZodLiteral<"all">]>
                              >;
                              maxAttachments: ZodOptional<ZodNumber>;
                              prefer: ZodOptional<
                                ZodUnion<
                                  readonly [
                                    ZodLiteral<"first">,
                                    ZodLiteral<"last">,
                                    ZodLiteral<"path">,
                                    ZodLiteral<"url">,
                                  ]
                                >
                              >;
                            },
                            $strict
                          >
                        >;
                        models: ZodOptional<
                          ZodArray<
                            ZodOptional<
                              ZodObject<
                                {
                                  profile: ZodOptional<ZodString>;
                                  preferredProfile: ZodOptional<ZodString>;
                                  prompt: ZodOptional<ZodString>;
                                  timeoutSeconds: ZodOptional<ZodNumber>;
                                  language: ZodOptional<ZodString>;
                                  providerOptions: ZodOptional<
                                    ZodRecord<
                                      ZodString,
                                      ZodRecord<
                                        ZodString,
                                        ZodUnion<readonly [ZodString, ZodNumber, ZodBoolean]>
                                      >
                                    >
                                  >;
                                  deepgram: ZodOptional<
                                    ZodObject<
                                      {
                                        detectLanguage: ZodOptional<ZodBoolean>;
                                        punctuate: ZodOptional<ZodBoolean>;
                                        smartFormat: ZodOptional<ZodBoolean>;
                                      },
                                      $strict
                                    >
                                  >;
                                  baseUrl: ZodOptional<ZodString>;
                                  headers: ZodOptional<ZodRecord<ZodString, ZodString>>;
                                  request: ZodOptional<
                                    ZodObject<
                                      {
                                        headers: ZodOptional<
                                          ZodRecord<
                                            ZodString,
                                            ZodUnion<
                                              readonly [
                                                ZodString,
                                                ZodDiscriminatedUnion<
                                                  [
                                                    ZodObject<
                                                      {
                                                        source: ZodLiteral<"env">;
                                                        provider: ZodString;
                                                        id: ZodString;
                                                      },
                                                      $strict
                                                    >,
                                                    ZodObject<
                                                      {
                                                        source: ZodLiteral<"file">;
                                                        provider: ZodString;
                                                        id: ZodString;
                                                      },
                                                      $strict
                                                    >,
                                                    ZodObject<
                                                      {
                                                        source: ZodLiteral<"exec">;
                                                        provider: ZodString;
                                                        id: ZodString;
                                                      },
                                                      $strict
                                                    >,
                                                  ],
                                                  "source"
                                                >,
                                              ]
                                            >
                                          >
                                        >;
                                        auth: ZodOptional<
                                          ZodUnion<
                                            readonly [
                                              ZodObject<
                                                {
                                                  mode: ZodLiteral<"provider-default">;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  mode: ZodLiteral<"authorization-bearer">;
                                                  token: ZodUnion<
                                                    readonly [
                                                      ZodString,
                                                      ZodDiscriminatedUnion<
                                                        [
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"env">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"file">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"exec">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                        ],
                                                        "source"
                                                      >,
                                                    ]
                                                  >;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  mode: ZodLiteral<"header">;
                                                  headerName: ZodString;
                                                  value: ZodUnion<
                                                    readonly [
                                                      ZodString,
                                                      ZodDiscriminatedUnion<
                                                        [
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"env">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"file">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"exec">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                        ],
                                                        "source"
                                                      >,
                                                    ]
                                                  >;
                                                  prefix: ZodOptional<ZodString>;
                                                },
                                                $strict
                                              >,
                                            ]
                                          >
                                        >;
                                        proxy: ZodOptional<
                                          ZodUnion<
                                            readonly [
                                              ZodObject<
                                                {
                                                  mode: ZodLiteral<"env-proxy">;
                                                  tls: ZodOptional<
                                                    ZodObject<
                                                      {
                                                        ca: ZodOptional<
                                                          ZodUnion<
                                                            readonly [
                                                              ZodString,
                                                              ZodDiscriminatedUnion<
                                                                [
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"env">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"file">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"exec">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                ],
                                                                "source"
                                                              >,
                                                            ]
                                                          >
                                                        >;
                                                        cert: ZodOptional<
                                                          ZodUnion<
                                                            readonly [
                                                              ZodString,
                                                              ZodDiscriminatedUnion<
                                                                [
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"env">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"file">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"exec">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                ],
                                                                "source"
                                                              >,
                                                            ]
                                                          >
                                                        >;
                                                        key: ZodOptional<
                                                          ZodUnion<
                                                            readonly [
                                                              ZodString,
                                                              ZodDiscriminatedUnion<
                                                                [
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"env">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"file">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"exec">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                ],
                                                                "source"
                                                              >,
                                                            ]
                                                          >
                                                        >;
                                                        passphrase: ZodOptional<
                                                          ZodUnion<
                                                            readonly [
                                                              ZodString,
                                                              ZodDiscriminatedUnion<
                                                                [
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"env">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"file">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"exec">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                ],
                                                                "source"
                                                              >,
                                                            ]
                                                          >
                                                        >;
                                                        serverName: ZodOptional<ZodString>;
                                                        insecureSkipVerify: ZodOptional<ZodBoolean>;
                                                      },
                                                      $strict
                                                    >
                                                  >;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  mode: ZodLiteral<"explicit-proxy">;
                                                  url: ZodString;
                                                  tls: ZodOptional<
                                                    ZodObject<
                                                      {
                                                        ca: ZodOptional<
                                                          ZodUnion<
                                                            readonly [
                                                              ZodString,
                                                              ZodDiscriminatedUnion<
                                                                [
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"env">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"file">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"exec">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                ],
                                                                "source"
                                                              >,
                                                            ]
                                                          >
                                                        >;
                                                        cert: ZodOptional<
                                                          ZodUnion<
                                                            readonly [
                                                              ZodString,
                                                              ZodDiscriminatedUnion<
                                                                [
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"env">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"file">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"exec">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                ],
                                                                "source"
                                                              >,
                                                            ]
                                                          >
                                                        >;
                                                        key: ZodOptional<
                                                          ZodUnion<
                                                            readonly [
                                                              ZodString,
                                                              ZodDiscriminatedUnion<
                                                                [
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"env">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"file">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"exec">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                ],
                                                                "source"
                                                              >,
                                                            ]
                                                          >
                                                        >;
                                                        passphrase: ZodOptional<
                                                          ZodUnion<
                                                            readonly [
                                                              ZodString,
                                                              ZodDiscriminatedUnion<
                                                                [
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"env">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"file">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"exec">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                ],
                                                                "source"
                                                              >,
                                                            ]
                                                          >
                                                        >;
                                                        serverName: ZodOptional<ZodString>;
                                                        insecureSkipVerify: ZodOptional<ZodBoolean>;
                                                      },
                                                      $strict
                                                    >
                                                  >;
                                                },
                                                $strict
                                              >,
                                            ]
                                          >
                                        >;
                                        tls: ZodOptional<
                                          ZodObject<
                                            {
                                              ca: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              cert: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              key: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              passphrase: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              serverName: ZodOptional<ZodString>;
                                              insecureSkipVerify: ZodOptional<ZodBoolean>;
                                            },
                                            $strict
                                          >
                                        >;
                                      },
                                      $strict
                                    >
                                  >;
                                  provider: ZodOptional<ZodString>;
                                  model: ZodOptional<ZodString>;
                                  capabilities: ZodOptional<
                                    ZodArray<
                                      ZodUnion<
                                        readonly [
                                          ZodLiteral<"image">,
                                          ZodLiteral<"audio">,
                                          ZodLiteral<"video">,
                                        ]
                                      >
                                    >
                                  >;
                                  type: ZodOptional<
                                    ZodUnion<readonly [ZodLiteral<"provider">, ZodLiteral<"cli">]>
                                  >;
                                  command: ZodOptional<ZodString>;
                                  args: ZodOptional<ZodArray<ZodString>>;
                                  maxChars: ZodOptional<ZodNumber>;
                                  maxBytes: ZodOptional<ZodNumber>;
                                },
                                $strict
                              >
                            >
                          >
                        >;
                        echoTranscript: ZodOptional<ZodBoolean>;
                        echoFormat: ZodOptional<ZodString>;
                        prompt: ZodOptional<ZodString>;
                        timeoutSeconds: ZodOptional<ZodNumber>;
                        language: ZodOptional<ZodString>;
                        providerOptions: ZodOptional<
                          ZodRecord<
                            ZodString,
                            ZodRecord<
                              ZodString,
                              ZodUnion<readonly [ZodString, ZodNumber, ZodBoolean]>
                            >
                          >
                        >;
                        deepgram: ZodOptional<
                          ZodObject<
                            {
                              detectLanguage: ZodOptional<ZodBoolean>;
                              punctuate: ZodOptional<ZodBoolean>;
                              smartFormat: ZodOptional<ZodBoolean>;
                            },
                            $strict
                          >
                        >;
                        baseUrl: ZodOptional<ZodString>;
                        headers: ZodOptional<ZodRecord<ZodString, ZodString>>;
                        request: ZodOptional<
                          ZodObject<
                            {
                              headers: ZodOptional<
                                ZodRecord<
                                  ZodString,
                                  ZodUnion<
                                    readonly [
                                      ZodString,
                                      ZodDiscriminatedUnion<
                                        [
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"env">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"file">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"exec">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                        ],
                                        "source"
                                      >,
                                    ]
                                  >
                                >
                              >;
                              auth: ZodOptional<
                                ZodUnion<
                                  readonly [
                                    ZodObject<
                                      {
                                        mode: ZodLiteral<"provider-default">;
                                      },
                                      $strict
                                    >,
                                    ZodObject<
                                      {
                                        mode: ZodLiteral<"authorization-bearer">;
                                        token: ZodUnion<
                                          readonly [
                                            ZodString,
                                            ZodDiscriminatedUnion<
                                              [
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"env">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"file">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"exec">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                              ],
                                              "source"
                                            >,
                                          ]
                                        >;
                                      },
                                      $strict
                                    >,
                                    ZodObject<
                                      {
                                        mode: ZodLiteral<"header">;
                                        headerName: ZodString;
                                        value: ZodUnion<
                                          readonly [
                                            ZodString,
                                            ZodDiscriminatedUnion<
                                              [
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"env">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"file">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"exec">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                              ],
                                              "source"
                                            >,
                                          ]
                                        >;
                                        prefix: ZodOptional<ZodString>;
                                      },
                                      $strict
                                    >,
                                  ]
                                >
                              >;
                              proxy: ZodOptional<
                                ZodUnion<
                                  readonly [
                                    ZodObject<
                                      {
                                        mode: ZodLiteral<"env-proxy">;
                                        tls: ZodOptional<
                                          ZodObject<
                                            {
                                              ca: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              cert: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              key: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              passphrase: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              serverName: ZodOptional<ZodString>;
                                              insecureSkipVerify: ZodOptional<ZodBoolean>;
                                            },
                                            $strict
                                          >
                                        >;
                                      },
                                      $strict
                                    >,
                                    ZodObject<
                                      {
                                        mode: ZodLiteral<"explicit-proxy">;
                                        url: ZodString;
                                        tls: ZodOptional<
                                          ZodObject<
                                            {
                                              ca: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              cert: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              key: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              passphrase: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              serverName: ZodOptional<ZodString>;
                                              insecureSkipVerify: ZodOptional<ZodBoolean>;
                                            },
                                            $strict
                                          >
                                        >;
                                      },
                                      $strict
                                    >,
                                  ]
                                >
                              >;
                              tls: ZodOptional<
                                ZodObject<
                                  {
                                    ca: ZodOptional<
                                      ZodUnion<
                                        readonly [
                                          ZodString,
                                          ZodDiscriminatedUnion<
                                            [
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"env">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"file">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"exec">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                            ],
                                            "source"
                                          >,
                                        ]
                                      >
                                    >;
                                    cert: ZodOptional<
                                      ZodUnion<
                                        readonly [
                                          ZodString,
                                          ZodDiscriminatedUnion<
                                            [
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"env">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"file">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"exec">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                            ],
                                            "source"
                                          >,
                                        ]
                                      >
                                    >;
                                    key: ZodOptional<
                                      ZodUnion<
                                        readonly [
                                          ZodString,
                                          ZodDiscriminatedUnion<
                                            [
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"env">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"file">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"exec">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                            ],
                                            "source"
                                          >,
                                        ]
                                      >
                                    >;
                                    passphrase: ZodOptional<
                                      ZodUnion<
                                        readonly [
                                          ZodString,
                                          ZodDiscriminatedUnion<
                                            [
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"env">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"file">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"exec">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                            ],
                                            "source"
                                          >,
                                        ]
                                      >
                                    >;
                                    serverName: ZodOptional<ZodString>;
                                    insecureSkipVerify: ZodOptional<ZodBoolean>;
                                  },
                                  $strict
                                >
                              >;
                            },
                            $strict
                          >
                        >;
                        enabled: ZodOptional<ZodBoolean>;
                        scope: ZodOptional<
                          ZodObject<
                            {
                              default: ZodOptional<
                                ZodUnion<readonly [ZodLiteral<"allow">, ZodLiteral<"deny">]>
                              >;
                              rules: ZodOptional<
                                ZodArray<
                                  ZodObject<
                                    {
                                      action: ZodUnion<
                                        readonly [ZodLiteral<"allow">, ZodLiteral<"deny">]
                                      >;
                                      match: ZodOptional<
                                        ZodObject<
                                          {
                                            channel: ZodOptional<ZodString>;
                                            chatType: ZodOptional<
                                              ZodUnion<
                                                readonly [
                                                  ZodLiteral<"direct">,
                                                  ZodLiteral<"group">,
                                                  ZodLiteral<"channel">,
                                                  ZodLiteral<"dm">,
                                                ]
                                              >
                                            >;
                                            keyPrefix: ZodOptional<ZodString>;
                                            rawKeyPrefix: ZodOptional<ZodString>;
                                          },
                                          $strict
                                        >
                                      >;
                                    },
                                    $strict
                                  >
                                >
                              >;
                            },
                            $strict
                          >
                        >;
                        maxBytes: ZodOptional<ZodNumber>;
                        maxChars: ZodOptional<ZodNumber>;
                      },
                      $strict
                    >
                  >
                >;
                video: ZodOptional<
                  ZodOptional<
                    ZodObject<
                      {
                        attachments: ZodOptional<
                          ZodObject<
                            {
                              mode: ZodOptional<
                                ZodUnion<readonly [ZodLiteral<"first">, ZodLiteral<"all">]>
                              >;
                              maxAttachments: ZodOptional<ZodNumber>;
                              prefer: ZodOptional<
                                ZodUnion<
                                  readonly [
                                    ZodLiteral<"first">,
                                    ZodLiteral<"last">,
                                    ZodLiteral<"path">,
                                    ZodLiteral<"url">,
                                  ]
                                >
                              >;
                            },
                            $strict
                          >
                        >;
                        models: ZodOptional<
                          ZodArray<
                            ZodOptional<
                              ZodObject<
                                {
                                  profile: ZodOptional<ZodString>;
                                  preferredProfile: ZodOptional<ZodString>;
                                  prompt: ZodOptional<ZodString>;
                                  timeoutSeconds: ZodOptional<ZodNumber>;
                                  language: ZodOptional<ZodString>;
                                  providerOptions: ZodOptional<
                                    ZodRecord<
                                      ZodString,
                                      ZodRecord<
                                        ZodString,
                                        ZodUnion<readonly [ZodString, ZodNumber, ZodBoolean]>
                                      >
                                    >
                                  >;
                                  deepgram: ZodOptional<
                                    ZodObject<
                                      {
                                        detectLanguage: ZodOptional<ZodBoolean>;
                                        punctuate: ZodOptional<ZodBoolean>;
                                        smartFormat: ZodOptional<ZodBoolean>;
                                      },
                                      $strict
                                    >
                                  >;
                                  baseUrl: ZodOptional<ZodString>;
                                  headers: ZodOptional<ZodRecord<ZodString, ZodString>>;
                                  request: ZodOptional<
                                    ZodObject<
                                      {
                                        headers: ZodOptional<
                                          ZodRecord<
                                            ZodString,
                                            ZodUnion<
                                              readonly [
                                                ZodString,
                                                ZodDiscriminatedUnion<
                                                  [
                                                    ZodObject<
                                                      {
                                                        source: ZodLiteral<"env">;
                                                        provider: ZodString;
                                                        id: ZodString;
                                                      },
                                                      $strict
                                                    >,
                                                    ZodObject<
                                                      {
                                                        source: ZodLiteral<"file">;
                                                        provider: ZodString;
                                                        id: ZodString;
                                                      },
                                                      $strict
                                                    >,
                                                    ZodObject<
                                                      {
                                                        source: ZodLiteral<"exec">;
                                                        provider: ZodString;
                                                        id: ZodString;
                                                      },
                                                      $strict
                                                    >,
                                                  ],
                                                  "source"
                                                >,
                                              ]
                                            >
                                          >
                                        >;
                                        auth: ZodOptional<
                                          ZodUnion<
                                            readonly [
                                              ZodObject<
                                                {
                                                  mode: ZodLiteral<"provider-default">;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  mode: ZodLiteral<"authorization-bearer">;
                                                  token: ZodUnion<
                                                    readonly [
                                                      ZodString,
                                                      ZodDiscriminatedUnion<
                                                        [
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"env">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"file">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"exec">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                        ],
                                                        "source"
                                                      >,
                                                    ]
                                                  >;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  mode: ZodLiteral<"header">;
                                                  headerName: ZodString;
                                                  value: ZodUnion<
                                                    readonly [
                                                      ZodString,
                                                      ZodDiscriminatedUnion<
                                                        [
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"env">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"file">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                          ZodObject<
                                                            {
                                                              source: ZodLiteral<"exec">;
                                                              provider: ZodString;
                                                              id: ZodString;
                                                            },
                                                            $strict
                                                          >,
                                                        ],
                                                        "source"
                                                      >,
                                                    ]
                                                  >;
                                                  prefix: ZodOptional<ZodString>;
                                                },
                                                $strict
                                              >,
                                            ]
                                          >
                                        >;
                                        proxy: ZodOptional<
                                          ZodUnion<
                                            readonly [
                                              ZodObject<
                                                {
                                                  mode: ZodLiteral<"env-proxy">;
                                                  tls: ZodOptional<
                                                    ZodObject<
                                                      {
                                                        ca: ZodOptional<
                                                          ZodUnion<
                                                            readonly [
                                                              ZodString,
                                                              ZodDiscriminatedUnion<
                                                                [
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"env">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"file">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"exec">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                ],
                                                                "source"
                                                              >,
                                                            ]
                                                          >
                                                        >;
                                                        cert: ZodOptional<
                                                          ZodUnion<
                                                            readonly [
                                                              ZodString,
                                                              ZodDiscriminatedUnion<
                                                                [
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"env">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"file">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"exec">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                ],
                                                                "source"
                                                              >,
                                                            ]
                                                          >
                                                        >;
                                                        key: ZodOptional<
                                                          ZodUnion<
                                                            readonly [
                                                              ZodString,
                                                              ZodDiscriminatedUnion<
                                                                [
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"env">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"file">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"exec">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                ],
                                                                "source"
                                                              >,
                                                            ]
                                                          >
                                                        >;
                                                        passphrase: ZodOptional<
                                                          ZodUnion<
                                                            readonly [
                                                              ZodString,
                                                              ZodDiscriminatedUnion<
                                                                [
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"env">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"file">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"exec">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                ],
                                                                "source"
                                                              >,
                                                            ]
                                                          >
                                                        >;
                                                        serverName: ZodOptional<ZodString>;
                                                        insecureSkipVerify: ZodOptional<ZodBoolean>;
                                                      },
                                                      $strict
                                                    >
                                                  >;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  mode: ZodLiteral<"explicit-proxy">;
                                                  url: ZodString;
                                                  tls: ZodOptional<
                                                    ZodObject<
                                                      {
                                                        ca: ZodOptional<
                                                          ZodUnion<
                                                            readonly [
                                                              ZodString,
                                                              ZodDiscriminatedUnion<
                                                                [
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"env">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"file">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"exec">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                ],
                                                                "source"
                                                              >,
                                                            ]
                                                          >
                                                        >;
                                                        cert: ZodOptional<
                                                          ZodUnion<
                                                            readonly [
                                                              ZodString,
                                                              ZodDiscriminatedUnion<
                                                                [
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"env">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"file">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"exec">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                ],
                                                                "source"
                                                              >,
                                                            ]
                                                          >
                                                        >;
                                                        key: ZodOptional<
                                                          ZodUnion<
                                                            readonly [
                                                              ZodString,
                                                              ZodDiscriminatedUnion<
                                                                [
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"env">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"file">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"exec">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                ],
                                                                "source"
                                                              >,
                                                            ]
                                                          >
                                                        >;
                                                        passphrase: ZodOptional<
                                                          ZodUnion<
                                                            readonly [
                                                              ZodString,
                                                              ZodDiscriminatedUnion<
                                                                [
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"env">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"file">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                  ZodObject<
                                                                    {
                                                                      source: ZodLiteral<"exec">;
                                                                      provider: ZodString;
                                                                      id: ZodString;
                                                                    },
                                                                    $strict
                                                                  >,
                                                                ],
                                                                "source"
                                                              >,
                                                            ]
                                                          >
                                                        >;
                                                        serverName: ZodOptional<ZodString>;
                                                        insecureSkipVerify: ZodOptional<ZodBoolean>;
                                                      },
                                                      $strict
                                                    >
                                                  >;
                                                },
                                                $strict
                                              >,
                                            ]
                                          >
                                        >;
                                        tls: ZodOptional<
                                          ZodObject<
                                            {
                                              ca: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              cert: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              key: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              passphrase: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              serverName: ZodOptional<ZodString>;
                                              insecureSkipVerify: ZodOptional<ZodBoolean>;
                                            },
                                            $strict
                                          >
                                        >;
                                      },
                                      $strict
                                    >
                                  >;
                                  provider: ZodOptional<ZodString>;
                                  model: ZodOptional<ZodString>;
                                  capabilities: ZodOptional<
                                    ZodArray<
                                      ZodUnion<
                                        readonly [
                                          ZodLiteral<"image">,
                                          ZodLiteral<"audio">,
                                          ZodLiteral<"video">,
                                        ]
                                      >
                                    >
                                  >;
                                  type: ZodOptional<
                                    ZodUnion<readonly [ZodLiteral<"provider">, ZodLiteral<"cli">]>
                                  >;
                                  command: ZodOptional<ZodString>;
                                  args: ZodOptional<ZodArray<ZodString>>;
                                  maxChars: ZodOptional<ZodNumber>;
                                  maxBytes: ZodOptional<ZodNumber>;
                                },
                                $strict
                              >
                            >
                          >
                        >;
                        echoTranscript: ZodOptional<ZodBoolean>;
                        echoFormat: ZodOptional<ZodString>;
                        prompt: ZodOptional<ZodString>;
                        timeoutSeconds: ZodOptional<ZodNumber>;
                        language: ZodOptional<ZodString>;
                        providerOptions: ZodOptional<
                          ZodRecord<
                            ZodString,
                            ZodRecord<
                              ZodString,
                              ZodUnion<readonly [ZodString, ZodNumber, ZodBoolean]>
                            >
                          >
                        >;
                        deepgram: ZodOptional<
                          ZodObject<
                            {
                              detectLanguage: ZodOptional<ZodBoolean>;
                              punctuate: ZodOptional<ZodBoolean>;
                              smartFormat: ZodOptional<ZodBoolean>;
                            },
                            $strict
                          >
                        >;
                        baseUrl: ZodOptional<ZodString>;
                        headers: ZodOptional<ZodRecord<ZodString, ZodString>>;
                        request: ZodOptional<
                          ZodObject<
                            {
                              headers: ZodOptional<
                                ZodRecord<
                                  ZodString,
                                  ZodUnion<
                                    readonly [
                                      ZodString,
                                      ZodDiscriminatedUnion<
                                        [
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"env">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"file">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"exec">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                        ],
                                        "source"
                                      >,
                                    ]
                                  >
                                >
                              >;
                              auth: ZodOptional<
                                ZodUnion<
                                  readonly [
                                    ZodObject<
                                      {
                                        mode: ZodLiteral<"provider-default">;
                                      },
                                      $strict
                                    >,
                                    ZodObject<
                                      {
                                        mode: ZodLiteral<"authorization-bearer">;
                                        token: ZodUnion<
                                          readonly [
                                            ZodString,
                                            ZodDiscriminatedUnion<
                                              [
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"env">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"file">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"exec">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                              ],
                                              "source"
                                            >,
                                          ]
                                        >;
                                      },
                                      $strict
                                    >,
                                    ZodObject<
                                      {
                                        mode: ZodLiteral<"header">;
                                        headerName: ZodString;
                                        value: ZodUnion<
                                          readonly [
                                            ZodString,
                                            ZodDiscriminatedUnion<
                                              [
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"env">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"file">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                                ZodObject<
                                                  {
                                                    source: ZodLiteral<"exec">;
                                                    provider: ZodString;
                                                    id: ZodString;
                                                  },
                                                  $strict
                                                >,
                                              ],
                                              "source"
                                            >,
                                          ]
                                        >;
                                        prefix: ZodOptional<ZodString>;
                                      },
                                      $strict
                                    >,
                                  ]
                                >
                              >;
                              proxy: ZodOptional<
                                ZodUnion<
                                  readonly [
                                    ZodObject<
                                      {
                                        mode: ZodLiteral<"env-proxy">;
                                        tls: ZodOptional<
                                          ZodObject<
                                            {
                                              ca: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              cert: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              key: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              passphrase: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              serverName: ZodOptional<ZodString>;
                                              insecureSkipVerify: ZodOptional<ZodBoolean>;
                                            },
                                            $strict
                                          >
                                        >;
                                      },
                                      $strict
                                    >,
                                    ZodObject<
                                      {
                                        mode: ZodLiteral<"explicit-proxy">;
                                        url: ZodString;
                                        tls: ZodOptional<
                                          ZodObject<
                                            {
                                              ca: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              cert: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              key: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              passphrase: ZodOptional<
                                                ZodUnion<
                                                  readonly [
                                                    ZodString,
                                                    ZodDiscriminatedUnion<
                                                      [
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"env">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"file">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                        ZodObject<
                                                          {
                                                            source: ZodLiteral<"exec">;
                                                            provider: ZodString;
                                                            id: ZodString;
                                                          },
                                                          $strict
                                                        >,
                                                      ],
                                                      "source"
                                                    >,
                                                  ]
                                                >
                                              >;
                                              serverName: ZodOptional<ZodString>;
                                              insecureSkipVerify: ZodOptional<ZodBoolean>;
                                            },
                                            $strict
                                          >
                                        >;
                                      },
                                      $strict
                                    >,
                                  ]
                                >
                              >;
                              tls: ZodOptional<
                                ZodObject<
                                  {
                                    ca: ZodOptional<
                                      ZodUnion<
                                        readonly [
                                          ZodString,
                                          ZodDiscriminatedUnion<
                                            [
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"env">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"file">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"exec">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                            ],
                                            "source"
                                          >,
                                        ]
                                      >
                                    >;
                                    cert: ZodOptional<
                                      ZodUnion<
                                        readonly [
                                          ZodString,
                                          ZodDiscriminatedUnion<
                                            [
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"env">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"file">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"exec">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                            ],
                                            "source"
                                          >,
                                        ]
                                      >
                                    >;
                                    key: ZodOptional<
                                      ZodUnion<
                                        readonly [
                                          ZodString,
                                          ZodDiscriminatedUnion<
                                            [
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"env">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"file">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"exec">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                            ],
                                            "source"
                                          >,
                                        ]
                                      >
                                    >;
                                    passphrase: ZodOptional<
                                      ZodUnion<
                                        readonly [
                                          ZodString,
                                          ZodDiscriminatedUnion<
                                            [
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"env">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"file">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                              ZodObject<
                                                {
                                                  source: ZodLiteral<"exec">;
                                                  provider: ZodString;
                                                  id: ZodString;
                                                },
                                                $strict
                                              >,
                                            ],
                                            "source"
                                          >,
                                        ]
                                      >
                                    >;
                                    serverName: ZodOptional<ZodString>;
                                    insecureSkipVerify: ZodOptional<ZodBoolean>;
                                  },
                                  $strict
                                >
                              >;
                            },
                            $strict
                          >
                        >;
                        enabled: ZodOptional<ZodBoolean>;
                        scope: ZodOptional<
                          ZodObject<
                            {
                              default: ZodOptional<
                                ZodUnion<readonly [ZodLiteral<"allow">, ZodLiteral<"deny">]>
                              >;
                              rules: ZodOptional<
                                ZodArray<
                                  ZodObject<
                                    {
                                      action: ZodUnion<
                                        readonly [ZodLiteral<"allow">, ZodLiteral<"deny">]
                                      >;
                                      match: ZodOptional<
                                        ZodObject<
                                          {
                                            channel: ZodOptional<ZodString>;
                                            chatType: ZodOptional<
                                              ZodUnion<
                                                readonly [
                                                  ZodLiteral<"direct">,
                                                  ZodLiteral<"group">,
                                                  ZodLiteral<"channel">,
                                                  ZodLiteral<"dm">,
                                                ]
                                              >
                                            >;
                                            keyPrefix: ZodOptional<ZodString>;
                                            rawKeyPrefix: ZodOptional<ZodString>;
                                          },
                                          $strict
                                        >
                                      >;
                                    },
                                    $strict
                                  >
                                >
                              >;
                            },
                            $strict
                          >
                        >;
                        maxBytes: ZodOptional<ZodNumber>;
                        maxChars: ZodOptional<ZodNumber>;
                      },
                      $strict
                    >
                  >
                >;
              },
              $strict
            >
          >;
          links: ZodOptional<
            ZodObject<
              {
                enabled: ZodOptional<ZodBoolean>;
                scope: ZodOptional<
                  ZodObject<
                    {
                      default: ZodOptional<
                        ZodUnion<readonly [ZodLiteral<"allow">, ZodLiteral<"deny">]>
                      >;
                      rules: ZodOptional<
                        ZodArray<
                          ZodObject<
                            {
                              action: ZodUnion<readonly [ZodLiteral<"allow">, ZodLiteral<"deny">]>;
                              match: ZodOptional<
                                ZodObject<
                                  {
                                    channel: ZodOptional<ZodString>;
                                    chatType: ZodOptional<
                                      ZodUnion<
                                        readonly [
                                          ZodLiteral<"direct">,
                                          ZodLiteral<"group">,
                                          ZodLiteral<"channel">,
                                          ZodLiteral<"dm">,
                                        ]
                                      >
                                    >;
                                    keyPrefix: ZodOptional<ZodString>;
                                    rawKeyPrefix: ZodOptional<ZodString>;
                                  },
                                  $strict
                                >
                              >;
                            },
                            $strict
                          >
                        >
                      >;
                    },
                    $strict
                  >
                >;
                maxLinks: ZodOptional<ZodNumber>;
                timeoutSeconds: ZodOptional<ZodNumber>;
                models: ZodOptional<
                  ZodArray<
                    ZodObject<
                      {
                        type: ZodOptional<ZodLiteral<"cli">>;
                        command: ZodString;
                        args: ZodOptional<ZodArray<ZodString>>;
                        timeoutSeconds: ZodOptional<ZodNumber>;
                      },
                      $strict
                    >
                  >
                >;
              },
              $strict
            >
          >;
          sessions: ZodOptional<
            ZodObject<
              {
                visibility: ZodOptional<
                  ZodEnum<{
                    all: "all";
                    agent: "agent";
                    self: "self";
                    tree: "tree";
                  }>
                >;
              },
              $strict
            >
          >;
          loopDetection: ZodOptional<
            ZodObject<
              {
                enabled: ZodOptional<ZodBoolean>;
                historySize: ZodOptional<ZodNumber>;
                warningThreshold: ZodOptional<ZodNumber>;
                unknownToolThreshold: ZodOptional<ZodNumber>;
                criticalThreshold: ZodOptional<ZodNumber>;
                globalCircuitBreakerThreshold: ZodOptional<ZodNumber>;
                detectors: ZodOptional<
                  ZodObject<
                    {
                      genericRepeat: ZodOptional<ZodBoolean>;
                      knownPollNoProgress: ZodOptional<ZodBoolean>;
                      pingPong: ZodOptional<ZodBoolean>;
                    },
                    $strict
                  >
                >;
                postCompactionGuard: ZodOptional<
                  ZodObject<
                    {
                      windowSize: ZodOptional<ZodNumber>;
                    },
                    $strict
                  >
                >;
              },
              $strict
            >
          >;
          toolSearch: ZodOptional<
            ZodUnion<
              readonly [
                ZodBoolean,
                ZodObject<
                  {
                    enabled: ZodOptional<ZodBoolean>;
                    mode: ZodOptional<
                      ZodEnum<{
                        code: "code";
                        tools: "tools";
                        directory: "directory";
                      }>
                    >;
                    codeTimeoutMs: ZodOptional<ZodNumber>;
                    searchDefaultLimit: ZodOptional<ZodNumber>;
                    maxSearchLimit: ZodOptional<ZodNumber>;
                  },
                  $strict
                >,
              ]
            >
          >;
          codeMode: ZodOptional<
            ZodUnion<
              readonly [
                ZodBoolean,
                ZodObject<
                  {
                    enabled: ZodOptional<ZodBoolean>;
                    runtime: ZodOptional<ZodLiteral<"quickjs-wasi">>;
                    mode: ZodOptional<ZodLiteral<"only">>;
                    languages: ZodOptional<
                      ZodArray<
                        ZodEnum<{
                          javascript: "javascript";
                          typescript: "typescript";
                        }>
                      >
                    >;
                    timeoutMs: ZodOptional<ZodNumber>;
                    memoryLimitBytes: ZodOptional<ZodNumber>;
                    maxOutputBytes: ZodOptional<ZodNumber>;
                    maxSnapshotBytes: ZodOptional<ZodNumber>;
                    maxPendingToolCalls: ZodOptional<ZodNumber>;
                    snapshotTtlSeconds: ZodOptional<ZodNumber>;
                    searchDefaultLimit: ZodOptional<ZodNumber>;
                    maxSearchLimit: ZodOptional<ZodNumber>;
                  },
                  $strict
                >,
              ]
            >
          >;
          message: ZodOptional<
            ZodObject<
              {
                allowCrossContextSend: ZodOptional<ZodBoolean>;
                crossContext: ZodOptional<
                  ZodObject<
                    {
                      allowWithinProvider: ZodOptional<ZodBoolean>;
                      allowAcrossProviders: ZodOptional<ZodBoolean>;
                      marker: ZodOptional<
                        ZodObject<
                          {
                            enabled: ZodOptional<ZodBoolean>;
                            prefix: ZodOptional<ZodString>;
                            suffix: ZodOptional<ZodString>;
                          },
                          $strict
                        >
                      >;
                    },
                    $strict
                  >
                >;
                actions: ZodOptional<
                  ZodObject<
                    {
                      allow: ZodOptional<ZodArray<ZodString>>;
                    },
                    $strict
                  >
                >;
                broadcast: ZodOptional<
                  ZodObject<
                    {
                      enabled: ZodOptional<ZodBoolean>;
                    },
                    $strict
                  >
                >;
              },
              $strict
            >
          >;
          agentToAgent: ZodOptional<
            ZodObject<
              {
                enabled: ZodOptional<ZodBoolean>;
                allow: ZodOptional<ZodArray<ZodString>>;
              },
              $strict
            >
          >;
          elevated: ZodOptional<
            ZodObject<
              {
                enabled: ZodOptional<ZodBoolean>;
                allowFrom: ZodOptional<
                  ZodRecord<ZodString, ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>
                >;
              },
              $strict
            >
          >;
          exec: ZodOptional<
            ZodObject<
              {
                host: ZodOptional<
                  ZodEnum<{
                    node: "node";
                    auto: "auto";
                    gateway: "gateway";
                    sandbox: "sandbox";
                  }>
                >;
                mode: ZodOptional<
                  ZodEnum<{
                    full: "full";
                    auto: "auto";
                    deny: "deny";
                    ask: "ask";
                    allowlist: "allowlist";
                  }>
                >;
                security: ZodOptional<
                  ZodEnum<{
                    full: "full";
                    deny: "deny";
                    allowlist: "allowlist";
                  }>
                >;
                ask: ZodOptional<
                  ZodEnum<{
                    off: "off";
                    always: "always";
                    "on-miss": "on-miss";
                  }>
                >;
                node: ZodOptional<ZodString>;
                pathPrepend: ZodOptional<ZodArray<ZodString>>;
                safeBins: ZodOptional<ZodArray<ZodString>>;
                strictInlineEval: ZodOptional<ZodBoolean>;
                commandHighlighting: ZodOptional<ZodBoolean>;
                safeBinTrustedDirs: ZodOptional<ZodArray<ZodString>>;
                safeBinProfiles: ZodOptional<
                  ZodRecord<
                    ZodString,
                    ZodObject<
                      {
                        minPositional: ZodOptional<ZodNumber>;
                        maxPositional: ZodOptional<ZodNumber>;
                        allowedValueFlags: ZodOptional<ZodArray<ZodString>>;
                        deniedFlags: ZodOptional<ZodArray<ZodString>>;
                      },
                      $strict
                    >
                  >
                >;
                reviewer: ZodOptional<
                  ZodObject<
                    {
                      model: ZodOptional<
                        ZodUnion<
                          readonly [
                            ZodString,
                            ZodObject<
                              {
                                primary: ZodOptional<ZodString>;
                                fallbacks: ZodOptional<ZodArray<ZodString>>;
                              },
                              $strict
                            >,
                          ]
                        >
                      >;
                      timeoutMs: ZodOptional<ZodNumber>;
                    },
                    $strict
                  >
                >;
                backgroundMs: ZodOptional<ZodNumber>;
                timeoutSec: ZodOptional<ZodNumber>;
                cleanupMs: ZodOptional<ZodNumber>;
                notifyOnExit: ZodOptional<ZodBoolean>;
                notifyOnExitEmptySuccess: ZodOptional<ZodBoolean>;
                applyPatch: ZodOptional<
                  ZodObject<
                    {
                      enabled: ZodOptional<ZodBoolean>;
                      workspaceOnly: ZodOptional<ZodBoolean>;
                      allowModels: ZodOptional<ZodArray<ZodString>>;
                    },
                    $strict
                  >
                >;
              },
              $strict
            >
          >;
          fs: ZodOptional<
            ZodObject<
              {
                workspaceOnly: ZodOptional<ZodBoolean>;
              },
              $strict
            >
          >;
          subagents: ZodOptional<
            ZodObject<
              {
                tools: ZodOptional<
                  ZodObject<
                    {
                      allow: ZodOptional<ZodArray<ZodString>>;
                      alsoAllow: ZodOptional<ZodArray<ZodString>>;
                      deny: ZodOptional<ZodArray<ZodString>>;
                    },
                    $strict
                  >
                >;
              },
              $strict
            >
          >;
          sandbox: ZodOptional<
            ZodObject<
              {
                tools: ZodOptional<
                  ZodObject<
                    {
                      allow: ZodOptional<ZodArray<ZodString>>;
                      alsoAllow: ZodOptional<ZodArray<ZodString>>;
                      deny: ZodOptional<ZodArray<ZodString>>;
                    },
                    $strict
                  >
                >;
              },
              $strict
            >
          >;
          sessions_spawn: ZodOptional<
            ZodObject<
              {
                attachments: ZodOptional<
                  ZodObject<
                    {
                      enabled: ZodOptional<ZodBoolean>;
                      maxTotalBytes: ZodOptional<ZodNumber>;
                      maxFiles: ZodOptional<ZodNumber>;
                      maxFileBytes: ZodOptional<ZodNumber>;
                      retainOnSessionKeep: ZodOptional<ZodBoolean>;
                    },
                    $strict
                  >
                >;
              },
              $strict
            >
          >;
          experimental: ZodOptional<
            ZodObject<
              {
                planTool: ZodOptional<ZodBoolean>;
              },
              $strict
            >
          >;
          profile: ZodOptional<
            ZodUnion<
              readonly [
                ZodLiteral<"minimal">,
                ZodLiteral<"coding">,
                ZodLiteral<"messaging">,
                ZodLiteral<"full">,
              ]
            >
          >;
          allow: ZodOptional<ZodArray<ZodString>>;
          alsoAllow: ZodOptional<ZodArray<ZodString>>;
          deny: ZodOptional<ZodArray<ZodString>>;
          byProvider: ZodOptional<
            ZodRecord<
              ZodString,
              ZodObject<
                {
                  allow: ZodOptional<ZodArray<ZodString>>;
                  alsoAllow: ZodOptional<ZodArray<ZodString>>;
                  deny: ZodOptional<ZodArray<ZodString>>;
                  profile: ZodOptional<
                    ZodUnion<
                      readonly [
                        ZodLiteral<"minimal">,
                        ZodLiteral<"coding">,
                        ZodLiteral<"messaging">,
                        ZodLiteral<"full">,
                      ]
                    >
                  >;
                },
                $strict
              >
            >
          >;
          toolsBySender: ZodOptional<
            ZodRecord<
              ZodString,
              ZodOptional<
                ZodObject<
                  {
                    allow: ZodOptional<ZodArray<ZodString>>;
                    alsoAllow: ZodOptional<ZodArray<ZodString>>;
                    deny: ZodOptional<ZodArray<ZodString>>;
                  },
                  $strict
                >
              >
            >
          >;
        },
        $strict
      >
    >;
    security: ZodOptional<
      ZodObject<
        {
          audit: ZodOptional<
            ZodObject<
              {
                suppressions: ZodOptional<
                  ZodArray<
                    ZodObject<
                      {
                        checkId: ZodString;
                        titleIncludes: ZodOptional<ZodString>;
                        detailIncludes: ZodOptional<ZodString>;
                        reason: ZodOptional<ZodString>;
                      },
                      $strict
                    >
                  >
                >;
              },
              $strict
            >
          >;
          installPolicy: ZodOptional<
            ZodObject<
              {
                enabled: ZodOptional<ZodBoolean>;
                targets: ZodOptional<
                  ZodArray<ZodUnion<readonly [ZodLiteral<"skill">, ZodLiteral<"plugin">]>>
                >;
                exec: ZodOptional<
                  ZodObject<
                    {
                      source: ZodLiteral<"exec">;
                      command: ZodString;
                      args: ZodOptional<ZodArray<ZodString>>;
                      timeoutMs: ZodOptional<ZodNumber>;
                      noOutputTimeoutMs: ZodOptional<ZodNumber>;
                      maxOutputBytes: ZodOptional<ZodNumber>;
                      env: ZodOptional<ZodRecord<ZodString, ZodString>>;
                      passEnv: ZodOptional<ZodArray<ZodString>>;
                      trustedDirs: ZodOptional<ZodArray<ZodString>>;
                      allowInsecurePath: ZodOptional<ZodBoolean>;
                      allowSymlinkCommand: ZodOptional<ZodBoolean>;
                    },
                    $strict
                  >
                >;
              },
              $strict
            >
          >;
        },
        $strict
      >
    >;
    bindings: ZodOptional<
      ZodArray<
        ZodUnion<
          readonly [
            ZodObject<
              {
                type: ZodOptional<ZodLiteral<"route">>;
                agentId: ZodString;
                comment: ZodOptional<ZodString>;
                match: ZodObject<
                  {
                    channel: ZodString;
                    accountId: ZodOptional<ZodString>;
                    peer: ZodOptional<
                      ZodObject<
                        {
                          kind: ZodUnion<
                            readonly [
                              ZodLiteral<"direct">,
                              ZodLiteral<"group">,
                              ZodLiteral<"channel">,
                              ZodLiteral<"dm">,
                            ]
                          >;
                          id: ZodString;
                        },
                        $strict
                      >
                    >;
                    guildId: ZodOptional<ZodString>;
                    teamId: ZodOptional<ZodString>;
                    roles: ZodOptional<ZodArray<ZodString>>;
                  },
                  $strict
                >;
                session: ZodOptional<
                  ZodObject<
                    {
                      dmScope: ZodOptional<
                        ZodUnion<
                          readonly [
                            ZodLiteral<"main">,
                            ZodLiteral<"per-peer">,
                            ZodLiteral<"per-channel-peer">,
                            ZodLiteral<"per-account-channel-peer">,
                          ]
                        >
                      >;
                    },
                    $strict
                  >
                >;
              },
              $strict
            >,
            ZodObject<
              {
                type: ZodLiteral<"acp">;
                agentId: ZodString;
                comment: ZodOptional<ZodString>;
                match: ZodObject<
                  {
                    channel: ZodString;
                    accountId: ZodOptional<ZodString>;
                    peer: ZodOptional<
                      ZodObject<
                        {
                          kind: ZodUnion<
                            readonly [
                              ZodLiteral<"direct">,
                              ZodLiteral<"group">,
                              ZodLiteral<"channel">,
                              ZodLiteral<"dm">,
                            ]
                          >;
                          id: ZodString;
                        },
                        $strict
                      >
                    >;
                    guildId: ZodOptional<ZodString>;
                    teamId: ZodOptional<ZodString>;
                    roles: ZodOptional<ZodArray<ZodString>>;
                  },
                  $strict
                >;
                acp: ZodOptional<
                  ZodObject<
                    {
                      mode: ZodOptional<
                        ZodEnum<{
                          persistent: "persistent";
                          oneshot: "oneshot";
                        }>
                      >;
                      label: ZodOptional<ZodString>;
                      cwd: ZodOptional<ZodString>;
                      backend: ZodOptional<ZodString>;
                    },
                    $strict
                  >
                >;
              },
              $strict
            >,
          ]
        >
      >
    >;
    broadcast: ZodOptional<
      ZodObject<
        {
          strategy: ZodOptional<
            ZodEnum<{
              sequential: "sequential";
              parallel: "parallel";
            }>
          >;
        },
        $catchall<ZodArray<ZodString>>
      >
    >;
    audio: ZodOptional<
      ZodObject<
        {
          transcription: ZodOptional<
            ZodObject<
              {
                command: ZodArray<ZodString>;
                timeoutSeconds: ZodOptional<ZodNumber>;
              },
              $strict
            >
          >;
        },
        $strict
      >
    >;
    media: ZodOptional<
      ZodObject<
        {
          preserveFilenames: ZodOptional<ZodBoolean>;
          ttlHours: ZodOptional<ZodNumber>;
        },
        $strict
      >
    >;
    messages: ZodOptional<
      ZodObject<
        {
          messagePrefix: ZodOptional<ZodString>;
          visibleReplies: ZodOptional<
            ZodUnion<
              readonly [
                ZodEnum<{
                  automatic: "automatic";
                  message_tool: "message_tool";
                }>,
                ZodBoolean,
              ]
            >
          >;
          responsePrefix: ZodOptional<ZodString>;
          usageTemplate: ZodOptional<
            ZodUnion<readonly [ZodString, ZodRecord<ZodString, ZodUnknown>]>
          >;
          responseUsage: ZodOptional<
            ZodUnion<
              readonly [
                ZodEnum<{
                  off: "off";
                  full: "full";
                  tokens: "tokens";
                  on: "on";
                }>,
                ZodRecord<
                  ZodString,
                  ZodEnum<{
                    off: "off";
                    full: "full";
                    tokens: "tokens";
                    on: "on";
                  }>
                >,
              ]
            >
          >;
          groupChat: ZodOptional<
            ZodObject<
              {
                mentionPatterns: ZodOptional<ZodArray<ZodString>>;
                historyLimit: ZodOptional<ZodNumber>;
                unmentionedInbound: ZodOptional<
                  ZodEnum<{
                    user_request: "user_request";
                    room_event: "room_event";
                  }>
                >;
                visibleReplies: ZodOptional<
                  ZodUnion<
                    readonly [
                      ZodEnum<{
                        automatic: "automatic";
                        message_tool: "message_tool";
                      }>,
                      ZodBoolean,
                    ]
                  >
                >;
              },
              $strict
            >
          >;
          queue: ZodOptional<
            ZodObject<
              {
                mode: ZodOptional<
                  ZodUnion<
                    readonly [
                      ZodLiteral<"steer">,
                      ZodLiteral<"followup">,
                      ZodLiteral<"collect">,
                      ZodLiteral<"interrupt">,
                    ]
                  >
                >;
                byChannel: ZodOptional<
                  ZodObject<
                    {
                      whatsapp: ZodOptional<
                        ZodUnion<
                          readonly [
                            ZodLiteral<"steer">,
                            ZodLiteral<"followup">,
                            ZodLiteral<"collect">,
                            ZodLiteral<"interrupt">,
                          ]
                        >
                      >;
                      telegram: ZodOptional<
                        ZodUnion<
                          readonly [
                            ZodLiteral<"steer">,
                            ZodLiteral<"followup">,
                            ZodLiteral<"collect">,
                            ZodLiteral<"interrupt">,
                          ]
                        >
                      >;
                      discord: ZodOptional<
                        ZodUnion<
                          readonly [
                            ZodLiteral<"steer">,
                            ZodLiteral<"followup">,
                            ZodLiteral<"collect">,
                            ZodLiteral<"interrupt">,
                          ]
                        >
                      >;
                      irc: ZodOptional<
                        ZodUnion<
                          readonly [
                            ZodLiteral<"steer">,
                            ZodLiteral<"followup">,
                            ZodLiteral<"collect">,
                            ZodLiteral<"interrupt">,
                          ]
                        >
                      >;
                      googlechat: ZodOptional<
                        ZodUnion<
                          readonly [
                            ZodLiteral<"steer">,
                            ZodLiteral<"followup">,
                            ZodLiteral<"collect">,
                            ZodLiteral<"interrupt">,
                          ]
                        >
                      >;
                      slack: ZodOptional<
                        ZodUnion<
                          readonly [
                            ZodLiteral<"steer">,
                            ZodLiteral<"followup">,
                            ZodLiteral<"collect">,
                            ZodLiteral<"interrupt">,
                          ]
                        >
                      >;
                      mattermost: ZodOptional<
                        ZodUnion<
                          readonly [
                            ZodLiteral<"steer">,
                            ZodLiteral<"followup">,
                            ZodLiteral<"collect">,
                            ZodLiteral<"interrupt">,
                          ]
                        >
                      >;
                      signal: ZodOptional<
                        ZodUnion<
                          readonly [
                            ZodLiteral<"steer">,
                            ZodLiteral<"followup">,
                            ZodLiteral<"collect">,
                            ZodLiteral<"interrupt">,
                          ]
                        >
                      >;
                      imessage: ZodOptional<
                        ZodUnion<
                          readonly [
                            ZodLiteral<"steer">,
                            ZodLiteral<"followup">,
                            ZodLiteral<"collect">,
                            ZodLiteral<"interrupt">,
                          ]
                        >
                      >;
                      msteams: ZodOptional<
                        ZodUnion<
                          readonly [
                            ZodLiteral<"steer">,
                            ZodLiteral<"followup">,
                            ZodLiteral<"collect">,
                            ZodLiteral<"interrupt">,
                          ]
                        >
                      >;
                      webchat: ZodOptional<
                        ZodUnion<
                          readonly [
                            ZodLiteral<"steer">,
                            ZodLiteral<"followup">,
                            ZodLiteral<"collect">,
                            ZodLiteral<"interrupt">,
                          ]
                        >
                      >;
                      matrix: ZodOptional<
                        ZodUnion<
                          readonly [
                            ZodLiteral<"steer">,
                            ZodLiteral<"followup">,
                            ZodLiteral<"collect">,
                            ZodLiteral<"interrupt">,
                          ]
                        >
                      >;
                    },
                    $strict
                  >
                >;
                debounceMs: ZodOptional<ZodNumber>;
                debounceMsByChannel: ZodOptional<ZodRecord<ZodString, ZodNumber>>;
                cap: ZodOptional<ZodNumber>;
                drop: ZodOptional<
                  ZodUnion<readonly [ZodLiteral<"old">, ZodLiteral<"new">, ZodLiteral<"summarize">]>
                >;
              },
              $strict
            >
          >;
          inbound: ZodOptional<
            ZodObject<
              {
                debounceMs: ZodOptional<ZodNumber>;
                byChannel: ZodOptional<ZodRecord<ZodString, ZodNumber>>;
              },
              $strict
            >
          >;
          ackReaction: ZodOptional<ZodString>;
          ackReactionScope: ZodOptional<
            ZodEnum<{
              off: "off";
              all: "all";
              none: "none";
              direct: "direct";
              "group-mentions": "group-mentions";
              "group-all": "group-all";
            }>
          >;
          removeAckAfterReply: ZodOptional<ZodBoolean>;
          statusReactions: ZodOptional<
            ZodObject<
              {
                enabled: ZodOptional<ZodBoolean>;
                emojis: ZodOptional<
                  ZodObject<
                    {
                      queued: ZodOptional<ZodString>;
                      thinking: ZodOptional<ZodString>;
                      tool: ZodOptional<ZodString>;
                      coding: ZodOptional<ZodString>;
                      web: ZodOptional<ZodString>;
                      deploy: ZodOptional<ZodString>;
                      build: ZodOptional<ZodString>;
                      concierge: ZodOptional<ZodString>;
                      done: ZodOptional<ZodString>;
                      error: ZodOptional<ZodString>;
                      stallSoft: ZodOptional<ZodString>;
                      stallHard: ZodOptional<ZodString>;
                      compacting: ZodOptional<ZodString>;
                    },
                    $strict
                  >
                >;
                timing: ZodOptional<
                  ZodObject<
                    {
                      debounceMs: ZodOptional<ZodNumber>;
                      stallSoftMs: ZodOptional<ZodNumber>;
                      stallHardMs: ZodOptional<ZodNumber>;
                      doneHoldMs: ZodOptional<ZodNumber>;
                      errorHoldMs: ZodOptional<ZodNumber>;
                    },
                    $strict
                  >
                >;
              },
              $strict
            >
          >;
          suppressToolErrors: ZodOptional<ZodBoolean>;
          tts: ZodOptional<
            ZodObject<
              {
                auto: ZodOptional<
                  ZodEnum<{
                    off: "off";
                    always: "always";
                    tagged: "tagged";
                    inbound: "inbound";
                  }>
                >;
                enabled: ZodOptional<ZodBoolean>;
                mode: ZodOptional<
                  ZodEnum<{
                    all: "all";
                    final: "final";
                  }>
                >;
                provider: ZodOptional<ZodString>;
                persona: ZodOptional<ZodString>;
                personas: ZodOptional<
                  ZodRecord<
                    ZodString,
                    ZodObject<
                      {
                        label: ZodOptional<ZodString>;
                        description: ZodOptional<ZodString>;
                        provider: ZodOptional<ZodString>;
                        fallbackPolicy: ZodOptional<
                          ZodUnion<
                            readonly [
                              ZodLiteral<"preserve-persona">,
                              ZodLiteral<"provider-defaults">,
                              ZodLiteral<"fail">,
                            ]
                          >
                        >;
                        prompt: ZodOptional<
                          ZodObject<
                            {
                              profile: ZodOptional<ZodString>;
                              scene: ZodOptional<ZodString>;
                              sampleContext: ZodOptional<ZodString>;
                              style: ZodOptional<ZodString>;
                              accent: ZodOptional<ZodString>;
                              pacing: ZodOptional<ZodString>;
                              constraints: ZodOptional<ZodArray<ZodString>>;
                            },
                            $strict
                          >
                        >;
                        providers: ZodOptional<
                          ZodRecord<
                            ZodString,
                            ZodObject<
                              {
                                apiKey: ZodOptional<
                                  ZodUnion<
                                    readonly [
                                      ZodString,
                                      ZodDiscriminatedUnion<
                                        [
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"env">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"file">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                          ZodObject<
                                            {
                                              source: ZodLiteral<"exec">;
                                              provider: ZodString;
                                              id: ZodString;
                                            },
                                            $strict
                                          >,
                                        ],
                                        "source"
                                      >,
                                    ]
                                  >
                                >;
                              },
                              $catchall<
                                ZodUnion<
                                  readonly [
                                    ZodString,
                                    ZodNumber,
                                    ZodBoolean,
                                    ZodNull,
                                    ZodArray<ZodUnknown>,
                                    ZodRecord<ZodString, ZodUnknown>,
                                  ]
                                >
                              >
                            >
                          >
                        >;
                      },
                      $strict
                    >
                  >
                >;
                summaryModel: ZodOptional<ZodString>;
                modelOverrides: ZodOptional<
                  ZodObject<
                    {
                      enabled: ZodOptional<ZodBoolean>;
                      allowText: ZodOptional<ZodBoolean>;
                      allowProvider: ZodOptional<ZodBoolean>;
                      allowVoice: ZodOptional<ZodBoolean>;
                      allowModelId: ZodOptional<ZodBoolean>;
                      allowVoiceSettings: ZodOptional<ZodBoolean>;
                      allowNormalization: ZodOptional<ZodBoolean>;
                      allowSeed: ZodOptional<ZodBoolean>;
                    },
                    $strict
                  >
                >;
                providers: ZodOptional<
                  ZodRecord<
                    ZodString,
                    ZodObject<
                      {
                        apiKey: ZodOptional<
                          ZodUnion<
                            readonly [
                              ZodString,
                              ZodDiscriminatedUnion<
                                [
                                  ZodObject<
                                    {
                                      source: ZodLiteral<"env">;
                                      provider: ZodString;
                                      id: ZodString;
                                    },
                                    $strict
                                  >,
                                  ZodObject<
                                    {
                                      source: ZodLiteral<"file">;
                                      provider: ZodString;
                                      id: ZodString;
                                    },
                                    $strict
                                  >,
                                  ZodObject<
                                    {
                                      source: ZodLiteral<"exec">;
                                      provider: ZodString;
                                      id: ZodString;
                                    },
                                    $strict
                                  >,
                                ],
                                "source"
                              >,
                            ]
                          >
                        >;
                      },
                      $catchall<
                        ZodUnion<
                          readonly [
                            ZodString,
                            ZodNumber,
                            ZodBoolean,
                            ZodNull,
                            ZodArray<ZodUnknown>,
                            ZodRecord<ZodString, ZodUnknown>,
                          ]
                        >
                      >
                    >
                  >
                >;
                prefsPath: ZodOptional<ZodString>;
                maxTextLength: ZodOptional<ZodNumber>;
                timeoutMs: ZodOptional<ZodNumber>;
              },
              $strict
            >
          >;
        },
        $strict
      >
    >;
    commands: ZodDefault<
      ZodOptional<
        ZodObject<
          {
            native: ZodDefault<ZodOptional<ZodUnion<readonly [ZodBoolean, ZodLiteral<"auto">]>>>;
            nativeSkills: ZodDefault<
              ZodOptional<ZodUnion<readonly [ZodBoolean, ZodLiteral<"auto">]>>
            >;
            text: ZodOptional<ZodBoolean>;
            bash: ZodOptional<ZodBoolean>;
            bashForegroundMs: ZodOptional<ZodNumber>;
            config: ZodOptional<ZodBoolean>;
            mcp: ZodOptional<ZodBoolean>;
            plugins: ZodOptional<ZodBoolean>;
            debug: ZodOptional<ZodBoolean>;
            restart: ZodDefault<ZodOptional<ZodBoolean>>;
            useAccessGroups: ZodOptional<ZodBoolean>;
            ownerAllowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
            ownerDisplay: ZodDefault<
              ZodOptional<
                ZodEnum<{
                  raw: "raw";
                  hash: "hash";
                }>
              >
            >;
            ownerDisplaySecret: ZodOptional<ZodString>;
            allowFrom: ZodOptional<
              ZodOptional<ZodRecord<ZodString, ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>>
            >;
          },
          $strict
        >
      >
    >;
    approvals: ZodOptional<
      ZodObject<
        {
          exec: ZodOptional<
            ZodObject<
              {
                enabled: ZodOptional<ZodBoolean>;
                mode: ZodOptional<
                  ZodUnion<
                    readonly [ZodLiteral<"session">, ZodLiteral<"targets">, ZodLiteral<"both">]
                  >
                >;
                agentFilter: ZodOptional<ZodArray<ZodString>>;
                sessionFilter: ZodOptional<ZodArray<ZodString>>;
                targets: ZodOptional<
                  ZodArray<
                    ZodObject<
                      {
                        channel: ZodString;
                        to: ZodString;
                        accountId: ZodOptional<ZodString>;
                        threadId: ZodOptional<ZodUnion<readonly [ZodString, ZodNumber]>>;
                      },
                      $strict
                    >
                  >
                >;
              },
              $strict
            >
          >;
          plugin: ZodOptional<
            ZodObject<
              {
                enabled: ZodOptional<ZodBoolean>;
                mode: ZodOptional<
                  ZodUnion<
                    readonly [ZodLiteral<"session">, ZodLiteral<"targets">, ZodLiteral<"both">]
                  >
                >;
                agentFilter: ZodOptional<ZodArray<ZodString>>;
                sessionFilter: ZodOptional<ZodArray<ZodString>>;
                targets: ZodOptional<
                  ZodArray<
                    ZodObject<
                      {
                        channel: ZodString;
                        to: ZodString;
                        accountId: ZodOptional<ZodString>;
                        threadId: ZodOptional<ZodUnion<readonly [ZodString, ZodNumber]>>;
                      },
                      $strict
                    >
                  >
                >;
              },
              $strict
            >
          >;
        },
        $strict
      >
    >;
    session: ZodOptional<
      ZodObject<
        {
          scope: ZodOptional<ZodUnion<readonly [ZodLiteral<"per-sender">, ZodLiteral<"global">]>>;
          dmScope: ZodOptional<
            ZodUnion<
              readonly [
                ZodLiteral<"main">,
                ZodLiteral<"per-peer">,
                ZodLiteral<"per-channel-peer">,
                ZodLiteral<"per-account-channel-peer">,
              ]
            >
          >;
          identityLinks: ZodOptional<ZodRecord<ZodString, ZodArray<ZodString>>>;
          resetTriggers: ZodOptional<ZodArray<ZodString>>;
          idleMinutes: ZodOptional<ZodNumber>;
          reset: ZodOptional<
            ZodObject<
              {
                mode: ZodOptional<ZodUnion<readonly [ZodLiteral<"daily">, ZodLiteral<"idle">]>>;
                atHour: ZodOptional<ZodNumber>;
                idleMinutes: ZodOptional<ZodNumber>;
              },
              $strict
            >
          >;
          resetByType: ZodOptional<
            ZodObject<
              {
                direct: ZodOptional<
                  ZodObject<
                    {
                      mode: ZodOptional<
                        ZodUnion<readonly [ZodLiteral<"daily">, ZodLiteral<"idle">]>
                      >;
                      atHour: ZodOptional<ZodNumber>;
                      idleMinutes: ZodOptional<ZodNumber>;
                    },
                    $strict
                  >
                >;
                dm: ZodOptional<
                  ZodObject<
                    {
                      mode: ZodOptional<
                        ZodUnion<readonly [ZodLiteral<"daily">, ZodLiteral<"idle">]>
                      >;
                      atHour: ZodOptional<ZodNumber>;
                      idleMinutes: ZodOptional<ZodNumber>;
                    },
                    $strict
                  >
                >;
                group: ZodOptional<
                  ZodObject<
                    {
                      mode: ZodOptional<
                        ZodUnion<readonly [ZodLiteral<"daily">, ZodLiteral<"idle">]>
                      >;
                      atHour: ZodOptional<ZodNumber>;
                      idleMinutes: ZodOptional<ZodNumber>;
                    },
                    $strict
                  >
                >;
                thread: ZodOptional<
                  ZodObject<
                    {
                      mode: ZodOptional<
                        ZodUnion<readonly [ZodLiteral<"daily">, ZodLiteral<"idle">]>
                      >;
                      atHour: ZodOptional<ZodNumber>;
                      idleMinutes: ZodOptional<ZodNumber>;
                    },
                    $strict
                  >
                >;
              },
              $strict
            >
          >;
          resetByChannel: ZodOptional<
            ZodRecord<
              ZodString,
              ZodObject<
                {
                  mode: ZodOptional<ZodUnion<readonly [ZodLiteral<"daily">, ZodLiteral<"idle">]>>;
                  atHour: ZodOptional<ZodNumber>;
                  idleMinutes: ZodOptional<ZodNumber>;
                },
                $strict
              >
            >
          >;
          store: ZodOptional<ZodString>;
          typingIntervalSeconds: ZodOptional<ZodNumber>;
          typingMode: ZodOptional<
            ZodUnion<
              readonly [
                ZodLiteral<"never">,
                ZodLiteral<"instant">,
                ZodLiteral<"thinking">,
                ZodLiteral<"message">,
              ]
            >
          >;
          mainKey: ZodOptional<ZodString>;
          sendPolicy: ZodOptional<
            ZodOptional<
              ZodObject<
                {
                  default: ZodOptional<
                    ZodUnion<readonly [ZodLiteral<"allow">, ZodLiteral<"deny">]>
                  >;
                  rules: ZodOptional<
                    ZodArray<
                      ZodObject<
                        {
                          action: ZodUnion<readonly [ZodLiteral<"allow">, ZodLiteral<"deny">]>;
                          match: ZodOptional<
                            ZodObject<
                              {
                                channel: ZodOptional<ZodString>;
                                chatType: ZodOptional<
                                  ZodUnion<
                                    readonly [
                                      ZodLiteral<"direct">,
                                      ZodLiteral<"group">,
                                      ZodLiteral<"channel">,
                                      ZodLiteral<"dm">,
                                    ]
                                  >
                                >;
                                keyPrefix: ZodOptional<ZodString>;
                                rawKeyPrefix: ZodOptional<ZodString>;
                              },
                              $strict
                            >
                          >;
                        },
                        $strict
                      >
                    >
                  >;
                },
                $strict
              >
            >
          >;
          writeLock: ZodOptional<
            ZodObject<
              {
                acquireTimeoutMs: ZodOptional<ZodNumber>;
                staleMs: ZodOptional<ZodNumber>;
                maxHoldMs: ZodOptional<ZodNumber>;
              },
              $strict
            >
          >;
          agentToAgent: ZodOptional<
            ZodObject<
              {
                maxPingPongTurns: ZodOptional<ZodNumber>;
              },
              $strict
            >
          >;
          threadBindings: ZodOptional<
            ZodObject<
              {
                enabled: ZodOptional<ZodBoolean>;
                idleHours: ZodOptional<ZodNumber>;
                maxAgeHours: ZodOptional<ZodNumber>;
                spawnSessions: ZodOptional<ZodBoolean>;
                defaultSpawnContext: ZodOptional<
                  ZodEnum<{
                    fork: "fork";
                    isolated: "isolated";
                  }>
                >;
              },
              $strict
            >
          >;
          maintenance: ZodOptional<
            ZodObject<
              {
                mode: ZodOptional<
                  ZodEnum<{
                    enforce: "enforce";
                    warn: "warn";
                  }>
                >;
                pruneAfter: ZodOptional<ZodUnion<readonly [ZodString, ZodNumber]>>;
                pruneDays: ZodOptional<ZodNumber>;
                maxEntries: ZodOptional<ZodNumber>;
                resetArchiveRetention: ZodOptional<
                  ZodUnion<readonly [ZodString, ZodNumber, ZodLiteral<false>]>
                >;
                maxDiskBytes: ZodOptional<ZodUnion<readonly [ZodString, ZodNumber]>>;
                highWaterBytes: ZodOptional<ZodUnion<readonly [ZodString, ZodNumber]>>;
              },
              $strict
            >
          >;
        },
        $strict
      >
    >;
    cron: ZodOptional<
      ZodObject<
        {
          enabled: ZodOptional<ZodBoolean>;
          store: ZodOptional<ZodString>;
          maxConcurrentRuns: ZodOptional<ZodNumber>;
          triggers: ZodOptional<
            ZodObject<
              {
                enabled: ZodOptional<ZodBoolean>;
                minIntervalMs: ZodOptional<ZodNumber>;
              },
              $strict
            >
          >;
          retry: ZodOptional<
            ZodObject<
              {
                maxAttempts: ZodOptional<ZodNumber>;
                backoffMs: ZodOptional<ZodArray<ZodNumber>>;
                retryOn: ZodOptional<
                  ZodArray<
                    ZodEnum<{
                      rate_limit: "rate_limit";
                      overloaded: "overloaded";
                      server_error: "server_error";
                      timeout: "timeout";
                      network: "network";
                    }>
                  >
                >;
              },
              $strict
            >
          >;
          webhook: ZodOptional<ZodString>;
          webhookToken: ZodOptional<
            ZodUnion<
              readonly [
                ZodString,
                ZodDiscriminatedUnion<
                  [
                    ZodObject<
                      {
                        source: ZodLiteral<"env">;
                        provider: ZodString;
                        id: ZodString;
                      },
                      $strict
                    >,
                    ZodObject<
                      {
                        source: ZodLiteral<"file">;
                        provider: ZodString;
                        id: ZodString;
                      },
                      $strict
                    >,
                    ZodObject<
                      {
                        source: ZodLiteral<"exec">;
                        provider: ZodString;
                        id: ZodString;
                      },
                      $strict
                    >,
                  ],
                  "source"
                >,
              ]
            >
          >;
          sessionRetention: ZodOptional<ZodUnion<readonly [ZodString, ZodLiteral<false>]>>;
          failureAlert: ZodOptional<
            ZodObject<
              {
                enabled: ZodOptional<ZodBoolean>;
                after: ZodOptional<ZodNumber>;
                cooldownMs: ZodOptional<ZodNumber>;
                includeSkipped: ZodOptional<ZodBoolean>;
                mode: ZodOptional<
                  ZodEnum<{
                    announce: "announce";
                    webhook: "webhook";
                  }>
                >;
                accountId: ZodOptional<ZodString>;
              },
              $strict
            >
          >;
          failureDestination: ZodOptional<
            ZodObject<
              {
                channel: ZodOptional<ZodString>;
                to: ZodOptional<ZodString>;
                accountId: ZodOptional<ZodString>;
                mode: ZodOptional<
                  ZodEnum<{
                    announce: "announce";
                    webhook: "webhook";
                  }>
                >;
              },
              $strict
            >
          >;
        },
        $strict
      >
    >;
    worktrees: ZodOptional<
      ZodObject<
        {
          cleanup: ZodOptional<
            ZodObject<
              {
                maxCount: ZodOptional<ZodNumber>;
                maxTotalSizeGb: ZodOptional<ZodNumber>;
              },
              $strict
            >
          >;
        },
        $strict
      >
    >;
    transcripts: ZodOptional<
      ZodObject<
        {
          enabled: ZodOptional<ZodBoolean>;
          maxUtterances: ZodOptional<ZodNumber>;
          autoStart: ZodOptional<
            ZodArray<
              ZodObject<
                {
                  providerId: ZodString;
                  sessionId: ZodOptional<ZodString>;
                  title: ZodOptional<ZodString>;
                  accountId: ZodOptional<ZodString>;
                  guildId: ZodOptional<ZodString>;
                  channelId: ZodOptional<ZodString>;
                  meetingUrl: ZodOptional<ZodString>;
                },
                $strict
              >
            >
          >;
        },
        $strict
      >
    >;
    commitments: ZodOptional<
      ZodObject<
        {
          enabled: ZodOptional<ZodBoolean>;
          maxPerDay: ZodOptional<ZodNumber>;
        },
        $strict
      >
    >;
    hooks: ZodOptional<
      ZodObject<
        {
          enabled: ZodOptional<ZodBoolean>;
          path: ZodOptional<ZodString>;
          token: ZodOptional<ZodString>;
          defaultSessionKey: ZodOptional<ZodString>;
          allowRequestSessionKey: ZodOptional<ZodBoolean>;
          allowedSessionKeyPrefixes: ZodOptional<ZodArray<ZodString>>;
          allowedAgentIds: ZodOptional<ZodArray<ZodString>>;
          maxBodyBytes: ZodOptional<ZodNumber>;
          presets: ZodOptional<ZodArray<ZodString>>;
          transformsDir: ZodOptional<ZodString>;
          mappings: ZodOptional<
            ZodArray<
              ZodOptional<
                ZodObject<
                  {
                    id: ZodOptional<ZodString>;
                    match: ZodOptional<
                      ZodObject<
                        {
                          path: ZodOptional<ZodString>;
                          source: ZodOptional<ZodString>;
                        },
                        $strip
                      >
                    >;
                    action: ZodOptional<
                      ZodUnion<readonly [ZodLiteral<"wake">, ZodLiteral<"agent">]>
                    >;
                    wakeMode: ZodOptional<
                      ZodUnion<readonly [ZodLiteral<"now">, ZodLiteral<"next-heartbeat">]>
                    >;
                    name: ZodOptional<ZodString>;
                    agentId: ZodOptional<ZodString>;
                    sessionKey: ZodOptional<ZodString>;
                    messageTemplate: ZodOptional<ZodString>;
                    textTemplate: ZodOptional<ZodString>;
                    deliver: ZodOptional<ZodBoolean>;
                    allowUnsafeExternalContent: ZodOptional<ZodBoolean>;
                    channel: ZodOptional<ZodString>;
                    to: ZodOptional<ZodString>;
                    model: ZodOptional<ZodString>;
                    thinking: ZodOptional<ZodString>;
                    timeoutSeconds: ZodOptional<ZodNumber>;
                    transform: ZodOptional<
                      ZodObject<
                        {
                          module: ZodString;
                          export: ZodOptional<ZodString>;
                        },
                        $strict
                      >
                    >;
                  },
                  $strict
                >
              >
            >
          >;
          gmail: ZodOptional<
            ZodObject<
              {
                account: ZodOptional<ZodString>;
                label: ZodOptional<ZodString>;
                topic: ZodOptional<ZodString>;
                subscription: ZodOptional<ZodString>;
                pushToken: ZodOptional<ZodString>;
                hookUrl: ZodOptional<ZodString>;
                includeBody: ZodOptional<ZodBoolean>;
                maxBytes: ZodOptional<ZodNumber>;
                renewEveryMinutes: ZodOptional<ZodNumber>;
                allowUnsafeExternalContent: ZodOptional<ZodBoolean>;
                serve: ZodOptional<
                  ZodObject<
                    {
                      bind: ZodOptional<ZodString>;
                      port: ZodOptional<ZodNumber>;
                      path: ZodOptional<ZodString>;
                    },
                    $strict
                  >
                >;
                tailscale: ZodOptional<
                  ZodObject<
                    {
                      mode: ZodOptional<
                        ZodUnion<
                          readonly [ZodLiteral<"off">, ZodLiteral<"serve">, ZodLiteral<"funnel">]
                        >
                      >;
                      path: ZodOptional<ZodString>;
                      target: ZodOptional<ZodString>;
                    },
                    $strict
                  >
                >;
                model: ZodOptional<ZodString>;
                thinking: ZodOptional<
                  ZodUnion<
                    readonly [
                      ZodLiteral<"off">,
                      ZodLiteral<"minimal">,
                      ZodLiteral<"low">,
                      ZodLiteral<"medium">,
                      ZodLiteral<"high">,
                    ]
                  >
                >;
              },
              $strict
            >
          >;
          internal: ZodOptional<
            ZodObject<
              {
                enabled: ZodOptional<ZodBoolean>;
                handlers: ZodOptional<
                  ZodArray<
                    ZodObject<
                      {
                        event: ZodString;
                        module: ZodString;
                        export: ZodOptional<ZodString>;
                      },
                      $strict
                    >
                  >
                >;
                entries: ZodOptional<
                  ZodRecord<
                    ZodString,
                    ZodObject<
                      {
                        enabled: ZodOptional<ZodBoolean>;
                        env: ZodOptional<ZodRecord<ZodString, ZodString>>;
                      },
                      $loose
                    >
                  >
                >;
                load: ZodOptional<
                  ZodObject<
                    {
                      extraDirs: ZodOptional<ZodArray<ZodString>>;
                    },
                    $strict
                  >
                >;
                installs: ZodOptional<
                  ZodRecord<
                    ZodString,
                    ZodObject<
                      {
                        hooks: ZodOptional<ZodArray<ZodString>>;
                        source: ZodUnion<
                          readonly [
                            ZodLiteral<"npm">,
                            ZodLiteral<"archive">,
                            ZodLiteral<"path">,
                            ZodLiteral<"clawhub">,
                            ZodLiteral<"git">,
                          ]
                        >;
                        spec: ZodOptional<ZodString>;
                        sourcePath: ZodOptional<ZodString>;
                        installPath: ZodOptional<ZodString>;
                        version: ZodOptional<ZodString>;
                        resolvedName: ZodOptional<ZodString>;
                        resolvedVersion: ZodOptional<ZodString>;
                        resolvedSpec: ZodOptional<ZodString>;
                        integrity: ZodOptional<ZodString>;
                        shasum: ZodOptional<ZodString>;
                        resolvedAt: ZodOptional<ZodString>;
                        installedAt: ZodOptional<ZodString>;
                        clawhubUrl: ZodOptional<ZodString>;
                        clawhubPackage: ZodOptional<ZodString>;
                        clawhubFamily: ZodOptional<
                          ZodUnion<
                            readonly [ZodLiteral<"code-plugin">, ZodLiteral<"bundle-plugin">]
                          >
                        >;
                        clawhubChannel: ZodOptional<
                          ZodUnion<
                            readonly [
                              ZodLiteral<"official">,
                              ZodLiteral<"community">,
                              ZodLiteral<"private">,
                            ]
                          >
                        >;
                        clawhubTrustDisposition: ZodOptional<
                          ZodUnion<
                            readonly [
                              ZodLiteral<"clean">,
                              ZodLiteral<"review-recommended">,
                              ZodLiteral<"review-required">,
                              ZodLiteral<"blocked">,
                            ]
                          >
                        >;
                        clawhubTrustScanStatus: ZodOptional<ZodString>;
                        clawhubTrustModerationState: ZodOptional<ZodString>;
                        clawhubTrustReasons: ZodOptional<ZodArray<ZodString>>;
                        clawhubTrustPending: ZodOptional<ZodBoolean>;
                        clawhubTrustStale: ZodOptional<ZodBoolean>;
                        clawhubTrustCheckedAt: ZodOptional<ZodString>;
                        clawhubTrustAcknowledgedAt: ZodOptional<ZodString>;
                        artifactKind: ZodOptional<
                          ZodUnion<readonly [ZodLiteral<"legacy-zip">, ZodLiteral<"npm-pack">]>
                        >;
                        artifactFormat: ZodOptional<
                          ZodUnion<readonly [ZodLiteral<"zip">, ZodLiteral<"tgz">]>
                        >;
                        npmIntegrity: ZodOptional<ZodString>;
                        npmShasum: ZodOptional<ZodString>;
                        npmTarballName: ZodOptional<ZodString>;
                        clawpackSha256: ZodOptional<ZodString>;
                        clawpackSpecVersion: ZodOptional<ZodNumber>;
                        clawpackManifestSha256: ZodOptional<ZodString>;
                        clawpackSize: ZodOptional<ZodNumber>;
                        gitUrl: ZodOptional<ZodString>;
                        gitRef: ZodOptional<ZodString>;
                        gitCommit: ZodOptional<ZodString>;
                      },
                      $strict
                    >
                  >
                >;
              },
              $strict
            >
          >;
        },
        $strict
      >
    >;
    web: ZodOptional<
      ZodObject<
        {
          enabled: ZodOptional<ZodBoolean>;
          heartbeatSeconds: ZodOptional<ZodNumber>;
          reconnect: ZodOptional<
            ZodObject<
              {
                initialMs: ZodOptional<ZodNumber>;
                maxMs: ZodOptional<ZodNumber>;
                factor: ZodOptional<ZodNumber>;
                jitter: ZodOptional<ZodNumber>;
                maxAttempts: ZodOptional<ZodNumber>;
              },
              $strict
            >
          >;
          whatsapp: ZodOptional<
            ZodObject<
              {
                keepAliveIntervalMs: ZodOptional<ZodNumber>;
                connectTimeoutMs: ZodOptional<ZodNumber>;
                defaultQueryTimeoutMs: ZodOptional<ZodNumber>;
              },
              $strict
            >
          >;
        },
        $strict
      >
    >;
    channels: ZodType<
      ChannelsConfig | undefined,
      unknown,
      $ZodTypeInternals<ChannelsConfig | undefined, unknown>
    >;
    discovery: ZodOptional<
      ZodObject<
        {
          wideArea: ZodOptional<
            ZodObject<
              {
                enabled: ZodOptional<ZodBoolean>;
                domain: ZodOptional<ZodString>;
              },
              $strict
            >
          >;
          mdns: ZodOptional<
            ZodObject<
              {
                mode: ZodOptional<
                  ZodEnum<{
                    off: "off";
                    full: "full";
                    minimal: "minimal";
                  }>
                >;
              },
              $strict
            >
          >;
        },
        $strict
      >
    >;
    talk: ZodOptional<
      ZodObject<
        {
          provider: ZodOptional<ZodString>;
          providers: ZodOptional<
            ZodRecord<
              ZodString,
              ZodObject<
                {
                  apiKey: ZodOptional<
                    ZodUnion<
                      readonly [
                        ZodString,
                        ZodDiscriminatedUnion<
                          [
                            ZodObject<
                              {
                                source: ZodLiteral<"env">;
                                provider: ZodString;
                                id: ZodString;
                              },
                              $strict
                            >,
                            ZodObject<
                              {
                                source: ZodLiteral<"file">;
                                provider: ZodString;
                                id: ZodString;
                              },
                              $strict
                            >,
                            ZodObject<
                              {
                                source: ZodLiteral<"exec">;
                                provider: ZodString;
                                id: ZodString;
                              },
                              $strict
                            >,
                          ],
                          "source"
                        >,
                      ]
                    >
                  >;
                },
                $catchall<ZodUnknown>
              >
            >
          >;
          realtime: ZodOptional<
            ZodObject<
              {
                provider: ZodOptional<ZodString>;
                providers: ZodOptional<
                  ZodRecord<
                    ZodString,
                    ZodObject<
                      {
                        apiKey: ZodOptional<
                          ZodUnion<
                            readonly [
                              ZodString,
                              ZodDiscriminatedUnion<
                                [
                                  ZodObject<
                                    {
                                      source: ZodLiteral<"env">;
                                      provider: ZodString;
                                      id: ZodString;
                                    },
                                    $strict
                                  >,
                                  ZodObject<
                                    {
                                      source: ZodLiteral<"file">;
                                      provider: ZodString;
                                      id: ZodString;
                                    },
                                    $strict
                                  >,
                                  ZodObject<
                                    {
                                      source: ZodLiteral<"exec">;
                                      provider: ZodString;
                                      id: ZodString;
                                    },
                                    $strict
                                  >,
                                ],
                                "source"
                              >,
                            ]
                          >
                        >;
                      },
                      $catchall<ZodUnknown>
                    >
                  >
                >;
                model: ZodOptional<ZodString>;
                speakerVoice: ZodOptional<ZodString>;
                speakerVoiceId: ZodOptional<ZodString>;
                voice: ZodOptional<ZodString>;
                instructions: ZodOptional<ZodString>;
                mode: ZodOptional<
                  ZodEnum<{
                    realtime: "realtime";
                    "stt-tts": "stt-tts";
                    transcription: "transcription";
                  }>
                >;
                transport: ZodOptional<
                  ZodEnum<{
                    webrtc: "webrtc";
                    "provider-websocket": "provider-websocket";
                    "gateway-relay": "gateway-relay";
                    "managed-room": "managed-room";
                  }>
                >;
                vadThreshold: ZodOptional<ZodNumber>;
                silenceDurationMs: ZodOptional<ZodNumber>;
                prefixPaddingMs: ZodOptional<ZodNumber>;
                reasoningEffort: ZodOptional<ZodString>;
                brain: ZodOptional<
                  ZodEnum<{
                    none: "none";
                    "agent-consult": "agent-consult";
                    "direct-tools": "direct-tools";
                  }>
                >;
                consultRouting: ZodOptional<
                  ZodEnum<{
                    "provider-direct": "provider-direct";
                    "force-agent-consult": "force-agent-consult";
                  }>
                >;
              },
              $strict
            >
          >;
          consultThinkingLevel: ZodOptional<
            ZodEnum<{
              off: "off";
              minimal: "minimal";
              low: "low";
              medium: "medium";
              high: "high";
              xhigh: "xhigh";
              adaptive: "adaptive";
              max: "max";
              ultra: "ultra";
            }>
          >;
          consultFastMode: ZodOptional<ZodBoolean>;
          speechLocale: ZodOptional<ZodString>;
          interruptOnSpeech: ZodOptional<ZodBoolean>;
          silenceTimeoutMs: ZodOptional<ZodNumber>;
        },
        $strict
      >
    >;
    gateway: ZodOptional<
      ZodObject<
        {
          port: ZodOptional<ZodNumber>;
          mode: ZodOptional<ZodUnion<readonly [ZodLiteral<"local">, ZodLiteral<"remote">]>>;
          bind: ZodOptional<
            ZodUnion<
              readonly [
                ZodLiteral<"auto">,
                ZodLiteral<"lan">,
                ZodLiteral<"loopback">,
                ZodLiteral<"custom">,
                ZodLiteral<"tailnet">,
              ]
            >
          >;
          customBindHost: ZodOptional<ZodString>;
          controlUi: ZodOptional<
            ZodObject<
              {
                enabled: ZodOptional<ZodBoolean>;
                basePath: ZodOptional<ZodString>;
                root: ZodOptional<ZodString>;
                toolTitles: ZodOptional<ZodBoolean>;
                embedSandbox: ZodOptional<
                  ZodUnion<
                    readonly [ZodLiteral<"strict">, ZodLiteral<"scripts">, ZodLiteral<"trusted">]
                  >
                >;
                allowExternalEmbedUrls: ZodOptional<ZodBoolean>;
                chatMessageMaxWidth: ZodOptional<ZodPipe<ZodString, ZodTransform<string, string>>>;
                allowedOrigins: ZodOptional<ZodArray<ZodString>>;
                dangerouslyAllowHostHeaderOriginFallback: ZodOptional<ZodBoolean>;
                allowInsecureAuth: ZodOptional<ZodBoolean>;
                dangerouslyDisableDeviceAuth: ZodOptional<ZodBoolean>;
              },
              $strict
            >
          >;
          terminal: ZodOptional<
            ZodObject<
              {
                enabled: ZodOptional<ZodBoolean>;
                shell: ZodOptional<ZodString>;
                detachedSessionTimeoutSeconds: ZodOptional<ZodNumber>;
              },
              $strict
            >
          >;
          auth: ZodOptional<
            ZodObject<
              {
                mode: ZodOptional<
                  ZodUnion<
                    readonly [
                      ZodLiteral<"none">,
                      ZodLiteral<"token">,
                      ZodLiteral<"password">,
                      ZodLiteral<"trusted-proxy">,
                    ]
                  >
                >;
                token: ZodOptional<
                  ZodUnion<
                    readonly [
                      ZodString,
                      ZodDiscriminatedUnion<
                        [
                          ZodObject<
                            {
                              source: ZodLiteral<"env">;
                              provider: ZodString;
                              id: ZodString;
                            },
                            $strict
                          >,
                          ZodObject<
                            {
                              source: ZodLiteral<"file">;
                              provider: ZodString;
                              id: ZodString;
                            },
                            $strict
                          >,
                          ZodObject<
                            {
                              source: ZodLiteral<"exec">;
                              provider: ZodString;
                              id: ZodString;
                            },
                            $strict
                          >,
                        ],
                        "source"
                      >,
                    ]
                  >
                >;
                password: ZodOptional<
                  ZodUnion<
                    readonly [
                      ZodString,
                      ZodDiscriminatedUnion<
                        [
                          ZodObject<
                            {
                              source: ZodLiteral<"env">;
                              provider: ZodString;
                              id: ZodString;
                            },
                            $strict
                          >,
                          ZodObject<
                            {
                              source: ZodLiteral<"file">;
                              provider: ZodString;
                              id: ZodString;
                            },
                            $strict
                          >,
                          ZodObject<
                            {
                              source: ZodLiteral<"exec">;
                              provider: ZodString;
                              id: ZodString;
                            },
                            $strict
                          >,
                        ],
                        "source"
                      >,
                    ]
                  >
                >;
                allowTailscale: ZodOptional<ZodBoolean>;
                rateLimit: ZodOptional<
                  ZodObject<
                    {
                      maxAttempts: ZodOptional<ZodNumber>;
                      windowMs: ZodOptional<ZodNumber>;
                      lockoutMs: ZodOptional<ZodNumber>;
                      exemptLoopback: ZodOptional<ZodBoolean>;
                    },
                    $strict
                  >
                >;
                trustedProxy: ZodOptional<
                  ZodObject<
                    {
                      userHeader: ZodString;
                      requiredHeaders: ZodOptional<ZodArray<ZodString>>;
                      allowUsers: ZodOptional<ZodArray<ZodString>>;
                      allowLoopback: ZodOptional<ZodBoolean>;
                    },
                    $strict
                  >
                >;
              },
              $strict
            >
          >;
          trustedProxies: ZodOptional<ZodArray<ZodString>>;
          allowRealIpFallback: ZodOptional<ZodBoolean>;
          tools: ZodOptional<
            ZodObject<
              {
                deny: ZodOptional<ZodArray<ZodString>>;
                allow: ZodOptional<ZodArray<ZodString>>;
              },
              $strict
            >
          >;
          handshakeTimeoutMs: ZodOptional<ZodNumber>;
          channelHealthCheckMinutes: ZodOptional<ZodNumber>;
          channelStaleEventThresholdMinutes: ZodOptional<ZodNumber>;
          channelMaxRestartsPerHour: ZodOptional<ZodNumber>;
          tailscale: ZodOptional<
            ZodObject<
              {
                mode: ZodOptional<
                  ZodUnion<readonly [ZodLiteral<"off">, ZodLiteral<"serve">, ZodLiteral<"funnel">]>
                >;
                resetOnExit: ZodOptional<ZodBoolean>;
                serviceName: ZodOptional<ZodString>;
                preserveFunnel: ZodOptional<ZodBoolean>;
              },
              $strict
            >
          >;
          remote: ZodOptional<
            ZodObject<
              {
                url: ZodOptional<ZodString>;
                transport: ZodOptional<
                  ZodUnion<readonly [ZodLiteral<"ssh">, ZodLiteral<"direct">]>
                >;
                remotePort: ZodOptional<ZodNumber>;
                token: ZodOptional<
                  ZodUnion<
                    readonly [
                      ZodString,
                      ZodDiscriminatedUnion<
                        [
                          ZodObject<
                            {
                              source: ZodLiteral<"env">;
                              provider: ZodString;
                              id: ZodString;
                            },
                            $strict
                          >,
                          ZodObject<
                            {
                              source: ZodLiteral<"file">;
                              provider: ZodString;
                              id: ZodString;
                            },
                            $strict
                          >,
                          ZodObject<
                            {
                              source: ZodLiteral<"exec">;
                              provider: ZodString;
                              id: ZodString;
                            },
                            $strict
                          >,
                        ],
                        "source"
                      >,
                    ]
                  >
                >;
                password: ZodOptional<
                  ZodUnion<
                    readonly [
                      ZodString,
                      ZodDiscriminatedUnion<
                        [
                          ZodObject<
                            {
                              source: ZodLiteral<"env">;
                              provider: ZodString;
                              id: ZodString;
                            },
                            $strict
                          >,
                          ZodObject<
                            {
                              source: ZodLiteral<"file">;
                              provider: ZodString;
                              id: ZodString;
                            },
                            $strict
                          >,
                          ZodObject<
                            {
                              source: ZodLiteral<"exec">;
                              provider: ZodString;
                              id: ZodString;
                            },
                            $strict
                          >,
                        ],
                        "source"
                      >,
                    ]
                  >
                >;
                tlsFingerprint: ZodOptional<ZodString>;
                sshTarget: ZodOptional<ZodString>;
                sshIdentity: ZodOptional<ZodString>;
                sshHostKeyPolicy: ZodOptional<
                  ZodUnion<readonly [ZodLiteral<"strict">, ZodLiteral<"openssh">]>
                >;
              },
              $strict
            >
          >;
          reload: ZodOptional<
            ZodObject<
              {
                mode: ZodOptional<
                  ZodUnion<
                    readonly [
                      ZodLiteral<"off">,
                      ZodLiteral<"restart">,
                      ZodLiteral<"hot">,
                      ZodLiteral<"hybrid">,
                    ]
                  >
                >;
                debounceMs: ZodOptional<ZodNumber>;
                deferralTimeoutMs: ZodOptional<ZodNumber>;
              },
              $strict
            >
          >;
          tls: ZodOptional<
            ZodObject<
              {
                enabled: ZodOptional<ZodBoolean>;
                autoGenerate: ZodOptional<ZodBoolean>;
                certPath: ZodOptional<ZodString>;
                keyPath: ZodOptional<ZodString>;
                caPath: ZodOptional<ZodString>;
              },
              $strip
            >
          >;
          http: ZodOptional<
            ZodObject<
              {
                endpoints: ZodOptional<
                  ZodObject<
                    {
                      chatCompletions: ZodOptional<
                        ZodObject<
                          {
                            enabled: ZodOptional<ZodBoolean>;
                            maxBodyBytes: ZodOptional<ZodNumber>;
                            maxImageParts: ZodOptional<ZodNumber>;
                            maxTotalImageBytes: ZodOptional<ZodNumber>;
                            images: ZodOptional<
                              ZodObject<
                                {
                                  allowUrl: ZodOptional<ZodBoolean>;
                                  urlAllowlist: ZodOptional<ZodArray<ZodString>>;
                                  allowedMimes: ZodOptional<ZodArray<ZodString>>;
                                  maxBytes: ZodOptional<ZodNumber>;
                                  maxRedirects: ZodOptional<ZodNumber>;
                                  timeoutMs: ZodOptional<ZodNumber>;
                                },
                                $strict
                              >
                            >;
                          },
                          $strict
                        >
                      >;
                      responses: ZodOptional<
                        ZodObject<
                          {
                            enabled: ZodOptional<ZodBoolean>;
                            maxBodyBytes: ZodOptional<ZodNumber>;
                            maxUrlParts: ZodOptional<ZodNumber>;
                            files: ZodOptional<
                              ZodObject<
                                {
                                  maxChars: ZodOptional<ZodNumber>;
                                  pdf: ZodOptional<
                                    ZodObject<
                                      {
                                        maxPages: ZodOptional<ZodNumber>;
                                        maxPixels: ZodOptional<ZodNumber>;
                                        minTextChars: ZodOptional<ZodNumber>;
                                      },
                                      $strict
                                    >
                                  >;
                                  allowUrl: ZodOptional<ZodBoolean>;
                                  urlAllowlist: ZodOptional<ZodArray<ZodString>>;
                                  allowedMimes: ZodOptional<ZodArray<ZodString>>;
                                  maxBytes: ZodOptional<ZodNumber>;
                                  maxRedirects: ZodOptional<ZodNumber>;
                                  timeoutMs: ZodOptional<ZodNumber>;
                                },
                                $strict
                              >
                            >;
                            images: ZodOptional<
                              ZodObject<
                                {
                                  allowUrl: ZodOptional<ZodBoolean>;
                                  urlAllowlist: ZodOptional<ZodArray<ZodString>>;
                                  allowedMimes: ZodOptional<ZodArray<ZodString>>;
                                  maxBytes: ZodOptional<ZodNumber>;
                                  maxRedirects: ZodOptional<ZodNumber>;
                                  timeoutMs: ZodOptional<ZodNumber>;
                                },
                                $strict
                              >
                            >;
                          },
                          $strict
                        >
                      >;
                    },
                    $strict
                  >
                >;
                securityHeaders: ZodOptional<
                  ZodObject<
                    {
                      strictTransportSecurity: ZodOptional<
                        ZodUnion<readonly [ZodString, ZodLiteral<false>]>
                      >;
                    },
                    $strict
                  >
                >;
              },
              $strict
            >
          >;
          push: ZodOptional<
            ZodObject<
              {
                apns: ZodOptional<
                  ZodObject<
                    {
                      relay: ZodOptional<
                        ZodObject<
                          {
                            baseUrl: ZodOptional<ZodString>;
                            timeoutMs: ZodOptional<ZodNumber>;
                          },
                          $strict
                        >
                      >;
                    },
                    $strict
                  >
                >;
              },
              $strict
            >
          >;
          nodes: ZodOptional<
            ZodObject<
              {
                browser: ZodOptional<
                  ZodObject<
                    {
                      mode: ZodOptional<
                        ZodUnion<
                          readonly [ZodLiteral<"auto">, ZodLiteral<"manual">, ZodLiteral<"off">]
                        >
                      >;
                      node: ZodOptional<ZodString>;
                    },
                    $strict
                  >
                >;
                pairing: ZodOptional<
                  ZodObject<
                    {
                      autoApproveCidrs: ZodOptional<ZodArray<ZodString>>;
                      sshVerify: ZodOptional<
                        ZodUnion<
                          readonly [
                            ZodBoolean,
                            ZodObject<
                              {
                                user: ZodOptional<ZodString>;
                                identity: ZodOptional<ZodString>;
                                timeoutMs: ZodOptional<ZodNumber>;
                                cidrs: ZodOptional<ZodArray<ZodString>>;
                              },
                              $strict
                            >,
                          ]
                        >
                      >;
                    },
                    $strict
                  >
                >;
                pluginTools: ZodOptional<
                  ZodObject<
                    {
                      enabled: ZodOptional<ZodBoolean>;
                    },
                    $strict
                  >
                >;
                skills: ZodOptional<
                  ZodObject<
                    {
                      enabled: ZodOptional<ZodBoolean>;
                    },
                    $strict
                  >
                >;
                allowCommands: ZodOptional<ZodArray<ZodString>>;
                denyCommands: ZodOptional<ZodArray<ZodString>>;
              },
              $strict
            >
          >;
        },
        $strict
      >
    >;
    cloudWorkers: ZodOptional<
      ZodObject<
        {
          profiles: ZodOptional<
            ZodRecord<
              ZodString,
              ZodObject<
                {
                  provider: ZodString;
                  install: ZodDefault<
                    ZodOptional<
                      ZodEnum<{
                        npm: "npm";
                        bundle: "bundle";
                      }>
                    >
                  >;
                  settings: ZodOptional<ZodRecord<ZodString, ZodUnknown>>;
                  lifetime: ZodOptional<
                    ZodObject<
                      {
                        idleTimeoutMinutes: ZodOptional<ZodNumber>;
                        maxLifetimeMinutes: ZodOptional<ZodNumber>;
                      },
                      $strict
                    >
                  >;
                },
                $strict
              >
            >
          >;
        },
        $strict
      >
    >;
    memory: ZodOptional<
      ZodObject<
        {
          backend: ZodOptional<ZodUnion<readonly [ZodLiteral<"builtin">, ZodLiteral<"qmd">]>>;
          citations: ZodOptional<
            ZodUnion<readonly [ZodLiteral<"auto">, ZodLiteral<"on">, ZodLiteral<"off">]>
          >;
          qmd: ZodOptional<
            ZodObject<
              {
                command: ZodOptional<ZodString>;
                mcporter: ZodOptional<
                  ZodObject<
                    {
                      enabled: ZodOptional<ZodBoolean>;
                      serverName: ZodOptional<ZodString>;
                      startDaemon: ZodOptional<ZodBoolean>;
                    },
                    $strict
                  >
                >;
                searchMode: ZodOptional<
                  ZodUnion<
                    readonly [ZodLiteral<"query">, ZodLiteral<"search">, ZodLiteral<"vsearch">]
                  >
                >;
                rerank: ZodOptional<ZodBoolean>;
                searchTool: ZodOptional<ZodString>;
                includeDefaultMemory: ZodOptional<ZodBoolean>;
                paths: ZodOptional<
                  ZodArray<
                    ZodObject<
                      {
                        path: ZodString;
                        name: ZodOptional<ZodString>;
                        pattern: ZodOptional<ZodString>;
                      },
                      $strict
                    >
                  >
                >;
                sessions: ZodOptional<
                  ZodObject<
                    {
                      enabled: ZodOptional<ZodBoolean>;
                      exportDir: ZodOptional<ZodString>;
                      retentionDays: ZodOptional<ZodNumber>;
                    },
                    $strict
                  >
                >;
                update: ZodOptional<
                  ZodObject<
                    {
                      interval: ZodOptional<ZodString>;
                      debounceMs: ZodOptional<ZodNumber>;
                      onBoot: ZodOptional<ZodBoolean>;
                      startup: ZodOptional<
                        ZodEnum<{
                          off: "off";
                          idle: "idle";
                          immediate: "immediate";
                        }>
                      >;
                      startupDelayMs: ZodOptional<ZodNumber>;
                      waitForBootSync: ZodOptional<ZodBoolean>;
                      embedInterval: ZodOptional<ZodString>;
                      commandTimeoutMs: ZodOptional<ZodNumber>;
                      updateTimeoutMs: ZodOptional<ZodNumber>;
                      embedTimeoutMs: ZodOptional<ZodNumber>;
                    },
                    $strict
                  >
                >;
                limits: ZodOptional<
                  ZodObject<
                    {
                      maxResults: ZodOptional<ZodNumber>;
                      maxSnippetChars: ZodOptional<ZodNumber>;
                      maxInjectedChars: ZodOptional<ZodNumber>;
                      timeoutMs: ZodOptional<ZodNumber>;
                    },
                    $strict
                  >
                >;
                scope: ZodOptional<
                  ZodOptional<
                    ZodObject<
                      {
                        default: ZodOptional<
                          ZodUnion<readonly [ZodLiteral<"allow">, ZodLiteral<"deny">]>
                        >;
                        rules: ZodOptional<
                          ZodArray<
                            ZodObject<
                              {
                                action: ZodUnion<
                                  readonly [ZodLiteral<"allow">, ZodLiteral<"deny">]
                                >;
                                match: ZodOptional<
                                  ZodObject<
                                    {
                                      channel: ZodOptional<ZodString>;
                                      chatType: ZodOptional<
                                        ZodUnion<
                                          readonly [
                                            ZodLiteral<"direct">,
                                            ZodLiteral<"group">,
                                            ZodLiteral<"channel">,
                                            ZodLiteral<"dm">,
                                          ]
                                        >
                                      >;
                                      keyPrefix: ZodOptional<ZodString>;
                                      rawKeyPrefix: ZodOptional<ZodString>;
                                    },
                                    $strict
                                  >
                                >;
                              },
                              $strict
                            >
                          >
                        >;
                      },
                      $strict
                    >
                  >
                >;
              },
              $strict
            >
          >;
        },
        $strict
      >
    >;
    mcp: ZodOptional<
      ZodObject<
        {
          servers: ZodOptional<
            ZodRecord<
              ZodString,
              ZodObject<
                {
                  enabled: ZodOptional<ZodBoolean>;
                  command: ZodOptional<ZodString>;
                  args: ZodOptional<ZodArray<ZodString>>;
                  env: ZodOptional<
                    ZodRecord<ZodString, ZodUnion<readonly [ZodString, ZodNumber, ZodBoolean]>>
                  >;
                  cwd: ZodOptional<ZodString>;
                  workingDirectory: ZodOptional<ZodString>;
                  url: ZodOptional<ZodString>;
                  transport: ZodOptional<
                    ZodUnion<
                      readonly [
                        ZodLiteral<"stdio">,
                        ZodLiteral<"sse">,
                        ZodLiteral<"streamable-http">,
                      ]
                    >
                  >;
                  headers: ZodOptional<
                    ZodRecord<ZodString, ZodUnion<readonly [ZodString, ZodNumber, ZodBoolean]>>
                  >;
                  connectionTimeoutMs: ZodOptional<ZodNumber>;
                  connectTimeout: ZodOptional<ZodNumber>;
                  connect_timeout: ZodOptional<ZodNumber>;
                  requestTimeoutMs: ZodOptional<ZodNumber>;
                  timeout: ZodOptional<ZodNumber>;
                  supportsParallelToolCalls: ZodOptional<ZodBoolean>;
                  supports_parallel_tool_calls: ZodOptional<ZodBoolean>;
                  auth: ZodOptional<ZodLiteral<"oauth">>;
                  oauth: ZodOptional<
                    ZodObject<
                      {
                        authProfileId: ZodOptional<ZodString>;
                        scope: ZodOptional<ZodString>;
                        redirectUrl: ZodOptional<ZodString>;
                        clientMetadataUrl: ZodOptional<ZodString>;
                      },
                      $strict
                    >
                  >;
                  sslVerify: ZodOptional<ZodBoolean>;
                  ssl_verify: ZodOptional<ZodBoolean>;
                  clientCert: ZodOptional<ZodString>;
                  client_cert: ZodOptional<ZodString>;
                  clientKey: ZodOptional<ZodString>;
                  client_key: ZodOptional<ZodString>;
                  toolFilter: ZodOptional<
                    ZodObject<
                      {
                        include: ZodOptional<ZodArray<ZodString>>;
                        exclude: ZodOptional<ZodArray<ZodString>>;
                      },
                      $strict
                    >
                  >;
                  codex: ZodOptional<
                    ZodObject<
                      {
                        agents: ZodOptional<ZodArray<ZodString>>;
                        defaultToolsApprovalMode: ZodOptional<
                          ZodEnum<{
                            auto: "auto";
                            prompt: "prompt";
                            approve: "approve";
                          }>
                        >;
                        default_tools_approval_mode: ZodOptional<
                          ZodEnum<{
                            auto: "auto";
                            prompt: "prompt";
                            approve: "approve";
                          }>
                        >;
                      },
                      $strict
                    >
                  >;
                },
                $catchall<ZodUnknown>
              >
            >
          >;
          apps: ZodOptional<
            ZodObject<
              {
                enabled: ZodOptional<ZodBoolean>;
                sandboxOrigin: ZodOptional<ZodString>;
                sandboxPort: ZodOptional<ZodNumber>;
              },
              $strict
            >
          >;
          sessionIdleTtlMs: ZodOptional<ZodNumber>;
        },
        $strict
      >
    >;
    skills: ZodOptional<
      ZodObject<
        {
          allowBundled: ZodOptional<ZodArray<ZodString>>;
          load: ZodOptional<
            ZodObject<
              {
                extraDirs: ZodOptional<ZodArray<ZodString>>;
                allowSymlinkTargets: ZodOptional<ZodArray<ZodString>>;
                watch: ZodOptional<ZodBoolean>;
                watchDebounceMs: ZodOptional<ZodNumber>;
              },
              $strict
            >
          >;
          install: ZodOptional<
            ZodObject<
              {
                preferBrew: ZodOptional<ZodBoolean>;
                nodeManager: ZodOptional<
                  ZodUnion<
                    readonly [
                      ZodLiteral<"npm">,
                      ZodLiteral<"pnpm">,
                      ZodLiteral<"yarn">,
                      ZodLiteral<"bun">,
                    ]
                  >
                >;
                allowUploadedArchives: ZodOptional<ZodBoolean>;
              },
              $strict
            >
          >;
          limits: ZodOptional<
            ZodObject<
              {
                maxCandidatesPerRoot: ZodOptional<ZodNumber>;
                maxSkillsLoadedPerSource: ZodOptional<ZodNumber>;
                maxSkillsInPrompt: ZodOptional<ZodNumber>;
                maxSkillsPromptChars: ZodOptional<ZodNumber>;
                maxSkillFileBytes: ZodOptional<ZodNumber>;
              },
              $strict
            >
          >;
          workshop: ZodOptional<
            ZodObject<
              {
                autonomous: ZodOptional<
                  ZodObject<
                    {
                      enabled: ZodOptional<ZodBoolean>;
                    },
                    $strict
                  >
                >;
                approvalPolicy: ZodOptional<
                  ZodUnion<readonly [ZodLiteral<"pending">, ZodLiteral<"auto">]>
                >;
                allowSymlinkTargetWrites: ZodOptional<ZodBoolean>;
                maxPending: ZodOptional<ZodNumber>;
                maxSkillBytes: ZodOptional<ZodNumber>;
              },
              $strict
            >
          >;
          entries: ZodOptional<
            ZodRecord<
              ZodString,
              ZodObject<
                {
                  enabled: ZodOptional<ZodBoolean>;
                  apiKey: ZodOptional<
                    ZodUnion<
                      readonly [
                        ZodString,
                        ZodDiscriminatedUnion<
                          [
                            ZodObject<
                              {
                                source: ZodLiteral<"env">;
                                provider: ZodString;
                                id: ZodString;
                              },
                              $strict
                            >,
                            ZodObject<
                              {
                                source: ZodLiteral<"file">;
                                provider: ZodString;
                                id: ZodString;
                              },
                              $strict
                            >,
                            ZodObject<
                              {
                                source: ZodLiteral<"exec">;
                                provider: ZodString;
                                id: ZodString;
                              },
                              $strict
                            >,
                          ],
                          "source"
                        >,
                      ]
                    >
                  >;
                  env: ZodOptional<ZodRecord<ZodString, ZodString>>;
                  config: ZodOptional<ZodRecord<ZodString, ZodUnknown>>;
                },
                $strict
              >
            >
          >;
        },
        $strict
      >
    >;
    plugins: ZodOptional<
      ZodObject<
        {
          enabled: ZodOptional<ZodBoolean>;
          allow: ZodOptional<ZodArray<ZodString>>;
          deny: ZodOptional<ZodArray<ZodString>>;
          load: ZodOptional<
            ZodObject<
              {
                paths: ZodOptional<ZodArray<ZodString>>;
              },
              $strict
            >
          >;
          slots: ZodOptional<
            ZodObject<
              {
                memory: ZodOptional<ZodString>;
                contextEngine: ZodOptional<ZodString>;
              },
              $strict
            >
          >;
          entries: ZodOptional<
            ZodRecord<
              ZodString,
              ZodObject<
                {
                  enabled: ZodOptional<ZodBoolean>;
                  hooks: ZodOptional<
                    ZodObject<
                      {
                        allowPromptInjection: ZodOptional<ZodBoolean>;
                        allowConversationAccess: ZodOptional<ZodBoolean>;
                        timeoutMs: ZodOptional<ZodNumber>;
                        timeouts: ZodOptional<ZodRecord<ZodString, ZodNumber>>;
                      },
                      $strict
                    >
                  >;
                  subagent: ZodOptional<
                    ZodObject<
                      {
                        allowModelOverride: ZodOptional<ZodBoolean>;
                        allowedModels: ZodOptional<ZodArray<ZodString>>;
                      },
                      $strict
                    >
                  >;
                  llm: ZodOptional<
                    ZodObject<
                      {
                        allowModelOverride: ZodOptional<ZodBoolean>;
                        allowedModels: ZodOptional<ZodArray<ZodString>>;
                        allowAgentIdOverride: ZodOptional<ZodBoolean>;
                      },
                      $strict
                    >
                  >;
                  config: ZodOptional<ZodRecord<ZodString, ZodUnknown>>;
                },
                $strict
              >
            >
          >;
          bundledDiscovery: ZodOptional<
            ZodEnum<{
              allowlist: "allowlist";
              compat: "compat";
            }>
          >;
        },
        $strict
      >
    >;
    canvasHost: ZodOptional<
      ZodObject<
        {
          enabled: ZodOptional<ZodBoolean>;
          root: ZodOptional<ZodString>;
          port: ZodOptional<ZodNumber>;
          liveReload: ZodOptional<ZodBoolean>;
        },
        $strict
      >
    >;
    surfaces: ZodOptional<
      ZodRecord<
        ZodString,
        ZodObject<
          {
            silentReply: ZodOptional<
              ZodObject<
                {
                  group: ZodOptional<
                    ZodUnion<readonly [ZodLiteral<"allow">, ZodLiteral<"disallow">]>
                  >;
                  internal: ZodOptional<
                    ZodUnion<readonly [ZodLiteral<"allow">, ZodLiteral<"disallow">]>
                  >;
                },
                $strict
              >
            >;
          },
          $strict
        >
      >
    >;
    proxy: ZodOptional<
      ZodObject<
        {
          enabled: ZodOptional<ZodBoolean>;
          proxyUrl: ZodOptional<ZodURL>;
          tls: ZodOptional<
            ZodObject<
              {
                caFile: ZodOptional<ZodString>;
              },
              $strict
            >
          >;
          loopbackMode: ZodOptional<
            ZodEnum<{
              proxy: "proxy";
              block: "block";
              "gateway-only": "gateway-only";
            }>
          >;
        },
        $strict
      >
    >;
  },
  $strict
>;
//#endregion
export { type JsonSchemaObject, OpenClawSchema, validateJsonSchemaValue };
