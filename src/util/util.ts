export function createRequest(url: string, method: string, body?: any): Request {
  const fullUrl = window.location.hostname.includes('localhost') ? `http://localhost:8080/${url}` : url;
  const token = localStorage.getItem('access_token');
  const options = {
    method,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      'Content-Type': method === 'POST' && 'application/json'
    },
    mode: 'cors',
    body: body || undefined
  } as RequestInit;
  console.log(options);
  return new Request(fullUrl, options);
}
