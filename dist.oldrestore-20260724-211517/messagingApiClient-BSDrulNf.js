import { Buffer } from "node:buffer";
import { Readable } from "node:stream";
//#region node_modules/@line/bot-sdk/dist/exceptions.js
var HTTPFetchError = class extends Error {
  status;
  statusText;
  headers;
  body;
  constructor(message, { status, statusText, headers, body }) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.statusText = statusText;
    this.headers = headers;
    this.body = body;
  }
};
const USER_AGENT = `@line/bot-sdk/11.1.0`;
//#endregion
//#region node_modules/@line/bot-sdk/dist/utils.js
const PATH_TRAVERSAL = /^(?:.*\/)?(?:\.|%2e|%2E){1,2}(?:\/.*)?$/;
function createURLSearchParams(params) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params))
    if (value != null) searchParams.append(key, String(value));
  return searchParams;
}
function encodePathParam(value, name) {
  if (value === null || value === void 0) throw new TypeError(`${name} is required`);
  return encodeURIComponent(String(value));
}
function buildPath(pathTemplate, params) {
  let path = pathTemplate;
  for (const [name, value] of Object.entries(params))
    path = path.split(`{${name}}`).join(encodePathParam(value, name));
  if (PATH_TRAVERSAL.test(path))
    throw new TypeError(`Path parameters shouldn't perform path traversal ('.' or '..'): ${path}`);
  return path;
}
//#endregion
//#region node_modules/@line/bot-sdk/dist/http-fetch.js
function convertResponseToReadable(response) {
  if (!response.body) throw new Error("Response body is null");
  const reader = response.body.getReader();
  return new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) this.push(null);
      else this.push(Buffer.from(value));
    },
  });
}
function normalizeHeaders(headers) {
  const normalized = {};
  if (!headers) return normalized;
  for (const key of Object.keys(headers)) normalized[key.toLowerCase()] = headers[key];
  return normalized;
}
function mergeHeaders(base, override) {
  const normalizedBase = normalizeHeaders(base);
  const normalizedOverride = normalizeHeaders(override);
  return {
    ...normalizedBase,
    ...normalizedOverride,
  };
}
var HTTPFetchClient = class {
  baseURL;
  defaultHeaders;
  constructor(config) {
    this.baseURL = config.baseURL;
    this.defaultHeaders = mergeHeaders({ "User-Agent": USER_AGENT }, config.defaultHeaders);
  }
  async get(url, params) {
    const requestUrl = new URL(url, this.baseURL);
    if (params) requestUrl.search = createURLSearchParams(params).toString();
    const response = await fetch(requestUrl, { headers: this.defaultHeaders });
    await this.checkResponseStatus(response);
    return response;
  }
  async post(url, body, config) {
    const requestUrl = new URL(url, this.baseURL);
    const response = await fetch(requestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.defaultHeaders,
        ...(config && config.headers),
      },
      body: JSON.stringify(body),
    });
    await this.checkResponseStatus(response);
    return response;
  }
  async put(url, body, config) {
    const requestUrl = new URL(url, this.baseURL);
    const response = await fetch(requestUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...this.defaultHeaders,
        ...(config && config.headers),
      },
      body: JSON.stringify(body),
    });
    await this.checkResponseStatus(response);
    return response;
  }
  async postForm(url, body) {
    const requestUrl = new URL(url, this.baseURL);
    const params = body ? createURLSearchParams(body) : new URLSearchParams();
    const response = await fetch(requestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...this.defaultHeaders,
      },
      body: params.toString(),
    });
    await this.checkResponseStatus(response);
    return response;
  }
  async postFormMultipart(url, form) {
    const requestUrl = new URL(url, this.baseURL);
    const response = await fetch(requestUrl, {
      method: "POST",
      headers: { ...this.defaultHeaders },
      body: form,
    });
    await this.checkResponseStatus(response);
    return response;
  }
  async putFormMultipart(url, form, config) {
    const requestUrl = new URL(url, this.baseURL);
    const response = await fetch(requestUrl, {
      method: "PUT",
      headers: {
        ...this.defaultHeaders,
        ...(config && (config.headers ? config.headers : {})),
      },
      body: form,
    });
    await this.checkResponseStatus(response);
    return response;
  }
  async postBinaryContent(url, body) {
    const requestUrl = new URL(url, this.baseURL);
    const response = await fetch(requestUrl, {
      method: "POST",
      headers: {
        "Content-Type": body.type,
        ...this.defaultHeaders,
      },
      body,
    });
    await this.checkResponseStatus(response);
    return response;
  }
  async delete(url, params) {
    const requestUrl = new URL(url, this.baseURL);
    if (params) requestUrl.search = createURLSearchParams(params).toString();
    const response = await fetch(requestUrl, {
      method: "DELETE",
      headers: { ...this.defaultHeaders },
    });
    await this.checkResponseStatus(response);
    return response;
  }
  async checkResponseStatus(response) {
    const { ok, status, statusText, headers } = response;
    const message = `${status} - ${statusText}`;
    if (!ok)
      throw new HTTPFetchError(message, {
        status,
        statusText,
        headers,
        body: await response.text(),
      });
  }
};
//#endregion
//#region node_modules/@line/bot-sdk/dist/messaging-api/api/messagingApiClient.js
/**
 * LINE Messaging API
 * This document describes LINE Messaging API.
 *
 * The version of the OpenAPI document: 0.0.1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 * @see {@link LineBotClient} for a unified interface that wraps this client.
 */
var MessagingApiClient = class {
  httpClient;
  /**
   * Initializes a new `MessagingApiClient`.
   *
   * @param config Configuration for this API client.
   * @param config.baseURL The base URL for requests. Defaults to `https://api.line.me`.
   * @param config.channelAccessToken The channel access token used for authorization.
   * @param config.defaultHeaders Extra headers merged into every request.
   *
   * @example
   * const client = new MessagingApiClient({
   *   channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
   * });
   */
  constructor(config) {
    const baseURL = config.baseURL || "https://api.line.me";
    const defaultHeaders = mergeHeaders(config.defaultHeaders, {
      Authorization: "Bearer " + config.channelAccessToken,
    });
    this.httpClient = new HTTPFetchClient({
      defaultHeaders,
      baseURL,
    });
  }
  /**
   * Sends a message to multiple users at any time.
   * Calls `POST https://api.line.me/v2/bot/message/broadcast`.
   * To inspect the HTTP status code or response headers, use {@link broadcastWithHttpInfo}.
   * @param broadcastRequest
   * @param xLineRetryKey Retry key. Specifies the UUID in hexadecimal format (e.g., `123e4567-e89b-12d3-a456-426614174000`) generated by any method. The retry key isn't generated by LINE. Each developer must generate their own retry key.
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#send-broadcast-message">LINE Developers documentation</a>
   */
  async broadcast(broadcastRequest, xLineRetryKey) {
    return (await this.broadcastWithHttpInfo(broadcastRequest, xLineRetryKey)).body;
  }
  /**
   * Sends a message to multiple users at any time.
   * Calls `POST https://api.line.me/v2/bot/message/broadcast`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param broadcastRequest
   * @param xLineRetryKey Retry key. Specifies the UUID in hexadecimal format (e.g., `123e4567-e89b-12d3-a456-426614174000`) generated by any method. The retry key isn't generated by LINE. Each developer must generate their own retry key.
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#send-broadcast-message">LINE Developers documentation</a>
   */
  async broadcastWithHttpInfo(broadcastRequest, xLineRetryKey) {
    const params = broadcastRequest;
    const headerParams = {
      ...(xLineRetryKey != null ? { "X-Line-Retry-Key": xLineRetryKey } : {}),
    };
    const res = await this.httpClient.post("/v2/bot/message/broadcast", params, {
      headers: headerParams,
    });
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Cancel default rich menu
   * Calls `DELETE https://api.line.me/v2/bot/user/all/richmenu`.
   * To inspect the HTTP status code or response headers, use {@link cancelDefaultRichMenuWithHttpInfo}.
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#cancel-default-rich-menu">LINE Developers documentation</a>
   */
  async cancelDefaultRichMenu() {
    return (await this.cancelDefaultRichMenuWithHttpInfo()).body;
  }
  /**
   * Cancel default rich menu
   * Calls `DELETE https://api.line.me/v2/bot/user/all/richmenu`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#cancel-default-rich-menu">LINE Developers documentation</a>
   */
  async cancelDefaultRichMenuWithHttpInfo() {
    const res = await this.httpClient.delete("/v2/bot/user/all/richmenu");
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Close coupon
   * Calls `PUT https://api.line.me/v2/bot/coupon/{couponId}/close`.
   * To inspect the HTTP status code or response headers, use {@link closeCouponWithHttpInfo}.
   * @param couponId
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#discontinue-coupon">LINE Developers documentation</a>
   */
  async closeCoupon(couponId) {
    return (await this.closeCouponWithHttpInfo(couponId)).body;
  }
  /**
   * Close coupon
   * Calls `PUT https://api.line.me/v2/bot/coupon/{couponId}/close`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param couponId
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#discontinue-coupon">LINE Developers documentation</a>
   */
  async closeCouponWithHttpInfo(couponId) {
    const requestPath = buildPath("/v2/bot/coupon/{couponId}/close", { couponId });
    const res = await this.httpClient.put(requestPath);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Create a new coupon. Define coupon details such as type, title, and validity period.
   * Calls `POST https://api.line.me/v2/bot/coupon`.
   * To inspect the HTTP status code or response headers, use {@link createCouponWithHttpInfo}.
   * @param couponCreateRequest
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#create-coupon">LINE Developers documentation</a>
   */
  async createCoupon(couponCreateRequest) {
    return (await this.createCouponWithHttpInfo(couponCreateRequest)).body;
  }
  /**
   * Create a new coupon. Define coupon details such as type, title, and validity period.
   * Calls `POST https://api.line.me/v2/bot/coupon`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param couponCreateRequest
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#create-coupon">LINE Developers documentation</a>
   */
  async createCouponWithHttpInfo(couponCreateRequest) {
    const params = couponCreateRequest;
    const res = await this.httpClient.post("/v2/bot/coupon", params);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Create rich menu
   * Calls `POST https://api.line.me/v2/bot/richmenu`.
   * To inspect the HTTP status code or response headers, use {@link createRichMenuWithHttpInfo}.
   * @param richMenuRequest
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#create-rich-menu">LINE Developers documentation</a>
   */
  async createRichMenu(richMenuRequest) {
    return (await this.createRichMenuWithHttpInfo(richMenuRequest)).body;
  }
  /**
   * Create rich menu
   * Calls `POST https://api.line.me/v2/bot/richmenu`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param richMenuRequest
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#create-rich-menu">LINE Developers documentation</a>
   */
  async createRichMenuWithHttpInfo(richMenuRequest) {
    const params = richMenuRequest;
    const res = await this.httpClient.post("/v2/bot/richmenu", params);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Create rich menu alias
   * Calls `POST https://api.line.me/v2/bot/richmenu/alias`.
   * To inspect the HTTP status code or response headers, use {@link createRichMenuAliasWithHttpInfo}.
   * @param createRichMenuAliasRequest
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#create-rich-menu-alias">LINE Developers documentation</a>
   */
  async createRichMenuAlias(createRichMenuAliasRequest) {
    return (await this.createRichMenuAliasWithHttpInfo(createRichMenuAliasRequest)).body;
  }
  /**
   * Create rich menu alias
   * Calls `POST https://api.line.me/v2/bot/richmenu/alias`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param createRichMenuAliasRequest
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#create-rich-menu-alias">LINE Developers documentation</a>
   */
  async createRichMenuAliasWithHttpInfo(createRichMenuAliasRequest) {
    const params = createRichMenuAliasRequest;
    const res = await this.httpClient.post("/v2/bot/richmenu/alias", params);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Deletes a rich menu.
   * Calls `DELETE https://api.line.me/v2/bot/richmenu/{richMenuId}`.
   * To inspect the HTTP status code or response headers, use {@link deleteRichMenuWithHttpInfo}.
   * @param richMenuId ID of a rich menu
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#delete-rich-menu">LINE Developers documentation</a>
   */
  async deleteRichMenu(richMenuId) {
    return (await this.deleteRichMenuWithHttpInfo(richMenuId)).body;
  }
  /**
   * Deletes a rich menu.
   * Calls `DELETE https://api.line.me/v2/bot/richmenu/{richMenuId}`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param richMenuId ID of a rich menu
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#delete-rich-menu">LINE Developers documentation</a>
   */
  async deleteRichMenuWithHttpInfo(richMenuId) {
    const requestPath = buildPath("/v2/bot/richmenu/{richMenuId}", { richMenuId });
    const res = await this.httpClient.delete(requestPath);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Delete rich menu alias
   * Calls `DELETE https://api.line.me/v2/bot/richmenu/alias/{richMenuAliasId}`.
   * To inspect the HTTP status code or response headers, use {@link deleteRichMenuAliasWithHttpInfo}.
   * @param richMenuAliasId Rich menu alias ID that you want to delete.
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#delete-rich-menu-alias">LINE Developers documentation</a>
   */
  async deleteRichMenuAlias(richMenuAliasId) {
    return (await this.deleteRichMenuAliasWithHttpInfo(richMenuAliasId)).body;
  }
  /**
   * Delete rich menu alias
   * Calls `DELETE https://api.line.me/v2/bot/richmenu/alias/{richMenuAliasId}`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param richMenuAliasId Rich menu alias ID that you want to delete.
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#delete-rich-menu-alias">LINE Developers documentation</a>
   */
  async deleteRichMenuAliasWithHttpInfo(richMenuAliasId) {
    const requestPath = buildPath("/v2/bot/richmenu/alias/{richMenuAliasId}", { richMenuAliasId });
    const res = await this.httpClient.delete(requestPath);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Get name list of units used this month
   * Calls `GET https://api.line.me/v2/bot/message/aggregation/list`.
   * To inspect the HTTP status code or response headers, use {@link getAggregationUnitNameListWithHttpInfo}.
   * @param limit The maximum number of aggregation units you can get per request.
   * @param start Value of the continuation token found in the next property of the JSON object returned in the response. If you can't get all the aggregation units in one request, include this parameter to get the remaining array.
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-name-list-of-units-used-this-month">LINE Developers documentation</a>
   */
  async getAggregationUnitNameList(limit, start) {
    return (await this.getAggregationUnitNameListWithHttpInfo(limit, start)).body;
  }
  /**
   * Get name list of units used this month
   * Calls `GET https://api.line.me/v2/bot/message/aggregation/list`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param limit The maximum number of aggregation units you can get per request.
   * @param start Value of the continuation token found in the next property of the JSON object returned in the response. If you can't get all the aggregation units in one request, include this parameter to get the remaining array.
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-name-list-of-units-used-this-month">LINE Developers documentation</a>
   */
  async getAggregationUnitNameListWithHttpInfo(limit, start) {
    const queryParams = {
      limit,
      start,
    };
    if (queryParams["limit"] === void 0) delete queryParams["limit"];
    if (queryParams["start"] === void 0) delete queryParams["start"];
    const res = await this.httpClient.get("/v2/bot/message/aggregation/list", queryParams);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Get number of units used this month
   * Calls `GET https://api.line.me/v2/bot/message/aggregation/info`.
   * To inspect the HTTP status code or response headers, use {@link getAggregationUnitUsageWithHttpInfo}.
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-number-of-units-used-this-month">LINE Developers documentation</a>
   */
  async getAggregationUnitUsage() {
    return (await this.getAggregationUnitUsageWithHttpInfo()).body;
  }
  /**
   * Get number of units used this month
   * Calls `GET https://api.line.me/v2/bot/message/aggregation/info`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-number-of-units-used-this-month">LINE Developers documentation</a>
   */
  async getAggregationUnitUsageWithHttpInfo() {
    const res = await this.httpClient.get("/v2/bot/message/aggregation/info");
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Get bot info
   * Calls `GET https://api.line.me/v2/bot/info`.
   * To inspect the HTTP status code or response headers, use {@link getBotInfoWithHttpInfo}.
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-bot-info">LINE Developers documentation</a>
   */
  async getBotInfo() {
    return (await this.getBotInfoWithHttpInfo()).body;
  }
  /**
   * Get bot info
   * Calls `GET https://api.line.me/v2/bot/info`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-bot-info">LINE Developers documentation</a>
   */
  async getBotInfoWithHttpInfo() {
    const res = await this.httpClient.get("/v2/bot/info");
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Get coupon detail
   * Calls `GET https://api.line.me/v2/bot/coupon/{couponId}`.
   * To inspect the HTTP status code or response headers, use {@link getCouponDetailWithHttpInfo}.
   * @param couponId
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-coupon">LINE Developers documentation</a>
   */
  async getCouponDetail(couponId) {
    return (await this.getCouponDetailWithHttpInfo(couponId)).body;
  }
  /**
   * Get coupon detail
   * Calls `GET https://api.line.me/v2/bot/coupon/{couponId}`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param couponId
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-coupon">LINE Developers documentation</a>
   */
  async getCouponDetailWithHttpInfo(couponId) {
    const requestPath = buildPath("/v2/bot/coupon/{couponId}", { couponId });
    const res = await this.httpClient.get(requestPath);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Gets the ID of the default rich menu set with the Messaging API.
   * Calls `GET https://api.line.me/v2/bot/user/all/richmenu`.
   * To inspect the HTTP status code or response headers, use {@link getDefaultRichMenuIdWithHttpInfo}.
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-default-rich-menu-id">LINE Developers documentation</a>
   */
  async getDefaultRichMenuId() {
    return (await this.getDefaultRichMenuIdWithHttpInfo()).body;
  }
  /**
   * Gets the ID of the default rich menu set with the Messaging API.
   * Calls `GET https://api.line.me/v2/bot/user/all/richmenu`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-default-rich-menu-id">LINE Developers documentation</a>
   */
  async getDefaultRichMenuIdWithHttpInfo() {
    const res = await this.httpClient.get("/v2/bot/user/all/richmenu");
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Get a list of users who added your LINE Official Account as a friend
   * Calls `GET https://api.line.me/v2/bot/followers/ids`.
   * To inspect the HTTP status code or response headers, use {@link getFollowersWithHttpInfo}.
   * @param start Value of the continuation token found in the next property of the JSON object returned in the response. Include this parameter to get the next array of user IDs.
   * @param limit The maximum number of user IDs to retrieve in a single request.
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-follower-ids">LINE Developers documentation</a>
   */
  async getFollowers(start, limit) {
    return (await this.getFollowersWithHttpInfo(start, limit)).body;
  }
  /**
   * Get a list of users who added your LINE Official Account as a friend
   * Calls `GET https://api.line.me/v2/bot/followers/ids`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param start Value of the continuation token found in the next property of the JSON object returned in the response. Include this parameter to get the next array of user IDs.
   * @param limit The maximum number of user IDs to retrieve in a single request.
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-follower-ids">LINE Developers documentation</a>
   */
  async getFollowersWithHttpInfo(start, limit) {
    const queryParams = {
      start,
      limit,
    };
    if (queryParams["start"] === void 0) delete queryParams["start"];
    if (queryParams["limit"] === void 0) delete queryParams["limit"];
    const res = await this.httpClient.get("/v2/bot/followers/ids", queryParams);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Get number of users in a group chat
   * Calls `GET https://api.line.me/v2/bot/group/{groupId}/members/count`.
   * To inspect the HTTP status code or response headers, use {@link getGroupMemberCountWithHttpInfo}.
   * @param groupId Group ID
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-members-group-count">LINE Developers documentation</a>
   */
  async getGroupMemberCount(groupId) {
    return (await this.getGroupMemberCountWithHttpInfo(groupId)).body;
  }
  /**
   * Get number of users in a group chat
   * Calls `GET https://api.line.me/v2/bot/group/{groupId}/members/count`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param groupId Group ID
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-members-group-count">LINE Developers documentation</a>
   */
  async getGroupMemberCountWithHttpInfo(groupId) {
    const requestPath = buildPath("/v2/bot/group/{groupId}/members/count", { groupId });
    const res = await this.httpClient.get(requestPath);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Get group chat member profile
   * Calls `GET https://api.line.me/v2/bot/group/{groupId}/member/{userId}`.
   * To inspect the HTTP status code or response headers, use {@link getGroupMemberProfileWithHttpInfo}.
   * @param groupId Group ID
   * @param userId User ID
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-group-member-profile">LINE Developers documentation</a>
   */
  async getGroupMemberProfile(groupId, userId) {
    return (await this.getGroupMemberProfileWithHttpInfo(groupId, userId)).body;
  }
  /**
   * Get group chat member profile
   * Calls `GET https://api.line.me/v2/bot/group/{groupId}/member/{userId}`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param groupId Group ID
   * @param userId User ID
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-group-member-profile">LINE Developers documentation</a>
   */
  async getGroupMemberProfileWithHttpInfo(groupId, userId) {
    const requestPath = buildPath("/v2/bot/group/{groupId}/member/{userId}", {
      groupId,
      userId,
    });
    const res = await this.httpClient.get(requestPath);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Get group chat member user IDs
   * Calls `GET https://api.line.me/v2/bot/group/{groupId}/members/ids`.
   * To inspect the HTTP status code or response headers, use {@link getGroupMembersIdsWithHttpInfo}.
   * @param groupId Group ID
   * @param start Value of the continuation token found in the `next` property of the JSON object returned in the response. Include this parameter to get the next array of user IDs for the members of the group.
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-group-member-user-ids">LINE Developers documentation</a>
   */
  async getGroupMembersIds(groupId, start) {
    return (await this.getGroupMembersIdsWithHttpInfo(groupId, start)).body;
  }
  /**
   * Get group chat member user IDs
   * Calls `GET https://api.line.me/v2/bot/group/{groupId}/members/ids`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param groupId Group ID
   * @param start Value of the continuation token found in the `next` property of the JSON object returned in the response. Include this parameter to get the next array of user IDs for the members of the group.
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-group-member-user-ids">LINE Developers documentation</a>
   */
  async getGroupMembersIdsWithHttpInfo(groupId, start) {
    const requestPath = buildPath("/v2/bot/group/{groupId}/members/ids", { groupId });
    const queryParams = { start };
    if (queryParams["start"] === void 0) delete queryParams["start"];
    const res = await this.httpClient.get(requestPath, queryParams);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Get group chat summary
   * Calls `GET https://api.line.me/v2/bot/group/{groupId}/summary`.
   * To inspect the HTTP status code or response headers, use {@link getGroupSummaryWithHttpInfo}.
   * @param groupId Group ID
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-group-summary">LINE Developers documentation</a>
   */
  async getGroupSummary(groupId) {
    return (await this.getGroupSummaryWithHttpInfo(groupId)).body;
  }
  /**
   * Get group chat summary
   * Calls `GET https://api.line.me/v2/bot/group/{groupId}/summary`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param groupId Group ID
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-group-summary">LINE Developers documentation</a>
   */
  async getGroupSummaryWithHttpInfo(groupId) {
    const requestPath = buildPath("/v2/bot/group/{groupId}/summary", { groupId });
    const res = await this.httpClient.get(requestPath);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Get a list of user IDs who joined the membership.
   * Calls `GET https://api.line.me/v2/bot/membership/{membershipId}/users/ids`.
   * To inspect the HTTP status code or response headers, use {@link getJoinedMembershipUsersWithHttpInfo}.
   * @param membershipId Membership plan ID.
   * @param start A continuation token to get next remaining membership user IDs. Returned only when there are remaining user IDs that weren't returned in the userIds property in the previous request. The continuation token expires in 24 hours (86,400 seconds).
   * @param limit The max number of items to return for this API call. The value is set to 300 by default, but the max acceptable value is 1000.
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-membership-user-ids">LINE Developers documentation</a>
   */
  async getJoinedMembershipUsers(membershipId, start, limit) {
    return (await this.getJoinedMembershipUsersWithHttpInfo(membershipId, start, limit)).body;
  }
  /**
   * Get a list of user IDs who joined the membership.
   * Calls `GET https://api.line.me/v2/bot/membership/{membershipId}/users/ids`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param membershipId Membership plan ID.
   * @param start A continuation token to get next remaining membership user IDs. Returned only when there are remaining user IDs that weren't returned in the userIds property in the previous request. The continuation token expires in 24 hours (86,400 seconds).
   * @param limit The max number of items to return for this API call. The value is set to 300 by default, but the max acceptable value is 1000.
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-membership-user-ids">LINE Developers documentation</a>
   */
  async getJoinedMembershipUsersWithHttpInfo(membershipId, start, limit) {
    const requestPath = buildPath("/v2/bot/membership/{membershipId}/users/ids", { membershipId });
    const queryParams = {
      start,
      limit,
    };
    if (queryParams["start"] === void 0) delete queryParams["start"];
    if (queryParams["limit"] === void 0) delete queryParams["limit"];
    const res = await this.httpClient.get(requestPath, queryParams);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Get a list of memberships.
   * Calls `GET https://api.line.me/v2/bot/membership/list`.
   * To inspect the HTTP status code or response headers, use {@link getMembershipListWithHttpInfo}.
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-membership-plans">LINE Developers documentation</a>
   */
  async getMembershipList() {
    return (await this.getMembershipListWithHttpInfo()).body;
  }
  /**
   * Get a list of memberships.
   * Calls `GET https://api.line.me/v2/bot/membership/list`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-membership-plans">LINE Developers documentation</a>
   */
  async getMembershipListWithHttpInfo() {
    const res = await this.httpClient.get("/v2/bot/membership/list");
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Get a user's membership subscription.
   * Calls `GET https://api.line.me/v2/bot/membership/subscription/{userId}`.
   * To inspect the HTTP status code or response headers, use {@link getMembershipSubscriptionWithHttpInfo}.
   * @param userId User ID
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-a-users-membership-subscription-status">LINE Developers documentation</a>
   */
  async getMembershipSubscription(userId) {
    return (await this.getMembershipSubscriptionWithHttpInfo(userId)).body;
  }
  /**
   * Get a user's membership subscription.
   * Calls `GET https://api.line.me/v2/bot/membership/subscription/{userId}`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param userId User ID
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-a-users-membership-subscription-status">LINE Developers documentation</a>
   */
  async getMembershipSubscriptionWithHttpInfo(userId) {
    const requestPath = buildPath("/v2/bot/membership/subscription/{userId}", { userId });
    const res = await this.httpClient.get(requestPath);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Gets the target limit for sending messages in the current month. The total number of the free messages and the additional messages is returned.
   * Calls `GET https://api.line.me/v2/bot/message/quota`.
   * To inspect the HTTP status code or response headers, use {@link getMessageQuotaWithHttpInfo}.
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-quota">LINE Developers documentation</a>
   */
  async getMessageQuota() {
    return (await this.getMessageQuotaWithHttpInfo()).body;
  }
  /**
   * Gets the target limit for sending messages in the current month. The total number of the free messages and the additional messages is returned.
   * Calls `GET https://api.line.me/v2/bot/message/quota`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-quota">LINE Developers documentation</a>
   */
  async getMessageQuotaWithHttpInfo() {
    const res = await this.httpClient.get("/v2/bot/message/quota");
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Gets the number of messages sent in the current month.
   * Calls `GET https://api.line.me/v2/bot/message/quota/consumption`.
   * To inspect the HTTP status code or response headers, use {@link getMessageQuotaConsumptionWithHttpInfo}.
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-consumption">LINE Developers documentation</a>
   */
  async getMessageQuotaConsumption() {
    return (await this.getMessageQuotaConsumptionWithHttpInfo()).body;
  }
  /**
   * Gets the number of messages sent in the current month.
   * Calls `GET https://api.line.me/v2/bot/message/quota/consumption`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-consumption">LINE Developers documentation</a>
   */
  async getMessageQuotaConsumptionWithHttpInfo() {
    const res = await this.httpClient.get("/v2/bot/message/quota/consumption");
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Gets the status of a narrowcast message.
   * Calls `GET https://api.line.me/v2/bot/message/progress/narrowcast`.
   * To inspect the HTTP status code or response headers, use {@link getNarrowcastProgressWithHttpInfo}.
   * @param requestId The narrowcast message's request ID. Each Messaging API request has a request ID.
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-narrowcast-progress-status">LINE Developers documentation</a>
   */
  async getNarrowcastProgress(requestId) {
    return (await this.getNarrowcastProgressWithHttpInfo(requestId)).body;
  }
  /**
   * Gets the status of a narrowcast message.
   * Calls `GET https://api.line.me/v2/bot/message/progress/narrowcast`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param requestId The narrowcast message's request ID. Each Messaging API request has a request ID.
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-narrowcast-progress-status">LINE Developers documentation</a>
   */
  async getNarrowcastProgressWithHttpInfo(requestId) {
    const queryParams = { requestId };
    const res = await this.httpClient.get("/v2/bot/message/progress/narrowcast", queryParams);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Get number of sent broadcast messages
   * Calls `GET https://api.line.me/v2/bot/message/delivery/broadcast`.
   * To inspect the HTTP status code or response headers, use {@link getNumberOfSentBroadcastMessagesWithHttpInfo}.
   * @param date Date the messages were sent  Format: yyyyMMdd (e.g. 20191231) Timezone: UTC+9
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-number-of-broadcast-messages">LINE Developers documentation</a>
   */
  async getNumberOfSentBroadcastMessages(date) {
    return (await this.getNumberOfSentBroadcastMessagesWithHttpInfo(date)).body;
  }
  /**
   * Get number of sent broadcast messages
   * Calls `GET https://api.line.me/v2/bot/message/delivery/broadcast`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param date Date the messages were sent  Format: yyyyMMdd (e.g. 20191231) Timezone: UTC+9
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-number-of-broadcast-messages">LINE Developers documentation</a>
   */
  async getNumberOfSentBroadcastMessagesWithHttpInfo(date) {
    const queryParams = { date };
    const res = await this.httpClient.get("/v2/bot/message/delivery/broadcast", queryParams);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Get number of sent multicast messages
   * Calls `GET https://api.line.me/v2/bot/message/delivery/multicast`.
   * To inspect the HTTP status code or response headers, use {@link getNumberOfSentMulticastMessagesWithHttpInfo}.
   * @param date Date the messages were sent  Format: `yyyyMMdd` (e.g. `20191231`) Timezone: UTC+9
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-number-of-multicast-messages">LINE Developers documentation</a>
   */
  async getNumberOfSentMulticastMessages(date) {
    return (await this.getNumberOfSentMulticastMessagesWithHttpInfo(date)).body;
  }
  /**
   * Get number of sent multicast messages
   * Calls `GET https://api.line.me/v2/bot/message/delivery/multicast`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param date Date the messages were sent  Format: `yyyyMMdd` (e.g. `20191231`) Timezone: UTC+9
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-number-of-multicast-messages">LINE Developers documentation</a>
   */
  async getNumberOfSentMulticastMessagesWithHttpInfo(date) {
    const queryParams = { date };
    const res = await this.httpClient.get("/v2/bot/message/delivery/multicast", queryParams);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Get number of sent push messages
   * Calls `GET https://api.line.me/v2/bot/message/delivery/push`.
   * To inspect the HTTP status code or response headers, use {@link getNumberOfSentPushMessagesWithHttpInfo}.
   * @param date Date the messages were sent  Format: `yyyyMMdd` (e.g. `20191231`) Timezone: UTC+9
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-number-of-push-messages">LINE Developers documentation</a>
   */
  async getNumberOfSentPushMessages(date) {
    return (await this.getNumberOfSentPushMessagesWithHttpInfo(date)).body;
  }
  /**
   * Get number of sent push messages
   * Calls `GET https://api.line.me/v2/bot/message/delivery/push`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param date Date the messages were sent  Format: `yyyyMMdd` (e.g. `20191231`) Timezone: UTC+9
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-number-of-push-messages">LINE Developers documentation</a>
   */
  async getNumberOfSentPushMessagesWithHttpInfo(date) {
    const queryParams = { date };
    const res = await this.httpClient.get("/v2/bot/message/delivery/push", queryParams);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Get number of sent reply messages
   * Calls `GET https://api.line.me/v2/bot/message/delivery/reply`.
   * To inspect the HTTP status code or response headers, use {@link getNumberOfSentReplyMessagesWithHttpInfo}.
   * @param date Date the messages were sent  Format: `yyyyMMdd` (e.g. `20191231`) Timezone: UTC+9
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-number-of-reply-messages">LINE Developers documentation</a>
   */
  async getNumberOfSentReplyMessages(date) {
    return (await this.getNumberOfSentReplyMessagesWithHttpInfo(date)).body;
  }
  /**
   * Get number of sent reply messages
   * Calls `GET https://api.line.me/v2/bot/message/delivery/reply`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param date Date the messages were sent  Format: `yyyyMMdd` (e.g. `20191231`) Timezone: UTC+9
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-number-of-reply-messages">LINE Developers documentation</a>
   */
  async getNumberOfSentReplyMessagesWithHttpInfo(date) {
    const queryParams = { date };
    const res = await this.httpClient.get("/v2/bot/message/delivery/reply", queryParams);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Get number of sent LINE notification messages
   * Calls `GET https://api.line.me/v2/bot/message/delivery/pnp`.
   * To inspect the HTTP status code or response headers, use {@link getPNPMessageStatisticsWithHttpInfo}.
   * @param date Date the message was sent  Format: `yyyyMMdd` (Example:`20211231`) Time zone: UTC+9
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/partner-docs/#get-number-of-sent-line-notification-messages">LINE Developers documentation</a>
   */
  async getPNPMessageStatistics(date) {
    return (await this.getPNPMessageStatisticsWithHttpInfo(date)).body;
  }
  /**
   * Get number of sent LINE notification messages
   * Calls `GET https://api.line.me/v2/bot/message/delivery/pnp`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param date Date the message was sent  Format: `yyyyMMdd` (Example:`20211231`) Time zone: UTC+9
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/partner-docs/#get-number-of-sent-line-notification-messages">LINE Developers documentation</a>
   */
  async getPNPMessageStatisticsWithHttpInfo(date) {
    const queryParams = { date };
    const res = await this.httpClient.get("/v2/bot/message/delivery/pnp", queryParams);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Get profile
   * Calls `GET https://api.line.me/v2/bot/profile/{userId}`.
   * To inspect the HTTP status code or response headers, use {@link getProfileWithHttpInfo}.
   * @param userId User ID
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-profile">LINE Developers documentation</a>
   */
  async getProfile(userId) {
    return (await this.getProfileWithHttpInfo(userId)).body;
  }
  /**
   * Get profile
   * Calls `GET https://api.line.me/v2/bot/profile/{userId}`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param userId User ID
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-profile">LINE Developers documentation</a>
   */
  async getProfileWithHttpInfo(userId) {
    const requestPath = buildPath("/v2/bot/profile/{userId}", { userId });
    const res = await this.httpClient.get(requestPath);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Gets a rich menu via a rich menu ID.
   * Calls `GET https://api.line.me/v2/bot/richmenu/{richMenuId}`.
   * To inspect the HTTP status code or response headers, use {@link getRichMenuWithHttpInfo}.
   * @param richMenuId ID of a rich menu
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-rich-menu">LINE Developers documentation</a>
   */
  async getRichMenu(richMenuId) {
    return (await this.getRichMenuWithHttpInfo(richMenuId)).body;
  }
  /**
   * Gets a rich menu via a rich menu ID.
   * Calls `GET https://api.line.me/v2/bot/richmenu/{richMenuId}`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param richMenuId ID of a rich menu
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-rich-menu">LINE Developers documentation</a>
   */
  async getRichMenuWithHttpInfo(richMenuId) {
    const requestPath = buildPath("/v2/bot/richmenu/{richMenuId}", { richMenuId });
    const res = await this.httpClient.get(requestPath);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Get rich menu alias information
   * Calls `GET https://api.line.me/v2/bot/richmenu/alias/{richMenuAliasId}`.
   * To inspect the HTTP status code or response headers, use {@link getRichMenuAliasWithHttpInfo}.
   * @param richMenuAliasId The rich menu alias ID whose information you want to obtain.
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-rich-menu-alias-by-id">LINE Developers documentation</a>
   */
  async getRichMenuAlias(richMenuAliasId) {
    return (await this.getRichMenuAliasWithHttpInfo(richMenuAliasId)).body;
  }
  /**
   * Get rich menu alias information
   * Calls `GET https://api.line.me/v2/bot/richmenu/alias/{richMenuAliasId}`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param richMenuAliasId The rich menu alias ID whose information you want to obtain.
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-rich-menu-alias-by-id">LINE Developers documentation</a>
   */
  async getRichMenuAliasWithHttpInfo(richMenuAliasId) {
    const requestPath = buildPath("/v2/bot/richmenu/alias/{richMenuAliasId}", { richMenuAliasId });
    const res = await this.httpClient.get(requestPath);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Get list of rich menu alias
   * Calls `GET https://api.line.me/v2/bot/richmenu/alias/list`.
   * To inspect the HTTP status code or response headers, use {@link getRichMenuAliasListWithHttpInfo}.
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-rich-menu-alias-list">LINE Developers documentation</a>
   */
  async getRichMenuAliasList() {
    return (await this.getRichMenuAliasListWithHttpInfo()).body;
  }
  /**
   * Get list of rich menu alias
   * Calls `GET https://api.line.me/v2/bot/richmenu/alias/list`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-rich-menu-alias-list">LINE Developers documentation</a>
   */
  async getRichMenuAliasListWithHttpInfo() {
    const res = await this.httpClient.get("/v2/bot/richmenu/alias/list");
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Get the status of Replace or unlink a linked rich menus in batches.
   * Calls `GET https://api.line.me/v2/bot/richmenu/progress/batch`.
   * To inspect the HTTP status code or response headers, use {@link getRichMenuBatchProgressWithHttpInfo}.
   * @param requestId A request ID used to batch control the rich menu linked to the user. Each Messaging API request has a request ID.
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-batch-control-rich-menus-progress-status">LINE Developers documentation</a>
   */
  async getRichMenuBatchProgress(requestId) {
    return (await this.getRichMenuBatchProgressWithHttpInfo(requestId)).body;
  }
  /**
   * Get the status of Replace or unlink a linked rich menus in batches.
   * Calls `GET https://api.line.me/v2/bot/richmenu/progress/batch`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param requestId A request ID used to batch control the rich menu linked to the user. Each Messaging API request has a request ID.
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-batch-control-rich-menus-progress-status">LINE Developers documentation</a>
   */
  async getRichMenuBatchProgressWithHttpInfo(requestId) {
    const queryParams = { requestId };
    const res = await this.httpClient.get("/v2/bot/richmenu/progress/batch", queryParams);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Get rich menu ID of user
   * Calls `GET https://api.line.me/v2/bot/user/{userId}/richmenu`.
   * To inspect the HTTP status code or response headers, use {@link getRichMenuIdOfUserWithHttpInfo}.
   * @param userId User ID. Found in the `source` object of webhook event objects. Do not use the LINE ID used in LINE.
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-rich-menu-id-of-user">LINE Developers documentation</a>
   */
  async getRichMenuIdOfUser(userId) {
    return (await this.getRichMenuIdOfUserWithHttpInfo(userId)).body;
  }
  /**
   * Get rich menu ID of user
   * Calls `GET https://api.line.me/v2/bot/user/{userId}/richmenu`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param userId User ID. Found in the `source` object of webhook event objects. Do not use the LINE ID used in LINE.
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-rich-menu-id-of-user">LINE Developers documentation</a>
   */
  async getRichMenuIdOfUserWithHttpInfo(userId) {
    const requestPath = buildPath("/v2/bot/user/{userId}/richmenu", { userId });
    const res = await this.httpClient.get(requestPath);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Get rich menu list
   * Calls `GET https://api.line.me/v2/bot/richmenu/list`.
   * To inspect the HTTP status code or response headers, use {@link getRichMenuListWithHttpInfo}.
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-rich-menu-list">LINE Developers documentation</a>
   */
  async getRichMenuList() {
    return (await this.getRichMenuListWithHttpInfo()).body;
  }
  /**
   * Get rich menu list
   * Calls `GET https://api.line.me/v2/bot/richmenu/list`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-rich-menu-list">LINE Developers documentation</a>
   */
  async getRichMenuListWithHttpInfo() {
    const res = await this.httpClient.get("/v2/bot/richmenu/list");
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Get number of users in a multi-person chat
   * Calls `GET https://api.line.me/v2/bot/room/{roomId}/members/count`.
   * To inspect the HTTP status code or response headers, use {@link getRoomMemberCountWithHttpInfo}.
   * @param roomId Room ID
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-members-room-count">LINE Developers documentation</a>
   */
  async getRoomMemberCount(roomId) {
    return (await this.getRoomMemberCountWithHttpInfo(roomId)).body;
  }
  /**
   * Get number of users in a multi-person chat
   * Calls `GET https://api.line.me/v2/bot/room/{roomId}/members/count`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param roomId Room ID
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-members-room-count">LINE Developers documentation</a>
   */
  async getRoomMemberCountWithHttpInfo(roomId) {
    const requestPath = buildPath("/v2/bot/room/{roomId}/members/count", { roomId });
    const res = await this.httpClient.get(requestPath);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Get multi-person chat member profile
   * Calls `GET https://api.line.me/v2/bot/room/{roomId}/member/{userId}`.
   * To inspect the HTTP status code or response headers, use {@link getRoomMemberProfileWithHttpInfo}.
   * @param roomId Room ID
   * @param userId User ID
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-room-member-profile">LINE Developers documentation</a>
   */
  async getRoomMemberProfile(roomId, userId) {
    return (await this.getRoomMemberProfileWithHttpInfo(roomId, userId)).body;
  }
  /**
   * Get multi-person chat member profile
   * Calls `GET https://api.line.me/v2/bot/room/{roomId}/member/{userId}`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param roomId Room ID
   * @param userId User ID
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-room-member-profile">LINE Developers documentation</a>
   */
  async getRoomMemberProfileWithHttpInfo(roomId, userId) {
    const requestPath = buildPath("/v2/bot/room/{roomId}/member/{userId}", {
      roomId,
      userId,
    });
    const res = await this.httpClient.get(requestPath);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Get multi-person chat member user IDs
   * Calls `GET https://api.line.me/v2/bot/room/{roomId}/members/ids`.
   * To inspect the HTTP status code or response headers, use {@link getRoomMembersIdsWithHttpInfo}.
   * @param roomId Room ID
   * @param start Value of the continuation token found in the `next` property of the JSON object returned in the response. Include this parameter to get the next array of user IDs for the members of the group.
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-room-member-user-ids">LINE Developers documentation</a>
   */
  async getRoomMembersIds(roomId, start) {
    return (await this.getRoomMembersIdsWithHttpInfo(roomId, start)).body;
  }
  /**
   * Get multi-person chat member user IDs
   * Calls `GET https://api.line.me/v2/bot/room/{roomId}/members/ids`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param roomId Room ID
   * @param start Value of the continuation token found in the `next` property of the JSON object returned in the response. Include this parameter to get the next array of user IDs for the members of the group.
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-room-member-user-ids">LINE Developers documentation</a>
   */
  async getRoomMembersIdsWithHttpInfo(roomId, start) {
    const requestPath = buildPath("/v2/bot/room/{roomId}/members/ids", { roomId });
    const queryParams = { start };
    if (queryParams["start"] === void 0) delete queryParams["start"];
    const res = await this.httpClient.get(requestPath, queryParams);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Get webhook endpoint information
   * Calls `GET https://api.line.me/v2/bot/channel/webhook/endpoint`.
   * To inspect the HTTP status code or response headers, use {@link getWebhookEndpointWithHttpInfo}.
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-webhook-endpoint-information">LINE Developers documentation</a>
   */
  async getWebhookEndpoint() {
    return (await this.getWebhookEndpointWithHttpInfo()).body;
  }
  /**
   * Get webhook endpoint information
   * Calls `GET https://api.line.me/v2/bot/channel/webhook/endpoint`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-webhook-endpoint-information">LINE Developers documentation</a>
   */
  async getWebhookEndpointWithHttpInfo() {
    const res = await this.httpClient.get("/v2/bot/channel/webhook/endpoint");
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Issue link token
   * Calls `POST https://api.line.me/v2/bot/user/{userId}/linkToken`.
   * To inspect the HTTP status code or response headers, use {@link issueLinkTokenWithHttpInfo}.
   * @param userId User ID for the LINE account to be linked. Found in the `source` object of account link event objects. Do not use the LINE ID used in LINE.
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#issue-link-token">LINE Developers documentation</a>
   */
  async issueLinkToken(userId) {
    return (await this.issueLinkTokenWithHttpInfo(userId)).body;
  }
  /**
   * Issue link token
   * Calls `POST https://api.line.me/v2/bot/user/{userId}/linkToken`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param userId User ID for the LINE account to be linked. Found in the `source` object of account link event objects. Do not use the LINE ID used in LINE.
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#issue-link-token">LINE Developers documentation</a>
   */
  async issueLinkTokenWithHttpInfo(userId) {
    const requestPath = buildPath("/v2/bot/user/{userId}/linkToken", { userId });
    const res = await this.httpClient.post(requestPath);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Leave group chat
   * Calls `POST https://api.line.me/v2/bot/group/{groupId}/leave`.
   * To inspect the HTTP status code or response headers, use {@link leaveGroupWithHttpInfo}.
   * @param groupId Group ID
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#leave-group">LINE Developers documentation</a>
   */
  async leaveGroup(groupId) {
    return (await this.leaveGroupWithHttpInfo(groupId)).body;
  }
  /**
   * Leave group chat
   * Calls `POST https://api.line.me/v2/bot/group/{groupId}/leave`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param groupId Group ID
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#leave-group">LINE Developers documentation</a>
   */
  async leaveGroupWithHttpInfo(groupId) {
    const requestPath = buildPath("/v2/bot/group/{groupId}/leave", { groupId });
    const res = await this.httpClient.post(requestPath);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Leave multi-person chat
   * Calls `POST https://api.line.me/v2/bot/room/{roomId}/leave`.
   * To inspect the HTTP status code or response headers, use {@link leaveRoomWithHttpInfo}.
   * @param roomId Room ID
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#leave-room">LINE Developers documentation</a>
   */
  async leaveRoom(roomId) {
    return (await this.leaveRoomWithHttpInfo(roomId)).body;
  }
  /**
   * Leave multi-person chat
   * Calls `POST https://api.line.me/v2/bot/room/{roomId}/leave`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param roomId Room ID
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#leave-room">LINE Developers documentation</a>
   */
  async leaveRoomWithHttpInfo(roomId) {
    const requestPath = buildPath("/v2/bot/room/{roomId}/leave", { roomId });
    const res = await this.httpClient.post(requestPath);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Link rich menu to user.
   * Calls `POST https://api.line.me/v2/bot/user/{userId}/richmenu/{richMenuId}`.
   * To inspect the HTTP status code or response headers, use {@link linkRichMenuIdToUserWithHttpInfo}.
   * @param userId User ID. Found in the `source` object of webhook event objects. Do not use the LINE ID used in LINE.
   * @param richMenuId ID of a rich menu
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#link-rich-menu-to-user">LINE Developers documentation</a>
   */
  async linkRichMenuIdToUser(userId, richMenuId) {
    return (await this.linkRichMenuIdToUserWithHttpInfo(userId, richMenuId)).body;
  }
  /**
   * Link rich menu to user.
   * Calls `POST https://api.line.me/v2/bot/user/{userId}/richmenu/{richMenuId}`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param userId User ID. Found in the `source` object of webhook event objects. Do not use the LINE ID used in LINE.
   * @param richMenuId ID of a rich menu
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#link-rich-menu-to-user">LINE Developers documentation</a>
   */
  async linkRichMenuIdToUserWithHttpInfo(userId, richMenuId) {
    const requestPath = buildPath("/v2/bot/user/{userId}/richmenu/{richMenuId}", {
      userId,
      richMenuId,
    });
    const res = await this.httpClient.post(requestPath);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Link rich menu to multiple users
   * Calls `POST https://api.line.me/v2/bot/richmenu/bulk/link`.
   * To inspect the HTTP status code or response headers, use {@link linkRichMenuIdToUsersWithHttpInfo}.
   * @param richMenuBulkLinkRequest
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#link-rich-menu-to-users">LINE Developers documentation</a>
   */
  async linkRichMenuIdToUsers(richMenuBulkLinkRequest) {
    return (await this.linkRichMenuIdToUsersWithHttpInfo(richMenuBulkLinkRequest)).body;
  }
  /**
   * Link rich menu to multiple users
   * Calls `POST https://api.line.me/v2/bot/richmenu/bulk/link`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param richMenuBulkLinkRequest
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#link-rich-menu-to-users">LINE Developers documentation</a>
   */
  async linkRichMenuIdToUsersWithHttpInfo(richMenuBulkLinkRequest) {
    const params = richMenuBulkLinkRequest;
    const res = await this.httpClient.post("/v2/bot/richmenu/bulk/link", params);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Get a paginated list of coupons.
   * Calls `GET https://api.line.me/v2/bot/coupon`.
   * To inspect the HTTP status code or response headers, use {@link listCouponWithHttpInfo}.
   * @param status Filter coupons by their status.
   * @param start Pagination token to retrieve the next page of results.
   * @param limit Maximum number of coupons to return per request.
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-coupons-list">LINE Developers documentation</a>
   */
  async listCoupon(status, start, limit) {
    return (await this.listCouponWithHttpInfo(status, start, limit)).body;
  }
  /**
   * Get a paginated list of coupons.
   * Calls `GET https://api.line.me/v2/bot/coupon`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param status Filter coupons by their status.
   * @param start Pagination token to retrieve the next page of results.
   * @param limit Maximum number of coupons to return per request.
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-coupons-list">LINE Developers documentation</a>
   */
  async listCouponWithHttpInfo(status, start, limit) {
    const queryParams = {
      status: status != null ? [...status].join(",") : void 0,
      start,
      limit,
    };
    if (queryParams["status"] === void 0) delete queryParams["status"];
    if (queryParams["start"] === void 0) delete queryParams["start"];
    if (queryParams["limit"] === void 0) delete queryParams["limit"];
    const res = await this.httpClient.get("/v2/bot/coupon", queryParams);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Mark messages from users as read
   * Calls `POST https://api.line.me/v2/bot/message/markAsRead`.
   * To inspect the HTTP status code or response headers, use {@link markMessagesAsReadWithHttpInfo}.
   * @param markMessagesAsReadRequest
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/partner-docs/#mark-messages-from-users-as-read">LINE Developers documentation</a>
   */
  async markMessagesAsRead(markMessagesAsReadRequest) {
    return (await this.markMessagesAsReadWithHttpInfo(markMessagesAsReadRequest)).body;
  }
  /**
   * Mark messages from users as read
   * Calls `POST https://api.line.me/v2/bot/message/markAsRead`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param markMessagesAsReadRequest
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/partner-docs/#mark-messages-from-users-as-read">LINE Developers documentation</a>
   */
  async markMessagesAsReadWithHttpInfo(markMessagesAsReadRequest) {
    const params = markMessagesAsReadRequest;
    const res = await this.httpClient.post("/v2/bot/message/markAsRead", params);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Mark messages from users as read by token
   * Calls `POST https://api.line.me/v2/bot/chat/markAsRead`.
   * To inspect the HTTP status code or response headers, use {@link markMessagesAsReadByTokenWithHttpInfo}.
   * @param markMessagesAsReadByTokenRequest
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#mark-as-read">LINE Developers documentation</a>
   */
  async markMessagesAsReadByToken(markMessagesAsReadByTokenRequest) {
    return (await this.markMessagesAsReadByTokenWithHttpInfo(markMessagesAsReadByTokenRequest))
      .body;
  }
  /**
   * Mark messages from users as read by token
   * Calls `POST https://api.line.me/v2/bot/chat/markAsRead`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param markMessagesAsReadByTokenRequest
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#mark-as-read">LINE Developers documentation</a>
   */
  async markMessagesAsReadByTokenWithHttpInfo(markMessagesAsReadByTokenRequest) {
    const params = markMessagesAsReadByTokenRequest;
    const res = await this.httpClient.post("/v2/bot/chat/markAsRead", params);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * An API that efficiently sends the same message to multiple user IDs. You can't send messages to group chats or multi-person chats.
   * Calls `POST https://api.line.me/v2/bot/message/multicast`.
   * To inspect the HTTP status code or response headers, use {@link multicastWithHttpInfo}.
   * @param multicastRequest
   * @param xLineRetryKey Retry key. Specifies the UUID in hexadecimal format (e.g., `123e4567-e89b-12d3-a456-426614174000`) generated by any method. The retry key isn't generated by LINE. Each developer must generate their own retry key.
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#send-multicast-message">LINE Developers documentation</a>
   */
  async multicast(multicastRequest, xLineRetryKey) {
    return (await this.multicastWithHttpInfo(multicastRequest, xLineRetryKey)).body;
  }
  /**
   * An API that efficiently sends the same message to multiple user IDs. You can't send messages to group chats or multi-person chats.
   * Calls `POST https://api.line.me/v2/bot/message/multicast`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param multicastRequest
   * @param xLineRetryKey Retry key. Specifies the UUID in hexadecimal format (e.g., `123e4567-e89b-12d3-a456-426614174000`) generated by any method. The retry key isn't generated by LINE. Each developer must generate their own retry key.
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#send-multicast-message">LINE Developers documentation</a>
   */
  async multicastWithHttpInfo(multicastRequest, xLineRetryKey) {
    const params = multicastRequest;
    const headerParams = {
      ...(xLineRetryKey != null ? { "X-Line-Retry-Key": xLineRetryKey } : {}),
    };
    const res = await this.httpClient.post("/v2/bot/message/multicast", params, {
      headers: headerParams,
    });
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Send narrowcast message
   * Calls `POST https://api.line.me/v2/bot/message/narrowcast`.
   * To inspect the HTTP status code or response headers, use {@link narrowcastWithHttpInfo}.
   * @param narrowcastRequest
   * @param xLineRetryKey Retry key. Specifies the UUID in hexadecimal format (e.g., `123e4567-e89b-12d3-a456-426614174000`) generated by any method. The retry key isn't generated by LINE. Each developer must generate their own retry key.
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#send-narrowcast-message">LINE Developers documentation</a>
   */
  async narrowcast(narrowcastRequest, xLineRetryKey) {
    return (await this.narrowcastWithHttpInfo(narrowcastRequest, xLineRetryKey)).body;
  }
  /**
   * Send narrowcast message
   * Calls `POST https://api.line.me/v2/bot/message/narrowcast`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param narrowcastRequest
   * @param xLineRetryKey Retry key. Specifies the UUID in hexadecimal format (e.g., `123e4567-e89b-12d3-a456-426614174000`) generated by any method. The retry key isn't generated by LINE. Each developer must generate their own retry key.
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#send-narrowcast-message">LINE Developers documentation</a>
   */
  async narrowcastWithHttpInfo(narrowcastRequest, xLineRetryKey) {
    const params = narrowcastRequest;
    const headerParams = {
      ...(xLineRetryKey != null ? { "X-Line-Retry-Key": xLineRetryKey } : {}),
    };
    const res = await this.httpClient.post("/v2/bot/message/narrowcast", params, {
      headers: headerParams,
    });
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Sends a message to a user, group chat, or multi-person chat at any time.
   * Calls `POST https://api.line.me/v2/bot/message/push`.
   * To inspect the HTTP status code or response headers, use {@link pushMessageWithHttpInfo}.
   * @param pushMessageRequest
   * @param xLineRetryKey Retry key. Specifies the UUID in hexadecimal format (e.g., `123e4567-e89b-12d3-a456-426614174000`) generated by any method. The retry key isn't generated by LINE. Each developer must generate their own retry key.
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#send-push-message">LINE Developers documentation</a>
   */
  async pushMessage(pushMessageRequest, xLineRetryKey) {
    return (await this.pushMessageWithHttpInfo(pushMessageRequest, xLineRetryKey)).body;
  }
  /**
   * Sends a message to a user, group chat, or multi-person chat at any time.
   * Calls `POST https://api.line.me/v2/bot/message/push`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param pushMessageRequest
   * @param xLineRetryKey Retry key. Specifies the UUID in hexadecimal format (e.g., `123e4567-e89b-12d3-a456-426614174000`) generated by any method. The retry key isn't generated by LINE. Each developer must generate their own retry key.
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#send-push-message">LINE Developers documentation</a>
   */
  async pushMessageWithHttpInfo(pushMessageRequest, xLineRetryKey) {
    const params = pushMessageRequest;
    const headerParams = {
      ...(xLineRetryKey != null ? { "X-Line-Retry-Key": xLineRetryKey } : {}),
    };
    const res = await this.httpClient.post("/v2/bot/message/push", params, {
      headers: headerParams,
    });
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Send LINE notification message
   * Calls `POST https://api.line.me/bot/pnp/push`.
   * To inspect the HTTP status code or response headers, use {@link pushMessagesByPhoneWithHttpInfo}.
   * @param pnpMessagesRequest
   * @param xLineDeliveryTag String returned in the delivery.data property of the delivery completion event via Webhook.
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/partner-docs/#send-line-notification-message">LINE Developers documentation</a>
   */
  async pushMessagesByPhone(pnpMessagesRequest, xLineDeliveryTag) {
    return (await this.pushMessagesByPhoneWithHttpInfo(pnpMessagesRequest, xLineDeliveryTag)).body;
  }
  /**
   * Send LINE notification message
   * Calls `POST https://api.line.me/bot/pnp/push`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param pnpMessagesRequest
   * @param xLineDeliveryTag String returned in the delivery.data property of the delivery completion event via Webhook.
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/partner-docs/#send-line-notification-message">LINE Developers documentation</a>
   */
  async pushMessagesByPhoneWithHttpInfo(pnpMessagesRequest, xLineDeliveryTag) {
    const params = pnpMessagesRequest;
    const headerParams = {
      ...(xLineDeliveryTag != null ? { "X-Line-Delivery-Tag": xLineDeliveryTag } : {}),
    };
    const res = await this.httpClient.post("/bot/pnp/push", params, { headers: headerParams });
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Send reply message
   * Calls `POST https://api.line.me/v2/bot/message/reply`.
   * To inspect the HTTP status code or response headers, use {@link replyMessageWithHttpInfo}.
   * @param replyMessageRequest
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#send-reply-message">LINE Developers documentation</a>
   */
  async replyMessage(replyMessageRequest) {
    return (await this.replyMessageWithHttpInfo(replyMessageRequest)).body;
  }
  /**
   * Send reply message
   * Calls `POST https://api.line.me/v2/bot/message/reply`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param replyMessageRequest
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#send-reply-message">LINE Developers documentation</a>
   */
  async replyMessageWithHttpInfo(replyMessageRequest) {
    const params = replyMessageRequest;
    const res = await this.httpClient.post("/v2/bot/message/reply", params);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * You can use this endpoint to batch control the rich menu linked to the users using the endpoint such as Link rich menu to user. The following operations are available:  1. Replace a rich menu with another rich menu for all users linked to a specific rich menu 2. Unlink a rich menu for all users linked to a specific rich menu 3. Unlink a rich menu for all users linked the rich menu
   * Calls `POST https://api.line.me/v2/bot/richmenu/batch`.
   * To inspect the HTTP status code or response headers, use {@link richMenuBatchWithHttpInfo}.
   * @param richMenuBatchRequest
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#batch-control-rich-menus-of-users">LINE Developers documentation</a>
   */
  async richMenuBatch(richMenuBatchRequest) {
    return (await this.richMenuBatchWithHttpInfo(richMenuBatchRequest)).body;
  }
  /**
   * You can use this endpoint to batch control the rich menu linked to the users using the endpoint such as Link rich menu to user. The following operations are available:  1. Replace a rich menu with another rich menu for all users linked to a specific rich menu 2. Unlink a rich menu for all users linked to a specific rich menu 3. Unlink a rich menu for all users linked the rich menu
   * Calls `POST https://api.line.me/v2/bot/richmenu/batch`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param richMenuBatchRequest
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#batch-control-rich-menus-of-users">LINE Developers documentation</a>
   */
  async richMenuBatchWithHttpInfo(richMenuBatchRequest) {
    const params = richMenuBatchRequest;
    const res = await this.httpClient.post("/v2/bot/richmenu/batch", params);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Set default rich menu
   * Calls `POST https://api.line.me/v2/bot/user/all/richmenu/{richMenuId}`.
   * To inspect the HTTP status code or response headers, use {@link setDefaultRichMenuWithHttpInfo}.
   * @param richMenuId ID of a rich menu
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#set-default-rich-menu">LINE Developers documentation</a>
   */
  async setDefaultRichMenu(richMenuId) {
    return (await this.setDefaultRichMenuWithHttpInfo(richMenuId)).body;
  }
  /**
   * Set default rich menu
   * Calls `POST https://api.line.me/v2/bot/user/all/richmenu/{richMenuId}`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param richMenuId ID of a rich menu
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#set-default-rich-menu">LINE Developers documentation</a>
   */
  async setDefaultRichMenuWithHttpInfo(richMenuId) {
    const requestPath = buildPath("/v2/bot/user/all/richmenu/{richMenuId}", { richMenuId });
    const res = await this.httpClient.post(requestPath);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Set webhook endpoint URL
   * Calls `PUT https://api.line.me/v2/bot/channel/webhook/endpoint`.
   * To inspect the HTTP status code or response headers, use {@link setWebhookEndpointWithHttpInfo}.
   * @param setWebhookEndpointRequest
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#set-webhook-endpoint-url">LINE Developers documentation</a>
   */
  async setWebhookEndpoint(setWebhookEndpointRequest) {
    return (await this.setWebhookEndpointWithHttpInfo(setWebhookEndpointRequest)).body;
  }
  /**
   * Set webhook endpoint URL
   * Calls `PUT https://api.line.me/v2/bot/channel/webhook/endpoint`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param setWebhookEndpointRequest
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#set-webhook-endpoint-url">LINE Developers documentation</a>
   */
  async setWebhookEndpointWithHttpInfo(setWebhookEndpointRequest) {
    const params = setWebhookEndpointRequest;
    const res = await this.httpClient.put("/v2/bot/channel/webhook/endpoint", params);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Display a loading animation in one-on-one chats between users and LINE Official Accounts.
   * Calls `POST https://api.line.me/v2/bot/chat/loading/start`.
   * To inspect the HTTP status code or response headers, use {@link showLoadingAnimationWithHttpInfo}.
   * @param showLoadingAnimationRequest
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#display-a-loading-indicator">LINE Developers documentation</a>
   */
  async showLoadingAnimation(showLoadingAnimationRequest) {
    return (await this.showLoadingAnimationWithHttpInfo(showLoadingAnimationRequest)).body;
  }
  /**
   * Display a loading animation in one-on-one chats between users and LINE Official Accounts.
   * Calls `POST https://api.line.me/v2/bot/chat/loading/start`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param showLoadingAnimationRequest
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#display-a-loading-indicator">LINE Developers documentation</a>
   */
  async showLoadingAnimationWithHttpInfo(showLoadingAnimationRequest) {
    const params = showLoadingAnimationRequest;
    const res = await this.httpClient.post("/v2/bot/chat/loading/start", params);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Test webhook endpoint
   * Calls `POST https://api.line.me/v2/bot/channel/webhook/test`.
   * To inspect the HTTP status code or response headers, use {@link testWebhookEndpointWithHttpInfo}.
   * @param testWebhookEndpointRequest
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#test-webhook-endpoint">LINE Developers documentation</a>
   */
  async testWebhookEndpoint(testWebhookEndpointRequest) {
    return (await this.testWebhookEndpointWithHttpInfo(testWebhookEndpointRequest)).body;
  }
  /**
   * Test webhook endpoint
   * Calls `POST https://api.line.me/v2/bot/channel/webhook/test`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param testWebhookEndpointRequest
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#test-webhook-endpoint">LINE Developers documentation</a>
   */
  async testWebhookEndpointWithHttpInfo(testWebhookEndpointRequest) {
    const params = testWebhookEndpointRequest;
    const res = await this.httpClient.post("/v2/bot/channel/webhook/test", params);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Unlink rich menu from user
   * Calls `DELETE https://api.line.me/v2/bot/user/{userId}/richmenu`.
   * To inspect the HTTP status code or response headers, use {@link unlinkRichMenuIdFromUserWithHttpInfo}.
   * @param userId User ID. Found in the `source` object of webhook event objects. Do not use the LINE ID used in LINE.
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#unlink-rich-menu-from-user">LINE Developers documentation</a>
   */
  async unlinkRichMenuIdFromUser(userId) {
    return (await this.unlinkRichMenuIdFromUserWithHttpInfo(userId)).body;
  }
  /**
   * Unlink rich menu from user
   * Calls `DELETE https://api.line.me/v2/bot/user/{userId}/richmenu`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param userId User ID. Found in the `source` object of webhook event objects. Do not use the LINE ID used in LINE.
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#unlink-rich-menu-from-user">LINE Developers documentation</a>
   */
  async unlinkRichMenuIdFromUserWithHttpInfo(userId) {
    const requestPath = buildPath("/v2/bot/user/{userId}/richmenu", { userId });
    const res = await this.httpClient.delete(requestPath);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Unlink rich menus from multiple users
   * Calls `POST https://api.line.me/v2/bot/richmenu/bulk/unlink`.
   * To inspect the HTTP status code or response headers, use {@link unlinkRichMenuIdFromUsersWithHttpInfo}.
   * @param richMenuBulkUnlinkRequest
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#unlink-rich-menu-from-users">LINE Developers documentation</a>
   */
  async unlinkRichMenuIdFromUsers(richMenuBulkUnlinkRequest) {
    return (await this.unlinkRichMenuIdFromUsersWithHttpInfo(richMenuBulkUnlinkRequest)).body;
  }
  /**
   * Unlink rich menus from multiple users
   * Calls `POST https://api.line.me/v2/bot/richmenu/bulk/unlink`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param richMenuBulkUnlinkRequest
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#unlink-rich-menu-from-users">LINE Developers documentation</a>
   */
  async unlinkRichMenuIdFromUsersWithHttpInfo(richMenuBulkUnlinkRequest) {
    const params = richMenuBulkUnlinkRequest;
    const res = await this.httpClient.post("/v2/bot/richmenu/bulk/unlink", params);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Update rich menu alias
   * Calls `POST https://api.line.me/v2/bot/richmenu/alias/{richMenuAliasId}`.
   * To inspect the HTTP status code or response headers, use {@link updateRichMenuAliasWithHttpInfo}.
   * @param richMenuAliasId The rich menu alias ID you want to update.
   * @param updateRichMenuAliasRequest
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#update-rich-menu-alias">LINE Developers documentation</a>
   */
  async updateRichMenuAlias(richMenuAliasId, updateRichMenuAliasRequest) {
    return (await this.updateRichMenuAliasWithHttpInfo(richMenuAliasId, updateRichMenuAliasRequest))
      .body;
  }
  /**
   * Update rich menu alias
   * Calls `POST https://api.line.me/v2/bot/richmenu/alias/{richMenuAliasId}`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param richMenuAliasId The rich menu alias ID you want to update.
   * @param updateRichMenuAliasRequest
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#update-rich-menu-alias">LINE Developers documentation</a>
   */
  async updateRichMenuAliasWithHttpInfo(richMenuAliasId, updateRichMenuAliasRequest) {
    const requestPath = buildPath("/v2/bot/richmenu/alias/{richMenuAliasId}", { richMenuAliasId });
    const params = updateRichMenuAliasRequest;
    const res = await this.httpClient.post(requestPath, params);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Validate message objects of a broadcast message
   * Calls `POST https://api.line.me/v2/bot/message/validate/broadcast`.
   * To inspect the HTTP status code or response headers, use {@link validateBroadcastWithHttpInfo}.
   * @param validateMessageRequest
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#validate-message-objects-of-broadcast-message">LINE Developers documentation</a>
   */
  async validateBroadcast(validateMessageRequest) {
    return (await this.validateBroadcastWithHttpInfo(validateMessageRequest)).body;
  }
  /**
   * Validate message objects of a broadcast message
   * Calls `POST https://api.line.me/v2/bot/message/validate/broadcast`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param validateMessageRequest
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#validate-message-objects-of-broadcast-message">LINE Developers documentation</a>
   */
  async validateBroadcastWithHttpInfo(validateMessageRequest) {
    const params = validateMessageRequest;
    const res = await this.httpClient.post("/v2/bot/message/validate/broadcast", params);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Validate message objects of a multicast message
   * Calls `POST https://api.line.me/v2/bot/message/validate/multicast`.
   * To inspect the HTTP status code or response headers, use {@link validateMulticastWithHttpInfo}.
   * @param validateMessageRequest
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#validate-message-objects-of-multicast-message">LINE Developers documentation</a>
   */
  async validateMulticast(validateMessageRequest) {
    return (await this.validateMulticastWithHttpInfo(validateMessageRequest)).body;
  }
  /**
   * Validate message objects of a multicast message
   * Calls `POST https://api.line.me/v2/bot/message/validate/multicast`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param validateMessageRequest
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#validate-message-objects-of-multicast-message">LINE Developers documentation</a>
   */
  async validateMulticastWithHttpInfo(validateMessageRequest) {
    const params = validateMessageRequest;
    const res = await this.httpClient.post("/v2/bot/message/validate/multicast", params);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Validate message objects of a narrowcast message
   * Calls `POST https://api.line.me/v2/bot/message/validate/narrowcast`.
   * To inspect the HTTP status code or response headers, use {@link validateNarrowcastWithHttpInfo}.
   * @param validateMessageRequest
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#validate-message-objects-of-narrowcast-message">LINE Developers documentation</a>
   */
  async validateNarrowcast(validateMessageRequest) {
    return (await this.validateNarrowcastWithHttpInfo(validateMessageRequest)).body;
  }
  /**
   * Validate message objects of a narrowcast message
   * Calls `POST https://api.line.me/v2/bot/message/validate/narrowcast`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param validateMessageRequest
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#validate-message-objects-of-narrowcast-message">LINE Developers documentation</a>
   */
  async validateNarrowcastWithHttpInfo(validateMessageRequest) {
    const params = validateMessageRequest;
    const res = await this.httpClient.post("/v2/bot/message/validate/narrowcast", params);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Validate message objects of a push message
   * Calls `POST https://api.line.me/v2/bot/message/validate/push`.
   * To inspect the HTTP status code or response headers, use {@link validatePushWithHttpInfo}.
   * @param validateMessageRequest
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#validate-message-objects-of-push-message">LINE Developers documentation</a>
   */
  async validatePush(validateMessageRequest) {
    return (await this.validatePushWithHttpInfo(validateMessageRequest)).body;
  }
  /**
   * Validate message objects of a push message
   * Calls `POST https://api.line.me/v2/bot/message/validate/push`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param validateMessageRequest
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#validate-message-objects-of-push-message">LINE Developers documentation</a>
   */
  async validatePushWithHttpInfo(validateMessageRequest) {
    const params = validateMessageRequest;
    const res = await this.httpClient.post("/v2/bot/message/validate/push", params);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Validate message objects of a reply message
   * Calls `POST https://api.line.me/v2/bot/message/validate/reply`.
   * To inspect the HTTP status code or response headers, use {@link validateReplyWithHttpInfo}.
   * @param validateMessageRequest
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#validate-message-objects-of-reply-message">LINE Developers documentation</a>
   */
  async validateReply(validateMessageRequest) {
    return (await this.validateReplyWithHttpInfo(validateMessageRequest)).body;
  }
  /**
   * Validate message objects of a reply message
   * Calls `POST https://api.line.me/v2/bot/message/validate/reply`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param validateMessageRequest
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#validate-message-objects-of-reply-message">LINE Developers documentation</a>
   */
  async validateReplyWithHttpInfo(validateMessageRequest) {
    const params = validateMessageRequest;
    const res = await this.httpClient.post("/v2/bot/message/validate/reply", params);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Validate a request body of the Replace or unlink the linked rich menus in batches endpoint.
   * Calls `POST https://api.line.me/v2/bot/richmenu/validate/batch`.
   * To inspect the HTTP status code or response headers, use {@link validateRichMenuBatchRequestWithHttpInfo}.
   * @param richMenuBatchRequest
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#validate-batch-control-rich-menus-request">LINE Developers documentation</a>
   */
  async validateRichMenuBatchRequest(richMenuBatchRequest) {
    return (await this.validateRichMenuBatchRequestWithHttpInfo(richMenuBatchRequest)).body;
  }
  /**
   * Validate a request body of the Replace or unlink the linked rich menus in batches endpoint.
   * Calls `POST https://api.line.me/v2/bot/richmenu/validate/batch`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param richMenuBatchRequest
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#validate-batch-control-rich-menus-request">LINE Developers documentation</a>
   */
  async validateRichMenuBatchRequestWithHttpInfo(richMenuBatchRequest) {
    const params = richMenuBatchRequest;
    const res = await this.httpClient.post("/v2/bot/richmenu/validate/batch", params);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
  /**
   * Validate rich menu object
   * Calls `POST https://api.line.me/v2/bot/richmenu/validate`.
   * To inspect the HTTP status code or response headers, use {@link validateRichMenuObjectWithHttpInfo}.
   * @param richMenuRequest
   * @returns A promise resolving to the response body.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#validate-rich-menu-object">LINE Developers documentation</a>
   */
  async validateRichMenuObject(richMenuRequest) {
    return (await this.validateRichMenuObjectWithHttpInfo(richMenuRequest)).body;
  }
  /**
   * Validate rich menu object
   * Calls `POST https://api.line.me/v2/bot/richmenu/validate`.
   * This method returns the response body together with the underlying `httpResponse`.
   * @param richMenuRequest
   * @returns A promise resolving to the response body together with the underlying `httpResponse`.
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#validate-rich-menu-object">LINE Developers documentation</a>
   */
  async validateRichMenuObjectWithHttpInfo(richMenuRequest) {
    const params = richMenuRequest;
    const res = await this.httpClient.post("/v2/bot/richmenu/validate", params);
    const text = await res.text();
    return {
      httpResponse: res,
      body: text ? JSON.parse(text) : null,
    };
  }
};
//#endregion
export {
  buildPath as a,
  mergeHeaders as i,
  HTTPFetchClient as n,
  convertResponseToReadable as r,
  MessagingApiClient as t,
};
