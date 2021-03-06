import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    useResponse?: boolean;
  }
}
// prettier-ignore
export interface CustomAxiosInstance extends AxiosInstance {
  request<T = any, R = AxiosResponse<T>> (config: AxiosRequestConfig & { useResponse: true }): Promise<R>;
  request<T = any>(config: AxiosRequestConfig): Promise<T>;
  
  get<T = any, R = AxiosResponse<T>>(url: string, config: AxiosRequestConfig & { useResponse: true }): Promise<R>;
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;

  delete<T = any, R = AxiosResponse<T>>(url: string, config: AxiosRequestConfig & { useResponse: true }): Promise<R>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;

  head<T = any, R = AxiosResponse<T>>(url: string, config: AxiosRequestConfig & { useResponse: true }): Promise<R>;
  head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;

  options<T = any, R = AxiosResponse<T>>(url: string, config: AxiosRequestConfig & { useResponse: true }): Promise<R>;
  options<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig & { useResponse: true }): Promise<R>;

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig & { useResponse: true }): Promise<R>;
  
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  patch<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig & { useResponse: true }): Promise<R>;
}

function createCustomAxiosInstance(config: AxiosRequestConfig): CustomAxiosInstance {
  const instance = axios.create(config);

  instance.interceptors.response.use(response => {
    return response.config.useResponse ? response : response.data;
  });

  return instance;
}

export const api = createCustomAxiosInstance({
  baseURL: '/api'
});
