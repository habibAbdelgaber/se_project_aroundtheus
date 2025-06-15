export default class APIClient {
  constructor(options) {
    this.baseUrl = options.baseUrl;
  }
  async _request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();

    const method = options.method || "GET";
    const headers = {
      "Content-Type": "application/json",
      ...(this.headers || {}),
      ...(options.headers || {}),
    };

    const config = {
      method,
      headers,
      signal: controller.signal,
    };

    // Only attach the body if it’s not a GET or HEAD request
    if (options.body && method !== "GET" && method !== "HEAD") {
      config.body = options.body;
    }

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Request timed out.");
      }
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Network error: Unable to reach the server.");
      }
      throw new Error(`API Request failed: ${error.message}`);
    }
  }

  // GET request
  async get(endpoint, options = {}) {
    return this._request(endpoint, { method: "GET", ...options });
  }

  // POST request
  async post(endpoint, data, options = {}) {
    return this._request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    });
  }

  // PUT request
  async put(endpoint, data, options = {}) {
    return this._request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    });
  }

  // PATCH request
  async patch(endpoint, data, options = {}) {
    return this._request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
      ...options,
    });
  }

  // DELETE request
  async delete(endpoint, options = {}) {
    return this._request(endpoint, { method: "DELETE", ...options });
  }
}
