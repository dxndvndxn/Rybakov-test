import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

class Http {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: `http://localhost:3000/api/v1`,
    });

    this.init();
  }

  private init() {
    this.instance.interceptors.request.use((config) => {
      config.validateStatus = (status) => {
        if (status === 409) return false;
        return status < 300;
      };

      return config;
    });
  }

  private async requestWrapper<T>(request: Promise<AxiosResponse<T>>) {
    try {
      const response = await request;

      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  get<T>(url: string, config?: AxiosRequestConfig | undefined) {
    return this.requestWrapper<T>(this.instance.get<T>(url, config));
  }

  post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig | undefined,
  ) {
    return this.requestWrapper<T>(this.instance.post<T>(url, data, config));
  }
}

export const http = new Http();
