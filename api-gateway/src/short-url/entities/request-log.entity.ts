export interface RequestEntity {
  request_id: string; 
  correlation_id: string; 
  action: string; 
  url: string; 
  headers: Record<string, unknown>; 
  body: Record<string, unknown>;
  query: Record<string, unknown>;
  response: Record<string, unknown>; 
  timestamp: Date;
}
